import React from 'react';
import ChatHeader from "./Header";
import ChatBody from "./Body";
import styled from "styled-components";


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
            messageBuffer: ''
        }
    }

    handleInputMessage = (event)=>{
        const messageBuffer = event.target.value;
        this.setState((prevState,props)=>({
            messageBuffer
        }));
    }
    handleSendMessage = ()=>{
        const { messageBuffer }= this.state;
        this.props.sendMessage(messageBuffer);
        this.props.moveMessageHistoryScollToBottom();
        this.setState((prevState,props)=>({
            messageBuffer: ''
        }));
    }
    handleSendMessageShortcut = (event)=>{
        if (event.keyCode===13 && event.ctrlKey) {
            this.handleSendMessage();
        }
    }
    handleMoveSignupPage = ()=>{
        this.props.changeCurrentPage('/group');
        this.props.initChatGroups();
    }


    componentDidMount() {
        document.addEventListener('keydown', this.handleSendMessageShortcut);
    }
    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleSendMessageShortcut);
    }
    render() {
        const { signout, initMessageHistoryScoll, messages } = this.props;
        const { messageBuffer } = this.state;
        return (
            <ChatWrapper>
                <ChatHeader
                    handleClickAppExitButton={signout}
                    handleClickOpenChatGroupButton={this.handleMoveSignupPage} />
                <ChatBody
                    messages={messages}
                    messageBuffer={messageBuffer}
                    initMessageHistoryScoll={initMessageHistoryScoll}
                    handleInputMessage={this.handleInputMessage}
                    handleSendMessage={this.handleSendMessage} />
            </ChatWrapper>
            );
    }
}
export default Chat;