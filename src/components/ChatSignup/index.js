import React from 'react'
import styled from "styled-components";
import SignupForm from "./SignupForm";

import * as libs from '../../lib';

/* Style-Wrapper */
const ChatSignupWrapper = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(0,0,0,0.6);
`;
/* Component */
class ChatSignup extends React.Component {

    attachIotPolicy = (identityId)=>{
        return libs.poilcyManager.attachUserIdentityToPolicy('iot-chat-policy', identityId);
    }
    checkMessageGroup = (groupId)=>{
        return libs.apigwClient.invokeAPIGateway({
                path: '/messages/group',
                method: 'GET',
                queryParams: { groupId }
            })
            .then(()=>true)
            .catch(()=>false);
    }
    createMessageGroup = (groupId,userName)=>{
        return libs.apigwClient.invokeAPIGateway({
                path: '/messages/group',
                method: 'POST',
                body: {
                    groupId,
                    groupName: userName,
                    groupUsers: [ userName, 'anpaul0615' ]
                }
            });
    }


    handleSignup = async (email, password)=>{
        try {
            // Get Cognito Credentials
            await libs.cognitoClient.registerNewAccount(email,password);
            // Notify Success to User
            alert('Confirmation code was sent to your email!!');
            // Go To Signin Page
            await this.props.setGlobalState({
                currentPage: '/signin'
            });

        } catch (e) {
            console.log(e);
            alert(e.message || e);
        }
    }
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
    handleMoveSigninPage = async ()=>{
        await this.props.setGlobalState({
            currentPage: '/signin'
        });
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