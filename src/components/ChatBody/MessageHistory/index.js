import React from 'react';
import Message from "./Message";
import styled from "styled-components";


/* Style-Wrapper */
const MessageHistoryWrapper = styled.div`
    width: 100%;
    height: calc(100% - 80px);
    padding: 12px 0px;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
`;
const ScrollWrapper = styled.div`
    height: auto;
`;
/* Component */
const MessageHistory = (props)=>{
    const { messages } = props;
    return(
        <MessageHistoryWrapper>
            <ScrollWrapper>
            {
                messages
                    ?
                    messages.map((msg,idx)=>
                        <Message key={`msg-${idx}`}
                                 user={msg.user}
                                 content={msg.content} />
                    )
                    :
                    'no-data'
            }
            </ScrollWrapper>
        </MessageHistoryWrapper>
    );
};
export default MessageHistory;