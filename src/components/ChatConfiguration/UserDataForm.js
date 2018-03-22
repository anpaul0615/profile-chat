import React from 'react';

/* Style */
const styles = {
    root: {
        border: 'dotted 1px gray'
    }
};
/* Component */
const UserDataForm = (props)=>{
    return (
        <div style={styles.root}>
            <p>"UserDataForm"</p>
            <ul>
                <li>access-code : <input />
                </li>
                <li>your-name : <input />
                </li>
                <li>your-contact : <input />
                </li>
            </ul>
        </div>
    );
};
export default UserDataForm;