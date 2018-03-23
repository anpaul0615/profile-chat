import React from 'react';
import styled from "styled-components";


/* Style */
const styles = {
    inputBox: {
        width: 'calc(100% - 80px)',
        height: '40px'
    },
    sendButton: {
        width: '60px',
        height: '40px'
    }
};
/* Style-Wrapper */
const MessageInputBoxWrapper = styled.div`
    width: 100%;
    min-height: 54px;
`;
/* Component */
const MessageInputBox = (props)=>{
    return (
        <MessageInputBoxWrapper>
            <input style={styles.inputBox}
                   placeholder={"메시지를 입력해주세요"} />
            <button style={styles.sendButton}>
                전송
            </button>
        </MessageInputBoxWrapper>
    );
};
export default MessageInputBox;