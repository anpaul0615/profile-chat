import React, {Component} from 'react';
import './App.css';
import ChatHeader from './components/ChatHeader';
import ChatBody from './components/ChatBody';
import ChatSignature from './components/ChatSignature';

import CognitoClient from './lib/cognito-client';
import MQTTClient from './lib/mqtt-client';

class App extends Component {
    constructor(){
        super();
        this.inputFetchingTimer = null;
        this.state = {
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
            messages: [
                {
                    user: 'paul',
                    content: 'aaa',
                    timestamp: 'yyyy-mm-dd hh:mm:ss'
                },
                {
                    user: 'guest',
                    content: 'bbb',
                    timestamp: 'yyyy-mm-dd hh:mm:ss'
                },
                {
                    user: 'guest',
                    content: 'ccc',
                    timestamp: 'yyyy-mm-dd hh:mm:ss'
                },
                {
                    user: 'paul',
                    content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
                    timestamp: 'yyyy-mm-dd hh:mm:ss'
                },
                {
                    user: 'guest',
                    content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
                    timestamp: 'yyyy-mm-dd hh:mm:ss'
                }
            ]
        };
    }
    handleClickExitButton = ()=>{
        console.log('handleClickExitButton is called..!');
        window.parent.postMessage('chat-off','*');
    }
    handleChangeInputText = (event)=>{
        console.log('handleChangeInputText is called..!');
        console.log(event.target.value);
        // alert('change!');
    }
    handleClickMessageSendButton = ()=>{
        console.log('handleClickMessageSendButton is called..!');
        alert('click!');
    }

    /* Signin Functions */
    handleInputSigninEmail = (event)=>{
        //console.log('handleInputSigninEmail is called..!');
        const email = event.target.value;
        this.setState({
            ...this.state,
            signin: {
                ...this.state.signin,
                email
            }
        });
    }
    handleInputSigninPassword = (event)=>{
        //console.log('handleInputSigninPassword is called..!');
        const password = event.target.value;
        this.setState({
            ...this.state,
            signin: {
                ...this.state.signin,
                password
            }
        });
    }
    handleClickSigninButton = async ()=>{
        try {
            // Get Cognito Credentials
            const { email, password } = this.state.signin;
            const cognitoClient = new CognitoClient();
            const cognitoCredentials = await cognitoClient.getCredentials(email,password);
            // Update Cognito Credentials To App State
            this.setState({
                ...this.state,
                auth: {
                    accessKeyId: cognitoCredentials.accessKeyId,
                    secretAccessKey: cognitoCredentials.secretAccessKey,
                    sessionToken: cognitoCredentials.sessionToken
                }
            });
            // Init MQTT Connection
            console.log(cognitoCredentials);
            const mqttClient = new MQTTClient(email, cognitoCredentials);
            mqttClient.subscribe(email);
            // Update Signin State
            this.setState({
                ...this.state,
                isAuthenticated: true
            });
        } catch(e) {
            alert(e.message || e);
        }
    }
    handleClickGoToSignupButton = ()=>{
        console.log('handleClickGoToSignupButton is called..!');
        this.setState({
            ...this.state,
            hasNoAccount: true
        });
    }

    /* Signup Functions */
    handleInputSignupEmail = (event)=>{
        console.log('handleInputSignupEmail is called..!');
        const email = event.target.value;
        this.setState({
            ...this.state,
            signup: {
                ...this.state.signup,
                email
            }
        });
    }
    handleInputSignupPassword = (event)=>{
        console.log('handleInputSignupPassword is called..!');
        const password = event.target.value;
        this.setState({
            ...this.state,
            signup: {
                ...this.state.signup,
                password
            }
        });
    }
    handleInputSignupPasswordAgain = (event)=>{
        console.log('handleInputSignupPasswordAgain is called..!');
        const password2 = event.target.value;
        this.setState({
            ...this.state,
            signup: {
                ...this.state.signup,
                password2
            }
        });
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
            const cognitoClient = new CognitoClient();
            const result = await cognitoClient.registerNewAccount(email,password);
            console.log(result);
            // Notify Success to User
            alert('Confirmation code was sent to your email!!');
            // Reset Signup Data
            this.setState({
                ...this.state,
                hasNoAccount: false,
                signup: {
                    email: '',
                    password: '',
                    password2: ''
                }
            });

        } catch(e) {
            alert(e.message || e);
        }
    }
    handleClickGoToSigninButton = ()=>{
        console.log('handleClickGoToSigninButton is called..!');
        this.setState({
            ...this.state,
            hasNoAccount: false
        });
    }

    render() {
        const { isAuthenticated, hasNoAccount } = this.state;
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
                <ChatHeader
                    key={'ChatHeader'}
                    handleClickExitButton={this.handleClickExitButton} />
                <ChatBody
                    key={'ChatBody'}
                    messages={this.state.messages}
                    handleChangeInputText={this.handleChangeInputText}
                    handleClickMessageSendButton={this.handleClickMessageSendButton} />
            </div>
        );
    }
}

export default App;
