import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import MessageHistory from './MessageHistory';
import MessageInputBox from './MessageInputBox';

/* Style-Wrapper */
const ChatBodyWrapper = styled.div`
  width: 100%;
  height: calc(100% - 60px);
  overflow: hidden;
`;
/* Component */
const ChatBody = (props) => {
  const {
    messages, messageBuffer,
    handleInputMessage, handleSendMessage, handleGetOlderMessages, initMessageHistoryScoll,
  } = props;
  return (
    <ChatBodyWrapper>
      <MessageHistory
        messages={messages}
        initMessageHistoryScoll={initMessageHistoryScoll}
        handleGetOlderMessages={handleGetOlderMessages}
      />
      <MessageInputBox
        messageBuffer={messageBuffer}
        handleChangeInputText={handleInputMessage}
        handleClickMessageSendButton={handleSendMessage}
      />
    </ChatBodyWrapper>
  );
};

ChatBody.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.object).isRequired,
  messageBuffer: PropTypes.string.isRequired,
  handleInputMessage: PropTypes.func.isRequired,
  handleSendMessage: PropTypes.func.isRequired,
  initMessageHistoryScoll: PropTypes.func.isRequired,
  handleGetOlderMessages: PropTypes.func.isRequired,
};

export default ChatBody;
