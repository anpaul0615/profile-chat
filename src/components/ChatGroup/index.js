import React from 'react';
import ChatGroupHeader from "./Header";
import ChatGroupBody from "./Body";
import styled from "styled-components";


/* Style-Wrapper */
const ChatGroupWrapper = styled.div`
    width: 100%;
    height: 100%;
    overflow: hidden;
`;
/* Component */
const ChatGroup = (props)=>{
    const {
        checkAuthentication,
        handleClickCloseChatGroupButton
    }= props;
    return checkAuthentication()
    ?   <ChatGroupWrapper>
            <ChatGroupHeader handleClickCloseChatGroupButton={handleClickCloseChatGroupButton} />
            <ChatGroupBody />
        </ChatGroupWrapper>
    :   <p>Unauthenticated..!</p>;
};
export default ChatGroup;