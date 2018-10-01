import React from 'react';
import styled from 'styled-components';


/* Style-Wrapper */
const MessageRawWrapper = styled.div`
    padding-left: ${ props=>props.isMine? null:'10px' };
    padding-right: ${ props=>props.isMine? '10px':null };
    text-align: ${ props=>props.isMine? 'right':'left' };
`;
const MessageBalloonWrapper = styled.div`
    display: inline-block;
    padding: 10px 12px;
    margin-bottom: 3px;
    max-width: 230px;
    border-radius: 15px;
    border-top-left-radius: ${ props=>props.isMine? null:'3px' };
    border-top-right-radius: ${ props=>props.isMine? '3px':null };
    text-align: ${ props=>props.isMine? 'right':'left' };
    font-size: 14px;
    white-space: pre-line;
    word-break: break-word;
    word-wrap: break-word;
    background-color: #EEF1F4;
    color: #516378;
`;
/* Component */
const Message = (props)=>{
    const { isMine, content } = props;
    return (
        <MessageRawWrapper isMine={isMine}>
            <MessageBalloonWrapper isMine={isMine}>
                <span>{content}</span>
            </MessageBalloonWrapper>
        </MessageRawWrapper>
    );
};
export default Message;