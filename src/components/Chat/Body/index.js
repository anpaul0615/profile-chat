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
        handleInputMessage,
        handleSendMessage,
        initMessageHistoryScoll
    }= props;
    return (
        <ChatBodyWrapper>
            <MessageHistory
                messages={messages}
                initMessageHistoryScoll={initMessageHistoryScoll} />
            <MessageInputBox
                messageBuffer={messageBuffer}
                handleChangeInputText={handleInputMessage}
                handleClickMessageSendButton={handleSendMessage}/>
        </ChatBodyWrapper>
    );
};
export default ChatBody;