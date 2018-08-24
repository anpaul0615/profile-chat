import React from 'react'
import styled from "styled-components";
import BackgroundLayer from "./BackgroundLayer";
import SigninForm from "./SigninForm";
import SignupForm from "./SignupForm";


/* Style-Wrapper */
const ChatSignatureWrapper = styled.div`
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 1000000001;
`;
/* Component */
const ChatSignature = (props)=>{
    const {
        hasNoAccount,
        handleInputSigninEmail, handleInputSigninPassword,
        handleClickSigninButton, handleClickGoToSignupButton,
        handleInputSignupEmail, handleInputSignupPassword, handleInputSignupPasswordAgain,
        handleClickSignupButton, handleClickGoToSigninButton
    } = props;
    return (
        <ChatSignatureWrapper>
            <BackgroundLayer />
            {
                hasNoAccount
                ? <SignupForm
                    key={'Signup'}
                    handleInputSignupEmail={handleInputSignupEmail}
                    handleInputSignupPassword={handleInputSignupPassword}
                    handleInputSignupPasswordAgain={handleInputSignupPasswordAgain}
                    handleClickSignupButton={handleClickSignupButton}
                    handleClickGoToSigninButton={handleClickGoToSigninButton}  />
                : <SigninForm
                    key={'Signin'}
                    handleInputSigninEmail={handleInputSigninEmail}
                    handleInputSigninPassword={handleInputSigninPassword}
                    handleClickSigninButton={handleClickSigninButton}
                    handleClickGoToSignupButton={handleClickGoToSignupButton} />
            }
        </ChatSignatureWrapper>
    );
};
export default ChatSignature;