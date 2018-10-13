import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import SigninForm from './SigninForm';
import * as libs from '../../lib';

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
  constructor(props) {
    super(props);
    const { getGlobalState, setGlobalState } = props;
    this.getGlobalState = getGlobalState;
    this.setGlobalState = setGlobalState;
  }

  componentDidMount() {
    this.checkPreviousSessionData();
  }

  checkPreviousSessionData = async () => {
    try {
      // Get Credentials From Previous Session Data
      await libs.cognitoClient.setUserSessionFromStorage();
      await libs.cognitoClient.updateCredentials();
      const cognitoCredentials = await libs.cognitoClient.getCredentials();
      const userName = await libs.cognitoClient.getUserName();
      // Set Pending State To Start
      await this.setGlobalState({
        isPending: true,
      });
      // Attach IoT Principal Policy
      await this.attachIotPolicy(cognitoCredentials.identityId);
      // Check Message Group
      const currentUser = userName;
      const currentGroup = currentUser;
      if (!await this.checkMessageGroup(currentGroup)) {
        await this.createMessageGroup(currentGroup, currentUser);
      }
      // Update State
      await this.setGlobalState({
        isPending: false,
        currentPage: '/',
        currentUser,
        currentGroup,
      });
    } catch (e) {
      // console.log(e);
    }
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

  handleSignin = async () => {
    try {
      // Extract User Name
      const { email, password } = this.state;
      const userName = email.split('@')[0];
      // Clear Cognito Storage
      libs.cognitoClient.clearStorage();
      // Get Cognito Credentials
      await libs.cognitoClient.setUserSessionByAuthentication(userName, password);
      await libs.cognitoClient.updateCredentials();
      const cognitoCredentials = await libs.cognitoClient.getCredentials();
      // Set Pending State To Start
      await this.setGlobalState({
        isPending: true,
      });
      // Attach IoT Principal Policy
      await this.attachIotPolicy(cognitoCredentials.identityId);
      // Check Message Group
      const currentUser = userName;
      const currentGroup = currentUser;
      if (!await this.checkMessageGroup(currentGroup)) {
        await this.createMessageGroup(currentGroup, currentUser);
      }
      // Update State
      await this.setGlobalState({
        isPending: false,
        currentPage: '/',
        currentUser,
        currentGroup,
      });
    } catch (e) {
      // console.log(e);
      global.window.alert(e.message || e);
    }
  }

  handleMoveSignupPage = async () => {
    await this.setGlobalState({
      currentPage: '/signup',
    });
  }

  render() {
    return (
      <ChatSigninWrapper>
        <SigninForm
          handleInputEmail={this.handleInputEmail}
          handleInputPassword={this.handleInputPassword}
          handleSignin={this.handleSignin}
          handleMoveSignupPage={this.handleMoveSignupPage}
        />
      </ChatSigninWrapper>
    );
  }
}

ChatSignin.propTypes = {
  getGlobalState: PropTypes.func.isRequired,
  setGlobalState: PropTypes.func.isRequired,
};

export default ChatSignin;
