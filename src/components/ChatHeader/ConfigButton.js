import React from 'react';
import styled from "styled-components";


/* Style-Wrapper */
const ConfigButtonWrapper = styled.div`
    position: absolute;
    top: 0;
    left: 0;
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
        background-image: url(/img/config-button.png);
        background-size: cover;
        opacity: 0.6;
    }
`;
/* Component */
const ConfigButton = (props)=>{
    const { handleClickOpenConfigButton } = props;
    return <ConfigButtonWrapper onClick={()=>handleClickOpenConfigButton()} />;
};
export default ConfigButton;