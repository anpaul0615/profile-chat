import React from 'react';
import UserDataForm from './UserDataForm';


/* Style */
const styles = {
    root: {
        border: 'solid 1px gray',
        witdh: '100%',
        height: 'calc(100vh - 2px)'
    }
};
/* Component */
const ChatConfiguration = (props)=>{
    const { handleClickCloseConfigButton } = props;
    return (
        <div style={styles.root}>
            <h3>"ChatConfiguration"</h3>
            <button onClick={()=>handleClickCloseConfigButton()}>
                CloseConfig
            </button>
            <UserDataForm/>
        </div>
    );
};
export default ChatConfiguration;