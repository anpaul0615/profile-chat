import React from 'react';

/* Style */
const styles = {
    root: {
        border: 'dotted 1px gray'
    }
};
/* Component */
const Message = (props)=>{
    return (
        <div style={styles.root}>
            <p>{props.content}</p>
        </div>
    );
};
export default Message;