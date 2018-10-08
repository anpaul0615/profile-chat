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
        handleClickCloseChatGroupButton,
        chatGroups, handleClickChatGroup
    } = props;
    return (
        <ChatGroupWrapper>
            <ChatGroupHeader handleClickCloseChatGroupButton={handleClickCloseChatGroupButton} />
            <ChatGroupBody chatGroups={chatGroups} handleClickChatGroup={handleClickChatGroup} />
        </ChatGroupWrapper>
        );
};
export default ChatGroup;