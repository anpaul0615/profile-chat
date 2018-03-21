import React from 'react';
import Message from "./Message";


/* Style */
const styles = {
    root: {
        border: 'dotted 1px gray',
        height: 'auto'
    }
};
/* Component */
const MessageHistory = (props)=>{
    const { messages } = props;
    return(
        <div style={styles.root}>
            {
                messages
                ? messages.map((msg,idx)=>
                    <Message content={msg.content} key={`msg-${idx}`}/> )
                : 'no-data'
            }
        </div>
    );
};
export default MessageHistory;