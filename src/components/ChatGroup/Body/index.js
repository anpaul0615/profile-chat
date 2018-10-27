import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ChatGroupList from './GroupList';

/* Style-Wrapper */
const ChatGroupBodyWrapper = styled.div`
  width: 100%;
  height: calc(100% - 60px);
  overflow: hidden;
  background-color: #FFFFFF;
`;
/* Component */
const ChatGroupBody = (props) => {
  const { chatGroups, handleClickChatGroup } = props;
  return (
    <ChatGroupBodyWrapper>
      <ChatGroupList
        chatGroups={chatGroups}
        handleClickChatGroup={handleClickChatGroup}
      />
    </ChatGroupBodyWrapper>
  );
};

ChatGroupBody.propTypes = {
  chatGroups: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleClickChatGroup: PropTypes.func.isRequired,
};

export default ChatGroupBody;
