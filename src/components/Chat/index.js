import React from 'react';
import ChatHeader from "./Header";
import ChatBody from "./Body";
import styled from "styled-components";

import * as libs from '../../lib';

/* Style-Wrapper */
const ChatWrapper = styled.div`
    width: 100%;
    height: 100%;
    overflow: hidden;
`;
/* Component */
class Chat extends React.Component {

    constructor() {
        super();
        this.state = {
            messageBuffer: '',
            messages: []
        }
    }

    initMessages = async ()=>{
        try {
            // Set Pending State To Start
            await this.props.setGlobalState({
                isPending: true
            });

            // Get All Message History
            const { currentGroup, currentUser } = await this.props.getGlobalState();
            const messageHistory = await libs.apigwClient.invokeAPIGateway({
                path: '/messages',
                method: 'GET',
                queryParams: { groupId: currentGroup, startDate: '1000-01-01T00:00:00.000Z' }
            })
            .then(result=>result.data)
            .catch(()=>[]);

            // Parse Message History
            const messages = (messageHistory || []).map(e=>({
                isMine: e.userName === currentUser,
                userName: e.userName,
                content: e.content,
                regDate: e.regDate,
            }));
            this.setState((prevState,props)=>({
                messages
            }));

            // Move Scroll To Bottom
            this.moveMessageHistoryScollToBottom();

            // Set Pending State To Finish
            await this.props.setGlobalState({
                isPending: false
            });

        } catch (e) {
            console.log(e);
        }
    }
    initMessageSubscribe = async ()=>{
        try {
            // Get Credentials From Previous Session Data
            const cognitoCredentials = await libs.cognitoClient.getCredentials();
            // Init MQTT Connection
            const { currentGroup, currentUser } = await this.props.getGlobalState();
            libs.mqttClient.init(cognitoCredentials, currentUser);
            // Subscribe Message Group
            await libs.mqttClient.subscribe(currentGroup);
            libs.mqttClient.registerMessageCallback(this.handleRecievedMessage);

        } catch(e) {
            console.log(e);
        }
    }
    initMessageHistoryScoll = (el)=>{
        this.messageHistoryScrollDiv = el;
    }
    moveMessageHistoryScollToBottom = ()=>{
        if (this.messageHistoryScrollDiv) {
            this.messageHistoryScrollDiv.scrollIntoView(false);
        }
    }


    handleSignout = async ()=>{
        if ( !window.confirm('Signout Now?') ) {
            return;
        }
        try {
            libs.cognitoClient.signout();
            libs.cognitoClient.clearStorage();
            libs.mqttClient.disconnect();
            await this.props.setGlobalState({
                currentPage: '/signin',
                currentUser: '',
                currentGroup: ''
            });
            // Close Iframe Window
            window.parent.postMessage('chat-off','*');

        } catch(e) {
            console.log(e);
        }
    }
    handleRecievedMessage = (messageChunk)=>{
        let newMessage = JSON.parse(messageChunk);
        newMessage.isMine = (newMessage.userName === this.state.currentUser);
        this.setState((prevState,props)=>({
            messages: [ ...prevState.messages, newMessage ]
        }));
        this.moveMessageHistoryScollToBottom();
    }

    handleInputMessage = (event)=>{
        const messageBuffer = event.target.value;
        this.setState((prevState,props)=>({
            messageBuffer
        }));
    }
    handleSendMessage = async ()=>{
        try {
            const { messageBuffer }= this.state;
            if (messageBuffer === '') return;

            // Set Pending State To Start
            this.props.setGlobalState({
                isPending: true
            });
            // Send Message to Database
            const { currentGroup, currentUser } = await this.props.getGlobalState();
            const messageBody = {
                groupId: currentGroup,
                regDate: new Date().toISOString(),
                content: messageBuffer,
                userName: currentUser
            };
            await libs.apigwClient.invokeAPIGateway({
                path: '/messages',
                method: 'POST',
                body: messageBody
            });
            // Send Message to MQTT
            await libs.mqttClient.publish(currentGroup, JSON.stringify(messageBody));
            // Clear MessageBuffer
            this.setState((prevState,props)=>({
                messageBuffer: ''
            }));
            // Set Pending State To Finish
            this.props.setGlobalState({
                isPending: false
            });
            // Move Scroll To Bottom
            this.moveMessageHistoryScollToBottom();

        } catch (e) {
            console.log(e);
        }



    }
    handleSendMessageShortcut = (event)=>{
        if (event.keyCode===13 && event.ctrlKey) {
            this.handleSendMessage();
        }
    }
    handleMoveSignupPage = async ()=>{
        await this.props.setGlobalState({
            currentPage: '/group'
        });
    }


    componentDidMount() {
        document.addEventListener('keydown', this.handleSendMessageShortcut);
        this.initMessages();
        this.initMessageSubscribe();
    }
    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleSendMessageShortcut);
    }
    render() {
        const { messageBuffer, messages } = this.state;
        return (
            <ChatWrapper>
                <ChatHeader
                    handleClickAppExitButton={this.handleSignout}
                    handleClickOpenChatGroupButton={this.handleMoveSignupPage} />
                <ChatBody
                    messages={messages}
                    messageBuffer={messageBuffer}
                    initMessageHistoryScoll={this.initMessageHistoryScoll}
                    handleInputMessage={this.handleInputMessage}
                    handleSendMessage={this.handleSendMessage} />
            </ChatWrapper>
            );
    }
}
export default Chat;