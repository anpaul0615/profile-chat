import React from 'react';
import styled from "styled-components";


/* Style-Wrapper */
const SendButtonWrapper = styled.div`
    width: 46px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    &:before {
        content: '';
        display: block;
        width: 24px;
        height: 24px;
        background-image: url(/img/send-button.png);
        background-size: cover;
        opacity: 0.6;
    }
`;
/* Component */
const SendButton = (props)=>{
    const { handleClickMessageSendButton } = props;
    return <SendButtonWrapper onClick={()=>handleClickMessageSendButton()} />;
};
export default SendButton;