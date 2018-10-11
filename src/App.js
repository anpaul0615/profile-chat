import React, {Component} from 'react';
import './App.css';
import ChatSignin from './components/ChatSignin';
import ChatSignup from './components/ChatSignup';
import Chat from './components/Chat';
import ChatGroup from './components/ChatGroup';
import LoadingCircle from './components/LoadingCircle';

import * as libs from './lib';

class App extends Component {
    constructor() {
        super();
        this.state = {
            isPending: false,
            currentPage: '/signin',
            currentUser: '',
            currentGroup: ''
        };
    }


    /* State Manage Functions */
    getGlobalState = ()=>{
        return new Promise((resolve) => {
            resolve(this.state);
        });
    }
    setGlobalState = (newState)=>{
        return new Promise((resolve) => {
            this.setState({ ...this.state, ...newState }, resolve)
        });
    }


    /* Authentication Functions */
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
    getMessageHistory = (groupId)=>{
        return libs.apigwClient.invokeAPIGateway({
                path: '/messages',
                method: 'GET',
                queryParams: { groupId, startDate: '1000-01-01T00:00:00.000Z' }
            })
            .then(result=>result.data)
            .catch(e=>[]);
    }
    checkPreviousSessionData = async ()=>{
        try {
            // Get Credentials From Previous Session Data
            await libs.cognitoClient.setUserSessionFromStorage();
            await libs.cognitoClient.updateCredentials();
            const cognitoCredentials = await libs.cognitoClient.getCredentials();
            const userName = await libs.cognitoClient.getUserName();
            // Set Pending State To Start
            await this.setGlobalState({
                isPending: true
            });
            // Attach IoT Principal Policy
            await this.attachIotPolicy(cognitoCredentials.identityId);
            // Check Message Group
            const currentUser = userName;
            const currentGroup = currentUser;
            if (!await this.checkMessageGroup(currentGroup))
                await this.createMessageGroup(currentGroup,currentUser);
            // Update State
            await this.setGlobalState({
                isPending: false,
                currentPage: '/',
                currentUser,
                currentGroup
            });

        } catch (e) {
            console.log(e);
        }
    }
    signin = async (email,password)=>{
        try {
            // Extract User Name
            const userName = email.split('@')[0];
            // Clear Cognito Storage
            libs.cognitoClient.clearStorage();
            // Get Cognito Credentials
            await libs.cognitoClient.setUserSessionByAuthentication(userName,password);
            await libs.cognitoClient.updateCredentials();
            const cognitoCredentials = await libs.cognitoClient.getCredentials();
            // Set Pending State To Start
            await this.setGlobalState({
                isPending: true
            });
            // Attach IoT Principal Policy
            await this.attachIotPolicy(cognitoCredentials.identityId);
            // Check Message Group
            const currentUser = userName;
            const currentGroup = currentUser;
            if (!await this.checkMessageGroup(currentGroup))
                await this.createMessageGroup(currentGroup,currentUser);
            // Update State
            await this.setGlobalState({
                isPending: false,
                currentPage: '/',
                currentUser,
                currentGroup
            });

        } catch (e) {
            console.log(e);
            alert(e.message || e);
        }
    }
    signup = async (email, password)=>{
        try {
            // Get Cognito Credentials
            await libs.cognitoClient.registerNewAccount(email,password);
            // Notify Success to User
            alert('Confirmation code was sent to your email!!');
            // Go To Signin Page
            await this.setGlobalState({
                currentPage: '/signin'
            });

        } catch (e) {
            console.log(e);
            alert(e.message || e);
        }
    }


    componentDidMount() {
        this.checkPreviousSessionData();
    }
    render() {
        return (
            <div className="App">
                { this.state.isPending ? <LoadingCircle /> : null }
                {(()=>{
                switch(this.state.currentPage) {
                case '/signin':
                    return <ChatSignin
                                key={'ChatSignin'}
                                signin={this.signin}
                                setGlobalState={this.setGlobalState}
                                getGlobalState={this.getGlobalState} />
                case '/signup':
                    return <ChatSignup
                                key={'ChatSignup'}
                                signup={this.signup}
                                setGlobalState={this.setGlobalState}
                                getGlobalState={this.getGlobalState} />;
                case '/group':
                    return <ChatGroup
                                key={'ChatGroup'}
                                setGlobalState={this.setGlobalState}
                                getGlobalState={this.getGlobalState} />;
                case '/':
                    return <Chat
                                key={'Chat'}
                                setGlobalState={this.setGlobalState}
                                getGlobalState={this.getGlobalState} />;
                default:
                    return <h1>Something is wrong..!</h1>;
                }
                })()}
            </div>
        );
    }
}
export default App;