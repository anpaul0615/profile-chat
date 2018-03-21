import React from 'react';


/* Style */
const styles = {
    root: {
        width: '100%',
        border: 'dotted 1px gray',
        minHeight: '54px'
    },
    inputBox: {
        width: 'calc(100% - 80px)',
        height: '40px'
    },
    sendButton: {
        width: '60px',
        height: '40px'
    }
};
/* Component */
const MessageInputBox = (props)=>{
    return (
        <div style={styles.root}>
            <input style={styles.inputBox}
                   placeholder={"메시지를 입력해주세요"} />
            <button style={styles.sendButton}>
                전송
            </button>
        </div>
    );
};
export default MessageInputBox;