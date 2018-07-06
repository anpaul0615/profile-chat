import React from 'react';
import styled from "styled-components";


/* Style-Wrapper */
const RequestButtonWrapper = styled.a`
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
`;
const RequestButton = styled.div`
    width: 200px;
    height: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 14px;
    color: #98A7B3;
`;
/* Component */
const AccessCodeRequestButton = (props)=>{
    const { handleOnClick } = props;
    return (
        <RequestButtonWrapper onClick={()=>handleOnClick()}>
            <RequestButton>Request Access Code</RequestButton>
        </RequestButtonWrapper>
    );
};
export default AccessCodeRequestButton;