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
    const { messages }= props;
    return (
        <div style={styles.root}>
            <h3>"ChatBody"</h3>
            <MessageHistory messages={messages}/>
            <MessageInputBox/>
        </div>
    );
};
export default ChatBody;