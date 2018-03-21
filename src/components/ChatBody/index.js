import React from 'react';
import MessageHistory from "./MessageHistory";
import MessageInputBox from "./MessageInputBox";


/* Style */
const styles = {
    root: {
        border: 'solid 2px gray',
        height: 'auto'
    }
};
/* Component */
const ChatBody = (props)=>{
    const messages = [
        {
            content: 'aaa',
            timestamp: 'yyyy-mm-dd hh:mm:ss'
        },
        {
            content: 'bbb',
            timestamp: 'yyyy-mm-dd hh:mm:ss'
        },
        {
            content: 'ccc',
            timestamp: 'yyyy-mm-dd hh:mm:ss'
        }
    ];
    return (
        <div style={styles.root}>
            <h3>"ChatBody"</h3>
            <MessageHistory messages={messages}/>
            <MessageInputBox/>
        </div>
    );
};
export default ChatBody;