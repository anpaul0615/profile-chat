import React from 'react';
import styled from 'styled-components';


/* Style-Wrapper */
const MessageRawWrapper = styled.div`
    padding-left: ${ props=>props.user==='paul'? '10px':null };
    padding-right: ${ props=>props.user==='paul'? null:'10px' };
    text-align: ${ props=>props.user==='paul'? 'left':'right' };
`;
const MessageBalloonWrapper = styled.div`
    display: inline-block;
    padding: 10px 12px;
    margin-bottom: 3px;
    max-width: 230px;
    border-radius: 15px;
    border-top-left-radius: ${ props=>props.user==='paul'? '3px':null };
    border-top-right-radius: ${ props=>props.user==='paul'? null:'3px' };
    text-align: ${ props=>props.user==='paul'? 'left':'right' };
    font-size: 14px;
    white-space: pre-line;
    word-break: break-word;
    word-wrap: break-word;
    background-color: #EEF1F4;
    color: #516378;
`;
/* Component */
const Message = (props)=>{
    const { user, content } = props;
    return (
        <MessageRawWrapper user={user}>
            <MessageBalloonWrapper user={user}>
                <span>{content}</span>
            </MessageBalloonWrapper>
        </MessageRawWrapper>
    );
};
export default Message;