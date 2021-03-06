import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ChatGroupHeader from './Header';
import ChatGroupBody from './Body';
import * as libs from '../../lib';

/* Style-Wrapper */
const ChatGroupWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`;
/* Component */
class ChatGroup extends React.Component {
  constructor(props) {
    super(props);
    const { getGlobalState, setGlobalState } = props;
    this.getGlobalState = getGlobalState;
    this.setGlobalState = setGlobalState;
    this.state = {
      chatGroups: [],
    };
  }

  componentDidMount() {
    this.initChatGroups();
  }

  initChatGroups = async () => {
    try {
      const { currentUser } = await this.getGlobalState();
      const { data: chatGroups } = await libs.apigwClient.invokeAPIGateway({
        path: '/messages/group/search',
        method: 'GET',
        queryParams: { userName: currentUser },
      });
      this.setState(() => ({
        chatGroups,
      }));
    } catch (e) {
      // console.log(e);
    }
  }

  handleCloseChatGroupPage = async () => {
    await this.setGlobalState({
      currentPage: '/',
    });
  }

  handleChangeCurrentChatGroup = async (changeGroup) => {
    try {
      // Set Pending State To Start
      await this.setGlobalState({
        isPending: true,
      });
      // Change Message Group Subscribe
      const { currentGroup } = await this.getGlobalState();
      await libs.mqttClient.unsubscribe(currentGroup);
      await libs.mqttClient.subscribe(changeGroup);
      // Update Current Chat Group
      await this.setGlobalState({
        isPending: false,
        currentGroup: changeGroup,
      });
      // Exit Chat Group Page
      await this.handleCloseChatGroupPage();
    } catch (e) {
      // console.log(e);
      global.window.alert(e.message || e);
    }
  }

  render() {
    const { chatGroups } = this.state;
    return (
      <ChatGroupWrapper>
        <ChatGroupHeader
          handleClickCloseChatGroupButton={this.handleCloseChatGroupPage}
        />
        <ChatGroupBody
          chatGroups={chatGroups}
          handleClickChatGroup={this.handleChangeCurrentChatGroup}
        />
      </ChatGroupWrapper>
    );
  }
}

ChatGroup.propTypes = {
  getGlobalState: PropTypes.func.isRequired,
  setGlobalState: PropTypes.func.isRequired,
};

export default ChatGroup;
