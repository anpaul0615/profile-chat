import React from 'react';
import styled from "styled-components";


/* Style-Wrapper */
const ChatGroupListItemWrapper = styled.div`
    width: 100%;
    height: 80px;
    padding: 5px;
    overflow: hidden;
    background-color: #FFFFFF;
    border-bottom: 1px solid #E8EBED;
`;
const GroupName = styled.div`
    width: 100%;
    height: 30px;
    padding: 4px 8px;
    font-size: 20px;
    font-weight: 600;
    text-align: left;
    border: none;
`;
const LastMessage = styled.div`
    width: 100%;
    height: calc(100% - 30px);
    padding: 0px 8px;
    font-size: 12px;
    text-align: left;
    border: none;
`;

/* Component */
const ChatGroupListItem = (props)=>{
    const {
        groupName, lastMessage,
        handleClickChatGroup
    } = props;
    return (
        <ChatGroupListItemWrapper onClick={()=>handleClickChatGroup(groupName)}>
            <GroupName>{groupName}</GroupName>
            <LastMessage>{lastMessage? lastMessage.content : '-'}</LastMessage>
        </ChatGroupListItemWrapper>
    );
};
export default ChatGroupListItem;