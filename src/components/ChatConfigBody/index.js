import React from 'react';
import InputBox from './InputBox';
import styled from "styled-components";


/* Style-Wrapper */
const ChatConfigBodyWrapper = styled.form`
    width: 100%;
    height: calc(100% - 60px);
    overflow: hidden;
`;
/* Component */
const ChatConfigBody = (props)=>{
    const {
        handleChangeUserAccessCode,
        handleChangeUserName,
        handleChangeUserContact
     } = props;
    return (
        <ChatConfigBodyWrapper>
            <InputBox 
                labelText={'Access Code'}
                onChange={handleChangeUserAccessCode} isRequired/>
            <InputBox
                labelText={'Name'}
                onChange={handleChangeUserName} />
            <InputBox 
                labelText={'Contact'}
                onChange={handleChangeUserContact} />
        </ChatConfigBodyWrapper>
    );
};
export default ChatConfigBody;