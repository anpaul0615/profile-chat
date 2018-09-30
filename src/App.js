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
            auth: {
                accessKeyId: '',
                secretKey: '',
                sessionToken: ''
            },
            messageGroup: '',
            messageBuffer: '',
            messages: []
        };
    }

    /* Page Router */
    handlePageRouter = (path)=>{
        console.log(path);
        this.setState((prevState,props)=>({ currentPath: path }));
    }
    handleClickOpenChatGroupButton = ()=>{
        this.handlePageRouter('/group');
    }
    handleClickCloseChatGroupButton = ()=>{
        this.handlePageRouter('/');
    }

    /* Signout Functions */
    handleClickAppExitButton = ()=>{
        console.log('handleClickAppExitButton is called..!');
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
            auth: {
                accessKeyId: '',
                secretKey: '',
                sessionToken: ''
            },
            messages: []
        }));
        // Close Iframe Window
        window.parent.postMessage('chat-off','*');
    }

    /* Messaging Functions */
    handleChangeInputText = (event)=>{
        // console.log('handleChangeInputText is called..!');
        this.setState((prevState,props)=>({
            messageBuffer: event.target.value
        }));
    }
    handleClickMessageSendButton = async ()=>{
        // console.log('handleClickMessageSendButton is called..!');
        const { messageGroup, messageBuffer } = this.state;
        if (messageBuffer === '') return;

        const messageBody = {
            groupname: messageGroup,
            regdate: new Date().toISOString(),
            content: messageBuffer,
            username: this.state.signin.email
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
    handleInputSigninEmail = (event)=>{
        //console.log('handleInputSigninEmail is called..!');
        const email = event.target.value;
        this.setState((prevState,props)=>({
            signin: {
                ...prevState.signin,
                email
            }
        }));
    }
    handleInputSigninPassword = (event)=>{
        //console.log('handleInputSigninPassword is called..!');
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
            const { email, password } = this.state.signin;
            const cognitoCredentials = await this.cognitoClient.getCredentials(email,password);
            // Update Cognito Credentials To App State
            this.setState((prevState,props)=>({
                auth: {
                    accessKeyId: cognitoCredentials.accessKeyId,
                    secretAccessKey: cognitoCredentials.secretAccessKey,
                    sessionToken: cognitoCredentials.sessionToken
                }
            }));
            // Attach Principal Policy
            const { identityId } = cognitoCredentials;
            const policyManager = new PolicyManager();
            await policyManager.attachUserIdentityToPolicy('iot-chat-policy', identityId);
            // Init MQTT Connection
            this.mqttClient = new MQTTClient(email, cognitoCredentials);
            this.mqttClient.registerRecieveMessageCallback(this.handleRecieveMessage);
            this.mqttClient.subscribe();
            
            // Check Message Group
            await this.apigwClient.invokeAPIGateway({
                path: '/messages/group',
                method: 'GET',
                queryParams: { groupname: email }
            })
            .catch(e=>
                this.apigwClient.invokeAPIGateway({
                    path: '/messages/group',
                    method: 'POST',
                    body: {
                        groupname: email,
                        userList: [ email, 'anpaul0615@gmail.com' ]
                    }
                }).catch(e=>e)
            );

            // Get All Message History
            const { data:messageHistory } = await this.apigwClient.invokeAPIGateway({
                path: '/messages',
                method: 'GET',
                queryParams: { groupname: email, startDate: '1000-01-01T00:00:00.000Z' }
            }).catch(e=>e);

            // Parse Message History
            const messages = (messageHistory || []).map(e=>({
                user: e.username === 'anpaul0615@gmail.com' ? 'paul' : e.username,
                content: e.content,
                timestamp: e.regdate,
            }));

            // Update Signin State & Message History
            this.setState((prevState,props)=>({
                messageGroup: email,
                messages,
                isAuthenticated: true
            }));

            // Move Scroll To Bottom
            this.setScrollPositionToBottom();

        } catch(e) {
            // console.log(e);
            alert(e.message || e);
        }
    }
    handleRecieveMessage = (messageChunk)=>{
        const oldMessages = this.state.messages;
        const newMessage = JSON.parse(messageChunk.toString());
        this.setState((prevState,props)=>({
            messages: [
                ...oldMessages,
                {
                    user: newMessage.username === 'anpaul0615@gmail.com' ? 'paul' : newMessage.username,
                    content: newMessage.content,
                    timestamp: newMessage.regdate
                }
            ]
        }));
        this.setScrollPositionToBottom();
    }
    handleClickGoToSignupButton = ()=>{
        console.log('handleClickGoToSignupButton is called..!');
        this.setState((prevState,props)=>({
            hasNoAccount: true
        }));
    }

    /* Signup Functions */
    handleInputSignupEmail = (event)=>{
        console.log('handleInputSignupEmail is called..!');
        const email = event.target.value;
        this.setState((prevState,props)=>({
            signup: {
                ...prevState.signup,
                email
            }
        }));
    }
    handleInputSignupPassword = (event)=>{
        console.log('handleInputSignupPassword is called..!');
        const password = event.target.value;
        this.setState((prevState,props)=>({
            signup: {
                ...prevState.signup,
                password
            }
        }));
    }
    handleInputSignupPasswordAgain = (event)=>{
        console.log('handleInputSignupPasswordAgain is called..!');
        const password2 = event.target.value;
        this.setState((prevState,props)=>({
            signup: {
                ...prevState.signup,
                password2
            }
        }));
    }
    handleClickSignupButton = async ()=>{
        console.log('handleClickSignupButton is called..!');

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
            const result = await this.cognitoClient.registerNewAccount(email,password);
            console.log(result);
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

        } catch(e) {
            alert(e.message || e);
        }
    }
    handleClickGoToSigninButton = ()=>{
        console.log('handleClickGoToSigninButton is called..!');
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
        const { currentPath, isAuthenticated, hasNoAccount } = this.state;
        return (
            <div className="App">
                {
                    isAuthenticated
                    ? null
                    : <ChatSignature
                        key={'ChatSignature'}
                        hasNoAccount={hasNoAccount}
                        handleInputSigninEmail={this.handleInputSigninEmail}
                        handleInputSigninPassword={this.handleInputSigninPassword}
                        handleClickSigninButton={this.handleClickSigninButton}
                        handleClickGoToSignupButton={this.handleClickGoToSignupButton}
                        handleInputSignupEmail={this.handleInputSignupEmail}
                        handleInputSignupPassword={this.handleInputSignupPassword}
                        handleInputSignupPasswordAgain={this.handleInputSignupPasswordAgain}
                        handleClickSignupButton={this.handleClickSignupButton}
                        handleClickGoToSigninButton={this.handleClickGoToSigninButton} />
                }
                {
                    currentPath === '/group'
                    ? <ChatGroup handleClickCloseChatGroupButton={this.handleClickCloseChatGroupButton} />
                    : <Chat
                        messages={this.state.messages}
                        messageBuffer={this.state.messageBuffer}
                        handleClickAppExitButton={this.handleClickAppExitButton}
                        handleClickOpenChatGroupButton={this.handleClickOpenChatGroupButton}
                        handleChangeInputText={this.handleChangeInputText}
                        handleClickMessageSendButton={this.handleClickMessageSendButton}
                        setScollDiv={this.setScollDiv} />
                }
            </div>
        );
    }
}

export default App;
