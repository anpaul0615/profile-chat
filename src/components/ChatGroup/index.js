import React from 'react';
import ChatGroupHeader from "./Header";
import ChatGroupBody from "./Body";
import styled from "styled-components";


/* Style-Wrapper */
const ChatGroupWrapper = styled.div`
    width: 100%;
    height: 100%;
    overflow: hidden;
`;
/* Component */
const ChatGroup = (props)=>{
    const {
        handleClickCloseChatGroupButton
    }= props;
    return (
        <ChatGroupWrapper>
            <ChatGroupHeader handleClickCloseChatGroupButton={handleClickCloseChatGroupButton} />
            <ChatGroupBody />
        </ChatGroupWrapper>
    );
};
export default ChatGroup;