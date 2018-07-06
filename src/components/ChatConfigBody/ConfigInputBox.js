import React from 'react';
import styled from "styled-components";


/* Style-Wrapper */
const InputBoxWrapper = styled.div`
    width: 100%;
    height: 52px;
    position: relative;
    display: flex;
    padding: 5px;
    border-bottom: 1px solid #E8EBED;
`;
const Label = styled.label`
    min-width: 120px;
    height: 100%;
    padding: 0 8px;
    font-size: 16px;
    font-weight: 600;
    text-align: right;
    line-height: 52px;
    border: none;
`;
const InputBox = styled.input`
    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: 0;
    min-width: 40%;
    height: 100%;
    padding: 0 10px;
    font-size: 16px;
    border: none;
`;
/* Component */
const ConfigInputBox = (props)=>{
    const { labelText, value, isReadOnly, placeholder, handleOnChange } = props;
    return (
        <InputBoxWrapper>
            <Label>{labelText + ' : '}</Label>
            <InputBox
                value={value}
                readOnly={ isReadOnly || false }
                placeholder={ placeholder || '' }
                onChange={(event)=>{
                    handleOnChange(event.target.value);
                }} />
        </InputBoxWrapper>
    );
};
export default ConfigInputBox;