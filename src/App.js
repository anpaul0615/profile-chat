import React, {Component} from 'react';
import './App.css';
import ChatHeader from './components/ChatHeader';
import ChatBody from './components/ChatBody';
import Login from './components/Login';

import CognitoClient from './lib/cognito-client';
import MQTTClient from './lib/mqtt-client';

class App extends Component {
    constructor(){
        super();
        this.inputFetchingTimer = null;
        this.state = {
            isAuthenticated: false,
            auth: {
                email: '',
                password: '',
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
    handleInputEmail = (event)=>{
        //console.log('handleInputEmail is called..!');
        const email = event.target.value;
        this.setState({
            ...this.state,
            auth: {
                ...this.state.auth,
                email
            }
        });
    }
    handleInputPassword = (event)=>{
        //console.log('handleInputPassword is called..!');
        const password = event.target.value;
        this.setState({
            ...this.state,
            auth: {
                ...this.state.auth,
                password
            }
        });
    }
    handleClickLoginButton = async ()=>{
        try {
            // Get Cognito Credentials
            const { email, password } = this.state.auth;
            const cognitoClient = new CognitoClient(email,password);
            const cognitoCredentials = await cognitoClient.getCredentials();
            // Update Cognito Credentials To App State
            this.setState({
                ...this.state,
                auth: {
                    ...this.state.auth,
                    accessKeyId: cognitoCredentials.accessKeyId,
                    secretAccessKey: cognitoCredentials.secretAccessKey,
                    sessionToken: cognitoCredentials.sessionToken
                }
            });
            // Init MQTT Connection
            console.log(cognitoCredentials);
            const mqttClient = new MQTTClient(email, cognitoCredentials);
            mqttClient.subscribe(email);
            // Update Login State
            this.setState({
                ...this.state,
                isAuthenticated: true
            });
        } catch(e) {
            alert(e.message || e);
        }
    }

    render() {
        const { isAuthenticated } = this.state;
        return (
            <div className="App">
                {
                    isAuthenticated
                    ? null
                    : <Login
                        key={'Login'}
                        handleInputEmail={this.handleInputEmail}
                        handleInputPassword={this.handleInputPassword}
                        handleClickLoginButton={this.handleClickLoginButton} />
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
