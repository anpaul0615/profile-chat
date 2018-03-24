import React from 'react';
import InputBox from './InputBox';
import SendButton from './SendButton';
import styled from "styled-components";


/* Style-Wrapper */
const MessageInputBoxWrapper = styled.div`
    width: 100%;
    height: 56px;
    position: relative;
    display: flex;
    align-items: center;
    border-top: 1px solid rgba(81,99,120,0.2);
`;
/* Component */
const MessageInputBox = (props)=>{
    const { 
        handleChangeInputText,
        handleClickMessageSendButton
    } = props;
    return (
        <MessageInputBoxWrapper>
            <InputBox handleChangeInputText={handleChangeInputText} />
            <SendButton handleClickMessageSendButton={handleClickMessageSendButton} />
        </MessageInputBoxWrapper>
    );
};
export default MessageInputBox;