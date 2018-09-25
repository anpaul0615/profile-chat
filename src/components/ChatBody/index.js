import React from 'react';
import MessageHistory from "./MessageHistory";
import MessageInputBox from "./MessageInputBox";
import styled from "styled-components";


/* Style-Wrapper */
const ChatBodyWrapper = styled.div`
    width: 100%;
    height: calc(100% - 60px);
    overflow: hidden;
`;
/* Component */
const ChatBody = (props)=>{
    const {
        messages,
        messageBuffer,
        handleChangeInputText,
        handleClickMessageSendButton
    }= props;
    return (
        <ChatBodyWrapper>
            <MessageHistory messages={messages}/>
            <MessageInputBox
                messageBuffer={messageBuffer}
                handleChangeInputText={handleChangeInputText}
                handleClickMessageSendButton={handleClickMessageSendButton}/>
        </ChatBodyWrapper>
    );
};
export default ChatBody;