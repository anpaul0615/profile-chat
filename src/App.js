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
            isAuthenticated: false,
            currentUser: '',
            currentGroup: '',
            messages: []
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


    /* Page Router */
    setPendingStart = ()=>{
        return new Promise((resolve) => {
            this.setState({ ...this.state, isPending: true }, resolve)
        });
    }
    setPendingFinish = ()=>{
        return new Promise((resolve)=>{
            this.setState({ ...this.state, isPending: false }, resolve)
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
            await this.setPendingStart();
            // Attach IoT Principal Policy
            await this.attachIotPolicy(cognitoCredentials.identityId);
            // Check Message Group
            const currentUser = userName;
            const currentGroup = currentUser;
            if (!await this.checkMessageGroup(currentGroup))
                await this.createMessageGroup(currentGroup,currentUser);
            // Get All Message History
            const messageHistory = await this.getMessageHistory(currentGroup);
            // Parse Message History
            const messages = (messageHistory || []).map(e=>({
                isMine: e.userName === currentUser,
                userName: e.userName,
                content: e.content,
                regDate: e.regDate,
            }));
            this.setState((prevState,props)=>({
                currentPage: '/',
                isAuthenticated: true,
                currentUser,
                currentGroup,
                messages
            }));

            // Init MQTT Connection
            await libs.mqttClient.init(currentUser);
            // Subscribe Message Group
            await libs.mqttClient.subscribe(currentGroup);
            libs.mqttClient.registerMessageCallback(this.appendMessage);

            // Move Scroll To Bottom
            this.moveMessageHistoryScollToBottom();
            // Set Pending State To Finish
            await this.setPendingFinish();

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
            await libs.cognitoClient.setUserSessionByAuthentication(userName, password);
            await libs.cognitoClient.updateCredentials();
            const cognitoCredentials = await libs.cognitoClient.getCredentials();
            // Set Pending State To Start
            await this.setPendingStart();
            // Attach IoT Principal Policy
            await this.attachIotPolicy(cognitoCredentials.identityId);
            // Check Message Group
            const currentUser = userName;
            const currentGroup = currentUser;
            if (!await this.checkMessageGroup(currentGroup))
                await this.createMessageGroup(currentGroup,currentUser);
            // Get All Message History
            const messageHistory = await this.getMessageHistory(currentGroup);
            // Parse Message History
            const messages = (messageHistory || []).map(e=>({
                isMine: e.userName === currentUser,
                userName: e.userName,
                content: e.content,
                regDate: e.regDate,
            }));
            this.setState((prevState,props)=>({
                currentPage: '/',
                isAuthenticated: true,
                currentUser,
                currentGroup,
                messages
            }));

            // Init MQTT Connection
            libs.mqttClient.init(currentUser);
            // Subscribe Message Group
            await libs.mqttClient.subscribe(currentGroup);
            libs.mqttClient.registerMessageCallback(this.appendMessage);

            // Move Scroll To Bottom
            this.moveMessageHistoryScollToBottom();
            // Set Pending State To Finish
            await this.setPendingFinish();

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
            this.setState((prevState,props)=>({
                currentPage: '/signin'
            }));

        } catch (e) {
            console.log(e);
            alert(e.message || e);
        }
    }
    signout = ()=>{
        if ( !window.confirm('Signout Now?') ) {
            return;
        }
        libs.cognitoClient.signout();
        libs.cognitoClient.clearStorage();
        libs.mqttClient.disconnect();
        this.setState((prevState,props)=>({
            currentPage: '/signin',
            isAuthenticated: false,
            hasNoAccount: false,
            currentUser: '',
            currentGroup: '',
            messages: []
        }));
        // Close Iframe Window
        window.parent.postMessage('chat-off','*');
    }


    /* Messaging Functions */
    appendMessage = (messageChunk)=>{
        let newMessage = JSON.parse(messageChunk);
        newMessage.isMine = (newMessage.userName === this.state.currentUser);
        this.setState((prevState,props)=>({
            messages: [ ...prevState.messages, newMessage ]
        }));
        this.moveMessageHistoryScollToBottom();
    }
    sendMessage = async (messageBuffer)=>{
        const { currentUser, currentGroup } = this.state;
        if (messageBuffer === '') return;
        try {
            // Set Pending State To Start
            await this.setPendingStart();
            // Send Message to Database
            const messageBody = {
                groupId: currentGroup,
                regDate: new Date().toISOString(),
                content: messageBuffer,
                userName: currentUser
            };
            await libs.apigwClient.invokeAPIGateway({
                path: '/messages',
                method: 'POST',
                body: messageBody
            }).catch(e=>e);
            // Send Message to MQTT
            await libs.mqttClient.publish(currentGroup, JSON.stringify(messageBody));
            // Clear MessageBuffer
            this.setState((prevState,props)=>({
                messageBuffer: ''
            }));
            // Set Pending State To Finish
            await this.setPendingFinish();

        } catch (e) {
            console.log(e);
        }
    }

    
    /* Scroll Handle Functions */
    initMessageHistoryScoll = (el)=>{
        this.messageHistoryScrollDiv = el;
    }
    moveMessageHistoryScollToBottom = ()=>{
        if (this.messageHistoryScrollDiv) {
            this.messageHistoryScrollDiv.scrollIntoView(false);
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
                                getGlobalState={this.getGlobalState}
                                signout={this.signout}
                                messages={this.state.messages}
                                sendMessage={this.sendMessage}
                                initMessageHistoryScoll={this.initMessageHistoryScoll}
                                moveMessageHistoryScollToBottom={this.moveMessageHistoryScollToBottom} />;
                default:
                    return <h1>Something is wrong..!</h1>;
                }
                })()}
            </div>
        );
    }
}
export default App;