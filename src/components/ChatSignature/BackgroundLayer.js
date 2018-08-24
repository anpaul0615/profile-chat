import React from 'react'
import styled from "styled-components";


/* Style-Wrapper */
const BackgroundLayerWrapper = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0px;
    left: 0px;
    background: rgba(0,0,0,0.6);
    z-index: 1000000002;
`;
/* Component */
const BackgroundLayer = ()=>{
    return <BackgroundLayerWrapper />;
};
export default BackgroundLayer;