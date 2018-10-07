import React from 'react';
import ChatGroupList from './GroupList';
import styled from "styled-components";


/* Style-Wrapper */
const ChatGroupBodyWrapper = styled.div`
    width: 100%;
    height: calc(100% - 60px);
    overflow: hidden;
    background-color: #FFFFFF;
`;
/* Component */
const ChatGroupBody = (props)=>{
    const { chatGroups, handleClickChatGroup } = props;
    return (
        <ChatGroupBodyWrapper>
            <ChatGroupList
                chatGroups={chatGroups}
                handleClickChatGroup={handleClickChatGroup} />
        </ChatGroupBodyWrapper>
    );
};
export default ChatGroupBody;