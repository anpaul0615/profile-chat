import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ChatGroupButton from './ChatGroupButton';
import AppExitButton from './AppExitButton';

/* Style-Wrapper */
const ChatHeaderWrapper = styled.div`
  position: relative;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: white;
  background-color: #4e66ff;
  box-shadow: 0 1px 2px 0 rgba(47,55,64,0.2);
  overflow: hidden;
  z-index: 2;
  align-items: center;
`;
/* Component */
const ChatHeader = (props) => {
  const {
    handleClickOpenChatGroupButton,
    handleClickAppExitButton,
  } = props;
  return (
    <ChatHeaderWrapper>
      <ChatGroupButton handleClickOpenChatGroupButton={handleClickOpenChatGroupButton} />
      ChatHeader
      <AppExitButton handleClickAppExitButton={handleClickAppExitButton} />
    </ChatHeaderWrapper>
  );
};

ChatHeader.propTypes = {
  handleClickOpenChatGroupButton: PropTypes.func.isRequired,
  handleClickAppExitButton: PropTypes.func.isRequired,
};

export default ChatHeader;
