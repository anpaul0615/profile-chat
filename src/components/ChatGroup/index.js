import React from 'react';
import styled from "styled-components";
import ChatGroupHeader from "./Header";
import ChatGroupBody from "./Body";

import * as libs from '../../lib';

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
            const { data:messageHistory } = await libs.apigwClient.invokeAPIGateway({
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
            await libs.mqttClient.unsubscribe(currentGroup);
            await libs.mqttClient.subscribe(changeGroup);
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
            const { data:chatGroups } = await libs.apigwClient.invokeAPIGateway({
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