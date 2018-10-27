import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

/* Style-Wrapper */
const InputBoxWrapper = styled.textarea`
  height: 19px;
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 0;
  font-size: 14px;
  border: none;
  resize: none;
  margin: auto;
  padding: 18px 10px 18px;
  white-space: pre-wrap;
  overflow-x: hidden;
  overflow-y: auto;
`;
/* Component */
const InputBox = (props) => {
  const { messageBuffer, handleChangeInputText } = props;
  return (
    <InputBoxWrapper
      value={messageBuffer}
      onChange={handleChangeInputText}
      placeholder="Please Input Here."
    />
  );
};

InputBox.propTypes = {
  messageBuffer: PropTypes.string.isRequired,
  handleChangeInputText: PropTypes.func.isRequired,
};

export default InputBox;
