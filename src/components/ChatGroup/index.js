import React from 'react';
import styled from "styled-components";
import ChatGroupHeader from "./Header";
import ChatGroupBody from "./Body";

import APIGatewayClient from '../../lib/apigateway-client';
import MQTTClient from '../../lib/mqtt-client';

/* Style-Wrapper */
const ChatGroupWrapper = styled.div`
    width: 100%;
    height: 100%;
    overflow: hidden;
`;
/* Component */
class ChatGroup extends React.Component {

    constructor() {
        super();
        this.apigwClient = new APIGatewayClient();
        this.mqttClient = new MQTTClient();
        this.state = {
            chatGroups: []
        }
    }

    handleCloseChatGroupPage = async ()=>{
        await this.props.setGlobalState({
            currentPage: '/'
        });
    }
    handleChangeCurrentChatGroup = async (changeGroup)=>{
        try {
            // Set Pending State To Start
            await this.props.setGlobalState({
                isPending: true
            });
            // Get All Message History
            const { data:messageHistory } = await this.apigwClient.invokeAPIGateway({
                path: '/messages',
                method: 'GET',
                queryParams: { groupId: changeGroup, startDate: '1000-01-01T00:00:00.000Z' }
            });
            // Parse Message History
            const { currentUser } = await this.props.getGlobalState();
            const messages = (messageHistory || []).map(e=>({
                isMine: e.userName === currentUser,
                userName: e.userName,
                content: e.content,
                regDate: e.regDate,
            }));
            // Change Message Group Subscribe
            const { currentGroup } = await this.props.getGlobalState();
            await this.mqttClient.unsubscribe(currentGroup);
            await this.mqttClient.subscribe(changeGroup);
            // Update Message History & Current Chat Group
            await this.props.setGlobalState({
                isPending: false,
                messages,
                currentGroup: changeGroup
            });
            // Exit Chat Group Page
            await this.handleCloseChatGroupPage();

        } catch (e) {
            console.log(e);
            alert(e.message || e);
        }
    }
    initChatGroups = async ()=>{
        try {
            const { currentUser } = await this.props.getGlobalState();
            const { data:chatGroups } = await this.apigwClient.invokeAPIGateway({
                path: '/messages/group/search',
                method: 'GET',
                queryParams: { userName: currentUser }
            });
            this.setState((prevState,props)=>({
                chatGroups
            }));

        } catch (e) {
            console.log(e);
        }
    }


    componentDidMount() {
        this.initChatGroups();
    }
    render() {
        return (
            <ChatGroupWrapper>
                <ChatGroupHeader
                    handleClickCloseChatGroupButton={this.handleCloseChatGroupPage} />
                <ChatGroupBody
                    chatGroups={this.state.chatGroups}
                    handleClickChatGroup={this.handleChangeCurrentChatGroup} />
            </ChatGroupWrapper>
        );
    }
}
export default ChatGroup;