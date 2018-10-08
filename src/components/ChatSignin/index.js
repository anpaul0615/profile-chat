import React from 'react'
import styled from "styled-components";
import SigninForm from "./SigninForm";


/* Style-Wrapper */
const ChatSigninWrapper = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(0,0,0,0.6);
`;
/* Component */
class ChatSignin extends React.Component {

    handleInputEmail = (event)=>{
        const email = event.target.value;
        this.setState((prevState,props)=>({
            email
        }));
    }
    handleInputPassword = (event)=>{
        const password = event.target.value;
        this.setState((prevState,props)=>({
            password
        }));
    }
    handleSignin = ()=>{
        const { email, password } = this.state;
        this.props.signin(email, password);
    }
    handleMoveSignupPage = ()=>{
        this.props.changeCurrentPage('/signup');
    }

    render() {
        return (
            <ChatSigninWrapper>
                <SigninForm
                    handleInputEmail={this.handleInputEmail}
                    handleInputPassword={this.handleInputPassword}
                    handleSignin={this.handleSignin}
                    handleMoveSignupPage={this.handleMoveSignupPage} />
            </ChatSigninWrapper>
        );
    };
}
export default ChatSignin;