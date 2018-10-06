import React, {Component} from 'react';
import './App.css';
import ChatSignature from './components/ChatSignature';
import Chat from './components/Chat';
import ChatGroup from './components/ChatGroup';

import CognitoClient from './lib/cognito-client';
import MQTTClient from './lib/mqtt-client';
import PolicyManager from './lib/policy-manager';
import APIGatewayClient from './lib/apigateway-client';

class App extends Component {
    constructor(){
        super();
        this.apigwClient = new APIGatewayClient();
        this.cognitoClient = new CognitoClient();
        this.inputFetchingTimer = null;
        this.state = {
            currentPath: '/',
            isAuthenticated: false,
            hasNoAccount: false,
            signin: {
                email: '',
                password: '',
            },
            signup: {
                email: '',
                password: '',
                password2: '',
            },
            chatGroups: [],
            currentUserName: '',
            currentGroupName: '',
            messageBuffer: '',
            messages: []
        };
    }

    /* Page Router */
    handlePageRouter = (path)=>{
        this.setState((prevState,props)=>({ currentPath: path }));
    }
    handleClickOpenChatGroupButton = ()=>{
        this.handlePageRouter('/group');
        this.initChatGroups();
    }
    handleClickCloseChatGroupButton = ()=>{
        this.handlePageRouter('/');
    }
    checkAuthentication = ()=>{
        const { isAuthenticated }= this.state;
        if (!isAuthenticated) {
            this.setState((prevState,props)=>({
                currentPath: '/auth'
            }));
            return false;
        }
        return true;
    }

    /* Signout Functions */
    handleClickAppExitButton = ()=>{
        // Confirm Signout
        if ( !window.confirm('Signout Now?') ) {
            return;
        }
        // Signout Cognito Connection
        this.cognitoClient.signout();
        // Disconnect MQTT Connection
        this.mqttClient.disconnect();
        // Clear All States
        this.setState((prevState,props)=>({
            currentPath: '/auth',
            isAuthenticated: false,
            hasNoAccount: false,
            signin: {
                email: '',
                password: '',
            },
            signup: {
                email: '',
                password: '',
                password2: '',
            },
            currentUserName: '',
            currentGroupName: '',
            messageBuffer: '',
            messages: []
        }));
        // Close Iframe Window
        window.parent.postMessage('chat-off','*');
    }

    /* Group Functions */
    initChatGroups = async ()=>{
        try {
            const { currentUserName } = this.state;
            const { data:chatGroups } = await this.apigwClient.invokeAPIGateway({
                path: '/messages/group/search',
                method: 'GET',
                queryParams: { username:currentUserName }
            });
            this.setState((prevState,props)=>({
                chatGroups: chatGroups,
                currentGroupName: chatGroups[0]
            }));

        } catch (e) {
            console.log(e);
        }
    }
    handleClickChatGroup = async (groupName)=>{
        try {
            // Get All Message History
            const { data:messageHistory } = await this.apigwClient.invokeAPIGateway({
                path: '/messages',
                method: 'GET',
                queryParams: { groupname: groupName, startDate: '1000-01-01T00:00:00.000Z' }
            });
            // Parse Message History
            const currentUserName = this.state.signin.email;
            const messages = (messageHistory || []).map(e=>({
                isMine: e.username === currentUserName,
                username: e.username,
                content: e.content,
                regdate: e.regdate,
            }));
            // Update Message History
            this.setState((prevState,props)=>({
                currentPath: '/',
                currentGroupName: groupName,
                messages
            }));

        } catch (e) {
            console.log(e);
            alert(e.message || e);
        }
    }

    /* Messaging Functions */
    handleChangeInputText = (event)=>{
        const messageBuffer = event.target.value;
        this.setState((prevState,props)=>({
            messageBuffer
        }));
    }
    handleClickMessageSendButton = async ()=>{
        const { currentUserName, currentGroupName, messageBuffer } = this.state;
        if (messageBuffer === '') return;

        const messageBody = {
            groupname: currentGroupName,
            regdate: new Date().toISOString(),
            content: messageBuffer,
            username: currentUserName
        };
        await this.apigwClient.invokeAPIGateway({
            path: '/messages',
            method: 'POST',
            body: messageBody
        }).catch(e=>e);
        this.mqttClient.publish(JSON.stringify(messageBody));

        // Clear MessageBuffer
        this.setState((prevState,props)=>({
            messageBuffer: ''
        }));
    }

    /* Signin Functions */
    attachIotPolicy = (identityId)=>{
        return new PolicyManager().attachUserIdentityToPolicy('iot-chat-policy', identityId);
    }
    initMqttConnection = (topic, credentials)=>{
        this.mqttClient = new MQTTClient(topic, credentials);
        this.mqttClient.registerRecieveMessageCallback(this.handleRecieveMessage);
        this.mqttClient.subscribe();
    }
    checkMessagGroup = (groupname)=>{
        return this.apigwClient.invokeAPIGateway({
                path: '/messages/group',
                method: 'GET',
                queryParams: { groupname }
            })
            .then(result=>true)
            .catch(e=>false);
    }
    createMessagGroup = (groupname,username)=>{
        return this.apigwClient.invokeAPIGateway({
                path: '/messages/group',
                method: 'POST',
                body: {
                    groupname,
                    userList: [ username, 'anpaul0615@gmail.com' ]
                }
            });
    }
    getMessageHistory = (groupname)=>{
        return this.apigwClient.invokeAPIGateway({
                path: '/messages',
                method: 'GET',
                queryParams: { groupname, startDate: '1000-01-01T00:00:00.000Z' }
            })
            .then(result=>result.data)
            .catch(e=>[]);
    }
    checkPreviousSessionData = async ()=>{
        try {
            // Get Credentials From Previous Session Data
            const { cognitoCredentials, userName } = await this.cognitoClient.refreshCredentialsFromStorage();
            // Attach IoT Principal Policy
            await this.attachIotPolicy(cognitoCredentials.identityId);
            // Init MQTT Connection
            this.initMqttConnection(userName, cognitoCredentials);
            // Check Message Group
            const currentUserName = userName;
            const currentGroupName = currentUserName;
            if (!await this.checkMessagGroup(currentGroupName))
                await this.createMessagGroup(currentGroupName,currentGroupName);
            // Get All Message History
            const messageHistory = await this.getMessageHistory(currentGroupName);
            // Parse Message History
            const messages = (messageHistory || []).map(e=>({
                isMine: e.username === currentUserName,
                username: e.username,
                content: e.content,
                regdate: e.regdate,
            }));
            this.setState((prevState,props)=>({
                currentPath: '/',
                isAuthenticated: true,
                currentUserName,
                currentGroupName,
                messages
            }));
            // Move Scroll To Bottom
            this.setScrollPositionToBottom();

        } catch (e) {
            console.log(e);
        }
    }
    handleInputSigninEmail = (event)=>{
        const email = event.target.value;
        this.setState((prevState,props)=>({
            signin: {
                ...prevState.signin,
                email
            }
        }));
    }
    handleInputSigninPassword = (event)=>{
        const password = event.target.value;
        this.setState((prevState,props)=>({
            signin: {
                ...prevState.signin,
                password
            }
        }));
    }
    handleClickSigninButton = async ()=>{
        try {
            // Get Cognito Credentials
            const userName = this.state.signin.email.split('@')[0];
            const cognitoCredentials = await this.cognitoClient.getCredentials(userName, this.state.signin.password);
            // Attach IoT Principal Policy
            await this.attachIotPolicy(cognitoCredentials.identityId);
            // Init MQTT Connection
            this.initMqttConnection(userName, cognitoCredentials);
            // Check Message Group
            const currentUserName = userName;
            const currentGroupName = currentUserName;
            if (!await this.checkMessagGroup(currentGroupName))
                await this.createMessagGroup(currentGroupName,currentGroupName);
            // Get All Message History
            const messageHistory = await this.getMessageHistory(currentGroupName);
            // Parse Message History
            const messages = (messageHistory || []).map(e=>({
                isMine: e.username === currentUserName,
                username: e.username,
                content: e.content,
                regdate: e.regdate,
            }));
            this.setState((prevState,props)=>({
                currentPath: '/',
                isAuthenticated: true,
                currentUserName,
                currentGroupName,
                messages
            }));
            // Move Scroll To Bottom
            this.setScrollPositionToBottom();

        } catch (e) {
            console.log(e);
            alert(e.message || e);
        }
    }
    handleRecieveMessage = (messageChunk)=>{
        const oldMessages = this.state.messages;
        const newMessage = JSON.parse(messageChunk.toString());
        const currentUserName = this.state.signin.email;
        this.setState((prevState,props)=>({
            messages: [
                ...oldMessages,
                {
                    isMine: newMessage.username === currentUserName,
                    username: newMessage.username,
                    content: newMessage.content,
                    regdate: newMessage.regdate
                }
            ]
        }));
        this.setScrollPositionToBottom();
    }
    handleClickGoToSignupButton = ()=>{
        this.setState((prevState,props)=>({
            hasNoAccount: true
        }));
    }

    /* Signup Functions */
    handleInputSignupEmail = (event)=>{
        const email = event.target.value;
        this.setState((prevState,props)=>({
            signup: {
                ...prevState.signup,
                email
            }
        }));
    }
    handleInputSignupPassword = (event)=>{
        const password = event.target.value;
        this.setState((prevState,props)=>({
            signup: {
                ...prevState.signup,
                password
            }
        }));
    }
    handleInputSignupPasswordAgain = (event)=>{
        const password2 = event.target.value;
        this.setState((prevState,props)=>({
            signup: {
                ...prevState.signup,
                password2
            }
        }));
    }
    handleClickSignupButton = async ()=>{
        // Check Validation
        const { email, password, password2 } = this.state.signup;
        if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)) {
            return alert('Email Format is Invalid..!');
        }
        if (password !== password2) {
            return alert('Password Confirm is not matched..!');
        }

        // Register New Account
        try {
            // Get Cognito Credentials
            await this.cognitoClient.registerNewAccount(email,password);
            // Notify Success to User
            alert('Confirmation code was sent to your email!!');
            // Reset Signup Data
            this.setState((prevState,props)=>({
                hasNoAccount: false,
                signup: {
                    email: '',
                    password: '',
                    password2: ''
                }
            }));

        } catch (e) {
            console.log(e);
            alert(e.message || e);
        }
    }
    handleClickGoToSigninButton = ()=>{
        this.setState((prevState,props)=>({
            hasNoAccount: false
        }));
    }
    
    /* Keyboard Shortcut Functions */
    handleKeydown = (event)=>{
        if (event.keyCode===13 && event.ctrlKey) {
            this.handleClickMessageSendButton();
        }
    }
    componentDidMount() {
        document.addEventListener('keydown', this.handleKeydown);
        this.checkPreviousSessionData();
    }
    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeydown);
    }

    /* Scroll Handle Functions */
    setScollDiv = (el)=>{
        this.scrollDiv = el;
    }
    setScrollPositionToBottom = ()=>{
        if (this.scrollDiv) {
            this.scrollDiv.scrollIntoView(false);
        }
    }

    render() {
        return (
            <div className="App">
            {(()=>{
                switch(this.state.currentPath) {
                case '/auth':
                    return <ChatSignature
                                key={'ChatSignature'}
                                hasNoAccount={this.state.hasNoAccount}
                                handleInputSigninEmail={this.handleInputSigninEmail}
                                handleInputSigninPassword={this.handleInputSigninPassword}
                                handleClickSigninButton={this.handleClickSigninButton}
                                handleClickGoToSignupButton={this.handleClickGoToSignupButton}
                                handleInputSignupEmail={this.handleInputSignupEmail}
                                handleInputSignupPassword={this.handleInputSignupPassword}
                                handleInputSignupPasswordAgain={this.handleInputSignupPasswordAgain}
                                handleClickSignupButton={this.handleClickSignupButton}
                                handleClickGoToSigninButton={this.handleClickGoToSigninButton} />;
                case '/group':
                    return <ChatGroup
                                checkAuthentication={this.checkAuthentication}
                                chatGroups={this.state.chatGroups}
                                handleClickChatGroup={this.handleClickChatGroup}
                                handleClickCloseChatGroupButton={this.handleClickCloseChatGroupButton} />;
                case '/':
                    return <Chat
                                checkAuthentication={this.checkAuthentication}
                                messages={this.state.messages}
                                messageBuffer={this.state.messageBuffer}
                                handleClickAppExitButton={this.handleClickAppExitButton}
                                handleClickOpenChatGroupButton={this.handleClickOpenChatGroupButton}
                                handleChangeInputText={this.handleChangeInputText}
                                handleClickMessageSendButton={this.handleClickMessageSendButton}
                                setScollDiv={this.setScollDiv} />;
                default:
                    return <h1>Something is wrong..!</h1>;
                }
            })()}
            </div>
        );
    }
}

export default App;
