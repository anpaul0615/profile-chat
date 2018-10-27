import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ChatGroupListItem from './GroupListItem';

/* Style-Wrapper */
const ChatGroupListWrapper = styled.div`
  width: 100%;
  height: calc(100% - 60px);
  overflow: hidden;
  background-color: #FFFFFF;
`;
/* Component */
const ChatGroupList = (props) => {
  const { chatGroups, handleClickChatGroup } = props;
  return (
    <ChatGroupListWrapper>
      {
        chatGroups.map(group => (
          <ChatGroupListItem
            key={group.groupName}
            groupName={group.groupName}
            groupNickName={group.groupnickname}
            lastMessage={group.lastMessage}
            handleClickChatGroup={handleClickChatGroup}
          />))
      }
    </ChatGroupListWrapper>
  );
};

ChatGroupList.propTypes = {
  chatGroups: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleClickChatGroup: PropTypes.func.isRequired,
};

export default ChatGroupList;
