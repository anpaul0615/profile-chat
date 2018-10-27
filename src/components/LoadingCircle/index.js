import React from 'react'
import styled from "styled-components";
import { Loader } from 'semantic-ui-react'


/* Style-Wrapper */
const LoadingCircleWrapper = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0px;
    left: 0px;
    background: rgba(0,0,0,0.6);
    z-index: 255;
`;
/* Component */
const LoadingCircle = ()=>{
    return (
        <LoadingCircleWrapper>
            <Loader active />
        </LoadingCircleWrapper>
    );
};
export default LoadingCircle;