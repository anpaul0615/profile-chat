import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import SignupForm from './SignupForm';
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
  constructor(props) {
    super(props);
    const { getGlobalState, setGlobalState } = props;
    this.getGlobalState = getGlobalState;
    this.setGlobalState = setGlobalState;
  }

  attachIotPolicy = identityId => libs.poilcyManager.attachUserIdentityToPolicy('iot-chat-policy', identityId);

  checkMessageGroup = groupId => libs.apigwClient.invokeAPIGateway({
    path: '/messages/group',
    method: 'GET',
    queryParams: { groupId },
  }).then(() => true).catch(() => false);

  createMessageGroup = (groupId, userName) => libs.apigwClient.invokeAPIGateway({
    path: '/messages/group',
    method: 'POST',
    body: {
      groupId,
      groupName: userName,
      groupUsers: [userName, 'anpaul0615'],
    },
  });

  handleSignup = async () => {
    try {
      const { email, password, passwordConfirm } = this.state;
      if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)) {
        global.window.alert('Email Format is Invalid..!');
      } else if (password !== passwordConfirm) {
        global.window.alert('Password Confirm is not matched..!');
      } else {
        // Get Cognito Credentials
        await libs.cognitoClient.registerNewAccount(email, password);
        // Notify Success to User
        global.window.alert('Confirmation code was sent to your email!!');
        // Go To Signin Page
        await this.setGlobalState({
          currentPage: '/signin',
        });
      }
    } catch (e) {
      // console.log(e);
      global.window.alert(e.message || e);
    }
  }

  handleInputEmail = (event) => {
    const email = event.target.value;
    this.setState(() => ({
      email,
    }));
  }

  handleInputPassword = (event) => {
    const password = event.target.value;
    this.setState(() => ({
      password,
    }));
  }

  handleInputPasswordConfirm = (event) => {
    const passwordConfirm = event.target.value;
    this.setState(() => ({
      passwordConfirm,
    }));
  }

  handleMoveSigninPage = async () => {
    await this.setGlobalState({
      currentPage: '/signin',
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
          handleMoveSigninPage={this.handleMoveSigninPage}
        />
      </ChatSignupWrapper>
    );
  }
}

ChatSignup.propTypes = {
  getGlobalState: PropTypes.func.isRequired,
  setGlobalState: PropTypes.func.isRequired,
};

export default ChatSignup;
