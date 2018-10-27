import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import InputBox from './InputBox';
import SendButton from './SendButton';

/* Style-Wrapper */
const MessageInputBoxWrapper = styled.div`
  width: 100%;
  height: 56px;
  position: relative;
  display: flex;
  align-items: center;
  border-top: 1px solid rgba(81,99,120,0.2);
  box-sizing: content-box;
  -webkit-box-sizing: content-box;
`;
/* Component */
const MessageInputBox = (props) => {
  const {
    messageBuffer,
    handleChangeInputText, handleClickMessageSendButton,
  } = props;
  return (
    <MessageInputBoxWrapper>
      <InputBox messageBuffer={messageBuffer} handleChangeInputText={handleChangeInputText} />
      <SendButton handleClickMessageSendButton={handleClickMessageSendButton} />
    </MessageInputBoxWrapper>
  );
};

MessageInputBox.propTypes = {
  messageBuffer: PropTypes.string.isRequired,
  handleChangeInputText: PropTypes.func.isRequired,
  handleClickMessageSendButton: PropTypes.func.isRequired,
};

export default MessageInputBox;
