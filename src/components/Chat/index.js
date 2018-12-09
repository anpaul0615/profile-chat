import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ChatHeader from './Header';
import ChatBody from './Body';
import * as libs from '../../lib';

/* Style-Wrapper */
const ChatWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`;
/* Component */
class Chat extends React.Component {
  constructor(props) {
    super(props);
    const { getGlobalState, setGlobalState } = props;
    this.getGlobalState = getGlobalState;
    this.setGlobalState = setGlobalState;
    this.state = {
      messageBuffer: '',
      messages: [],
    };
  }

  componentDidMount() {
    global.window.document.addEventListener('keydown', this.handleSendMessageShortcut);
    this.initMessages();
    this.initMessageSubscribe();
  }

  componentWillUnmount() {
    global.window.document.removeEventListener('keydown', this.handleSendMessageShortcut);
  }

  initMessages = async () => {
    try {
      // Set Pending State To Start
      await this.setGlobalState({
        isPending: true,
      });
      // Get All Message History
      const { currentGroup, currentUser } = await this.getGlobalState();
      const messageHistory = await libs.apigwClient.invokeAPIGateway({
        path: '/messages',
        method: 'GET',
        queryParams: {
          groupId: currentGroup,
          startDate: '1000-01-01T00:00:00.000Z',
          endtDate: new Date().toISOString(),
          limit: 50,
        },
      }).then(result => result.data).catch(() => []);
      // Parse Message History
      const messages = messageHistory.map(e => ({
        isMine: e.userName === currentUser,
        userName: e.userName,
        content: e.content,
        regDate: e.regDate,
      })).reverse();
      this.setState(() => ({
        messages,
      }));
      // Move Scroll To Bottom
      this.moveMessageHistoryScollToBottom();
      // Set Pending State To Finish
      await this.setGlobalState({
        isPending: false,
      });
    } catch (e) {
      // console.log(e);
    }
  }

  initMessageSubscribe = async () => {
    try {
      // Get Credentials From Previous Session Data
      const cognitoCredentials = await libs.cognitoClient.getCredentials();
      // Init MQTT Connection
      const { currentGroup, currentUser } = await this.getGlobalState();
      libs.mqttClient.init(cognitoCredentials, currentUser);
      // Subscribe Message Group
      await libs.mqttClient.subscribe(currentGroup);
      libs.mqttClient.registerMessageCallback(this.handleRecievedMessage);
    } catch (e) {
      // console.log(e);
    }
  }

  initMessageHistoryScoll = (el) => {
    this.messageHistoryScrollDiv = el;
  }

  moveMessageHistoryScollToBottom = () => {
    if (this.messageHistoryScrollDiv) {
      this.messageHistoryScrollDiv.scrollIntoView(false);
    }
  }

  handleSignout = async () => {
    if (global.window.confirm('Signout Now?')) {
      try {
        libs.cognitoClient.signout();
        libs.cognitoClient.clearStorage();
        libs.mqttClient.disconnect();
        await this.setGlobalState({
          currentPage: '/signin',
          currentUser: '',
          currentGroup: '',
        });
        // Close Iframe Window
        global.window.parent.postMessage('chat-off', '*');
      } catch (e) {
        // console.log(e);
      }
    }
  }

  handleRecievedMessage = async (messageChunk) => {
    const newMessage = JSON.parse(messageChunk);
    const { currentUser } = await this.getGlobalState();
    newMessage.isMine = (newMessage.userName === currentUser);
    this.setState(prevState => ({
      messages: [...prevState.messages, newMessage],
    }));
    this.moveMessageHistoryScollToBottom();
  }

  handleInputMessage = (event) => {
    const messageBuffer = event.target.value;
    this.setState(() => ({
      messageBuffer,
    }));
  }

  handleSendMessage = async () => {
    try {
      const { messageBuffer } = this.state;
      if (messageBuffer === '') return;
      // Set Pending State To Start
      this.setGlobalState({
        isPending: true,
      });
      // Send Message to Database
      const { currentGroup, currentUser } = await this.getGlobalState();
      const messageBody = {
        groupId: currentGroup,
        regDate: new Date().toISOString(),
        content: messageBuffer,
        userName: currentUser,
      };
      await libs.apigwClient.invokeAPIGateway({
        path: '/messages',
        method: 'POST',
        body: messageBody,
      });
      // Send Message to MQTT
      await libs.mqttClient.publish(currentGroup, JSON.stringify(messageBody));
      // Clear MessageBuffer
      this.setState(() => ({
        messageBuffer: '',
      }));
      // Set Pending State To Finish
      this.setGlobalState({
        isPending: false,
      });
      // Move Scroll To Bottom
      this.moveMessageHistoryScollToBottom();
    } catch (e) {
      // console.log(e);
    }
  }

  handleSendMessageShortcut = (event) => {
    if (event.keyCode === 13 && event.ctrlKey) {
      this.handleSendMessage();
    }
  }

  handleMoveSignupPage = async () => {
    await this.setGlobalState({
      currentPage: '/group',
    });
  }

  handleGetOlderMessages = async () => {
    const { messages } = this.state;
    if (messages.length !== 0) {
      try {
        // Set Pending State To Start
        await this.setGlobalState({
          isPending: true,
        });
        // Get Older Message History
        const lastMessage = messages[0];
        const lastMessageTime = new Date(lastMessage.regDate).getTime() - 1;
        const { currentGroup, currentUser } = await this.getGlobalState();
        const messageHistory = await libs.apigwClient.invokeAPIGateway({
          path: '/messages',
          method: 'GET',
          queryParams: {
            groupId: currentGroup,
            startDate: '1000-01-01T00:00:00.000Z',
            endDate: new Date(lastMessageTime).toISOString(),
            limit: 50,
          },
        }).then(result => result.data).catch(() => []);
        // Parse Message History
        const olderMessages = (messageHistory || []).map(e => ({
          isMine: e.userName === currentUser,
          userName: e.userName,
          content: e.content,
          regDate: e.regDate,
        })).reverse();
        // Update Messages
        this.setState(prevState => ({
          messages: [...olderMessages, ...prevState.messages],
        }));
        // Set Pending State To Finish
        await this.setGlobalState({
          isPending: false,
        });
      } catch (e) {
        // console.log(e);
      }
    }
  }

  render() {
    const { messageBuffer, messages } = this.state;
    return (
      <ChatWrapper>
        <ChatHeader
          handleClickAppExitButton={this.handleSignout}
          handleClickOpenChatGroupButton={this.handleMoveSignupPage}
        />
        <ChatBody
          messages={messages}
          messageBuffer={messageBuffer}
          initMessageHistoryScoll={this.initMessageHistoryScoll}
          handleGetOlderMessages={this.handleGetOlderMessages}
          handleInputMessage={this.handleInputMessage}
          handleSendMessage={this.handleSendMessage}
        />
      </ChatWrapper>
    );
  }
}

Chat.propTypes = {
  getGlobalState: PropTypes.func.isRequired,
  setGlobalState: PropTypes.func.isRequired,
};

export default Chat;
