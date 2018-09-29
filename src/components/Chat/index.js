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
const Chat = (props)=>{
    const {
        messages, messageBuffer,
        handleClickAppExitButton,
        handleClickOpenChatGroupButton,
        handleChangeInputText,
        handleClickMessageSendButton,
        setScollDiv
    }= props;
    return (
        <ChatWrapper>
            <ChatHeader
                handleClickAppExitButton={handleClickAppExitButton}
                handleClickOpenChatGroupButton={handleClickOpenChatGroupButton} />
            <ChatBody
                messages={messages}
                messageBuffer={messageBuffer}
                handleChangeInputText={handleChangeInputText}
                handleClickMessageSendButton={handleClickMessageSendButton}
                setScollDiv={setScollDiv} />
        </ChatWrapper>
    );
};
export default Chat;