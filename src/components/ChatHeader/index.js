import React from 'react';


/* Style */
const styles = {
    root: {
        border: 'solid 2px gray'
    }
};
/* Component */
const ChatHeader = (props)=>{
    const { handleEnterConfigClick } = props;
    return (
        <div style={styles.root}>
            <h3>"ChatHeader"</h3>
            <button onClick={()=>handleEnterConfigClick()}>
                EnterConfig
            </button>
            <button>
                CloseChatting
            </button>
        </div>
    );
};
export default ChatHeader;