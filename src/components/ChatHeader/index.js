import React from 'react';


/* Style */
const styles = {
    root: {
        border: 'solid 2px gray'
    }
};
/* Component */
const ChatHeader = (props)=>{
    return (
        <div style={styles.root}>
            <h3>"ChatHeader"</h3>
            <button>ConfigButton</button>
            <button>CloseButton</button>
        </div>
    );
};
export default ChatHeader;