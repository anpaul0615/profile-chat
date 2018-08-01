import React from 'react'
import styled from "styled-components";
import LoginBackgroundLayer from "./LoginBackgroundLayer";
import LoginForm from "./LoginForm";


/* Style-Wrapper */
const LoginWrapper = styled.div`
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 1000000001;
`;
/* Component */
const Login = (props)=>{
    const {
        handleInputEmail,
        handleInputPassword,
        handleClickLoginButton
    } = props;
    return (
        <LoginWrapper>
            <LoginBackgroundLayer />
            <LoginForm
                handleInputEmail={handleInputEmail}
                handleInputPassword={handleInputPassword}
                handleClickLoginButton={handleClickLoginButton} />
        </LoginWrapper>
    );
};
export default Login;