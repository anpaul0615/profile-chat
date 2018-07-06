import React from 'react';
import ConfigInputBox from './ConfigInputBox';
import AccessCodeRequestButton from './AccessCodeRequestButton';
import styled from "styled-components";


/* Style-Wrapper */
const ChatConfigBodyWrapper = styled.form`
    width: 100%;
    height: calc(100% - 60px);
    overflow: hidden;
    background-color: #FFFFFF;
`;
/* Component */
const ChatConfigBody = (props)=>{
    const {
        userName, userContact,
        handleChangeUserAccessCode,
        handleClickRequestButton
     } = props;
    return (
        <ChatConfigBodyWrapper>
            <ConfigInputBox
                labelText={'Access Code'}
                handleOnChange={handleChangeUserAccessCode}
                placeholder='(type-your-access-code)' />
            <ConfigInputBox
                labelText={'Name'}
                value={userName}
                isReadOnly />
            <ConfigInputBox
                labelText={'Contact'}
                value={userContact}
                isReadOnly />
            <AccessCodeRequestButton
                handleOnClick={handleClickRequestButton} />
        </ChatConfigBodyWrapper>
    );
};
export default ChatConfigBody;