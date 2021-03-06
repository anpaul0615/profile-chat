import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Message from './Message';
import MoreButton from './MoreButton';

/* Style-Wrapper */
const MessageHistoryWrapper = styled.div`
  width: 100%;
  height: calc(100% - 80px);
  padding: 12px 0px;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  background-color: #FFFFFF;
  box-sizing: content-box;
  -webkit-box-sizing: content-box;
`;
const ScrollWrapper = styled.div`
  height: auto;
`;
/* Component */
const MessageHistory = (props) => {
  const { messages, handleGetOlderMessages, initMessageHistoryScoll } = props;
  return (
    <MessageHistoryWrapper>
      <ScrollWrapper innerRef={el => initMessageHistoryScoll(el)}>
        <MoreButton handleGetOlderMessages={handleGetOlderMessages} />
        {
          messages
            ? messages.map((e, idx) => (
              <Message
                key={(i => `msg-${i}`)(idx)}
                isMine={e.isMine}
                userName={e.userName}
                content={e.content}
                regDate={e.regDate}
              />))
            : 'no-data'
        }
      </ScrollWrapper>
    </MessageHistoryWrapper>
  );
};

MessageHistory.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.object).isRequired,
  initMessageHistoryScoll: PropTypes.func.isRequired,
  handleGetOlderMessages: PropTypes.func.isRequired,
};

export default MessageHistory;
