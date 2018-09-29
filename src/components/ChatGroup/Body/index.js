import React from 'react';
import styled from "styled-components";


/* Style-Wrapper */
const ChatGroupBodyWrapper = styled.form`
    width: 100%;
    height: calc(100% - 60px);
    overflow: hidden;
    background-color: #FFFFFF;
`;
/* Component */
const ChatGroupBody = (props)=>{
    return (
        <ChatGroupBodyWrapper>
            "ChatGroupBody"
        </ChatGroupBodyWrapper>
    );
};
export default ChatGroupBody;