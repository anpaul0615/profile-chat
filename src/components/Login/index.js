import React from 'react'
import styled from "styled-components";
import LoginBackgroundLayer from "./LoginBackgroundLayer";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";


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
        hasNoAccount,
        handleInputLoginEmail, handleInputLoginPassword,
        handleClickLoginButton, handleClickGoToSignupButton,
        handleInputSignupEmail, handleInputSignupPassword, handleInputSignupPasswordAgain,
        handleClickSignupButton, handleClickGoToLoginButton
    } = props;
    return (
        <LoginWrapper>
            <LoginBackgroundLayer />
            {
                hasNoAccount
                ? <SignupForm
                    key={'Signup'}
                    handleInputSignupEmail={handleInputSignupEmail}
                    handleInputSignupPassword={handleInputSignupPassword}
                    handleInputSignupPasswordAgain={handleInputSignupPasswordAgain}
                    handleClickSignupButton={handleClickSignupButton}
                    handleClickGoToLoginButton={handleClickGoToLoginButton}  />
                : <LoginForm
                    key={'Login'}
                    handleInputLoginEmail={handleInputLoginEmail}
                    handleInputLoginPassword={handleInputLoginPassword}
                    handleClickLoginButton={handleClickLoginButton}
                    handleClickGoToSignupButton={handleClickGoToSignupButton} />
            }
        </LoginWrapper>
    );
};
export default Login;