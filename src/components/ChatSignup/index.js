import React from 'react'
import styled from "styled-components";
import SignupForm from "./SignupForm";


/* Style-Wrapper */
const ChatSignupWrapper = styled.div`
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.6);
`;
/* Component */
class ChatSignup extends React.Component {

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
    handleInputPasswordConfirm = (event)=>{
        const passwordConfirm = event.target.value;
        this.setState((prevState,props)=>({
            passwordConfirm
        }));
    }
    handleSignup = ()=>{
        const { email, password, passwordConfirm } = this.state;
        if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)) {
            return alert('Email Format is Invalid..!');
        }
        if (password !== passwordConfirm) {
            return alert('Password Confirm is not matched..!');
        }
        this.props.signup(email, password);
    }
    handleMoveSigninPage = ()=>{
        this.props.changeCurrentPage('/signin');
    }

    render() {
        return (
            <ChatSignupWrapper>
                <SignupForm
                    handleInputEmail={this.handleInputEmail}
                    handleInputPassword={this.handleInputPassword}
                    handleInputPasswordConfirm={this.handleInputPasswordConfirm}
                    handleSignup={this.handleSignup}
                    handleMoveSigninPage={this.handleMoveSigninPage} />
            </ChatSignupWrapper>
        );
    }
}
export default ChatSignup;