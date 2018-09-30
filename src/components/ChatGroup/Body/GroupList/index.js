import React from 'react';
import ChatGroupListItem from './GroupListItem';
import styled from "styled-components";


/* Style-Wrapper */
const ChatGroupListWrapper = styled.div`
    width: 100%;
    height: calc(100% - 60px);
    overflow: hidden;
    background-color: #FFFFFF;
`;
/* Component */
const ChatGroupList = (props)=>{
    const { chatGroups, handleClickChatGroup } = props;
    return (
        <ChatGroupListWrapper>
            {chatGroups.map(group=> 
                <ChatGroupListItem
                    key={group.groupname}
                    groupName={group.groupname}
                    groupNickName={group.groupnickname}
                    lastMessage={group.lastMessage}
                    handleClickChatGroup={handleClickChatGroup} />
            )}
        </ChatGroupListWrapper>
    );
};
export default ChatGroupList;