import React from 'react';
import styled from "styled-components";


/* Style-Wrapper */
const AppExitButtonWrapper = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    width: 56px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    
    &:before {
        content: '';
        display: block;
        width: 24px;
        height: 24px;
        background-image: url(./img/close-button.png);
        background-size: cover;
        opacity: 0.6;
    }
`;
/* Component */
const AppExitButton = (props)=>{
    const { handleClickAppExitButton } = props;
    return <AppExitButtonWrapper onClick={()=>handleClickAppExitButton()} />;
};
export default AppExitButton;