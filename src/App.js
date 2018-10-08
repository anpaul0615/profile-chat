import React, {Component} from 'react';
import './App.css';
import ChatSignin from './components/ChatSignin';
import ChatSignup from './components/ChatSignup';
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
            currentPage: '/',
            isAuthenticated: false,
            chatGroups: [],
            currentUser: '',
            currentGroup: '',
            messageBuffer: '',
            messages: []
        };
    }


    /* Page Router */
    changeCurrentPage = (page)=>{
        this.setState((prevState,props)=>({ currentPage: page }));
    }
    handleClickOpenChatGroupButton = ()=>{
        this.changeCurrentPage('/group');
        this.initChatGroups();
    }
    handleClickCloseChatGroupButton = ()=>{
        this.changeCurrentPage('/');
    }
    checkAuthentication = ()=>{
        const { isAuthenticated }= this.state;
        if (!isAuthenticated) {
            this.changeCurrentPage('/signin');
            return false;
        }
        return true;
    }


    /* Authentication Functions */
    attachIotPolicy = (identityId)=>{
        return new PolicyManager().attachUserIdentityToPolicy('iot-chat-policy', identityId);
    }
    checkMessageGroup = (groupId)=>{
        return this.apigwClient.invokeAPIGateway({
                path: '/messages/group',
                method: 'GET',
                queryParams: { groupId }
            })
            .then(()=>true)
            .catch(()=>false);
    }
    createMessageGroup = (groupId,userName)=>{
        return this.apigwClient.invokeAPIGateway({
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
        return this.apigwClient.invokeAPIGateway({
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
            const { cognitoCredentials, identityId, userName } = await this.cognitoClient.refreshCredentialsFromStorage();
            // Attach IoT Principal Policy
            await this.attachIotPolicy(identityId);
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
            this.mqttClient = new MQTTClient(cognitoCredentials, currentUser, this.handleRecieveMessage);
            // Subscribe Message Group
            await this.mqttClient.subscribe(currentGroup);
            // Move Scroll To Bottom
            this.setScrollPositionToBottom();

        } catch (e) {
            console.log(e);
        }
    }
    signin = async (email,password)=>{
        try {
            // Extract User Name
            const userName = email.split('@')[0];
            // Clear Cognito Storage
            this.cognitoClient.clearStorage();
            // Get Cognito Credentials
            const cognitoCredentials = await this.cognitoClient.getCredentials(userName, password);
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
            this.mqttClient = new MQTTClient(cognitoCredentials, currentUser, this.handleRecieveMessage);
            // Subscribe Message Group
            await this.mqttClient.subscribe(currentGroup);
            // Move Scroll To Bottom
            this.setScrollPositionToBottom();

        } catch (e) {
            console.log(e);
            alert(e.message || e);
        }
    }
    signup = async (email, password)=>{
        try {
            // Get Cognito Credentials
            await this.cognitoClient.registerNewAccount(email,password);
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
        this.cognitoClient.signout();
        this.cognitoClient.clearStorage();
        this.mqttClient.disconnect();
        this.setState((prevState,props)=>({
            currentPage: '/signin',
            isAuthenticated: false,
            hasNoAccount: false,
            currentUser: '',
            currentGroup: '',
            messageBuffer: '',
            messages: []
        }));
        // Close Iframe Window
        window.parent.postMessage('chat-off','*');
    }


    /* Group Functions */
    initChatGroups = async ()=>{
        try {
            const { currentUser } = this.state;
            const { data:chatGroups } = await this.apigwClient.invokeAPIGateway({
                path: '/messages/group/search',
                method: 'GET',
                queryParams: { userName: currentUser }
            });
            this.setState((prevState,props)=>({
                chatGroups: chatGroups
            }));

        } catch (e) {
            console.log(e);
        }
    }
    handleClickChatGroup = async (groupId)=>{
        try {
            // Get All Message History
            const { data:messageHistory } = await this.apigwClient.invokeAPIGateway({
                path: '/messages',
                method: 'GET',
                queryParams: { groupId, startDate: '1000-01-01T00:00:00.000Z' }
            });
            // Parse Message History
            const currentUser = this.state.currentUser;
            const messages = (messageHistory || []).map(e=>({
                isMine: e.userName === currentUser,
                userName: e.userName,
                content: e.content,
                regDate: e.regDate,
            }));
            // Change Message Group Subscribe
            const oldGroupId = this.state.currentGroup;
            await this.mqttClient.unsubscribe(oldGroupId);
            await this.mqttClient.subscribe(groupId);
            // Update Message History
            this.setState((prevState,props)=>({
                currentPage: '/',
                currentGroup: groupId,
                messages
            }));

        } catch (e) {
            console.log(e);
            alert(e.message || e);
        }
    }


    /* Messaging Functions */
    handleRecieveMessage = (messageChunk)=>{
        const oldMessages = this.state.messages;
        const newMessage = JSON.parse(messageChunk.toString());
        const { currentUser } = this.state;
        this.setState((prevState,props)=>({
            messages: [
                ...oldMessages,
                {
                    isMine: newMessage.userName === currentUser,
                    userName: newMessage.userName,
                    content: newMessage.content,
                    regDate: newMessage.regDate
                }
            ]
        }));
        this.setScrollPositionToBottom();
    }
    handleChangeInputText = (event)=>{
        const messageBuffer = event.target.value;
        this.setState((prevState,props)=>({
            messageBuffer
        }));
    }
    handleClickMessageSendButton = async ()=>{
        const { currentUser, currentGroup, messageBuffer } = this.state;
        if (messageBuffer === '') return;
        try {
            // Send Message to Database
            const messageBody = {
                groupId: currentGroup,
                regDate: new Date().toISOString(),
                content: messageBuffer,
                userName: currentUser
            };
            await this.apigwClient.invokeAPIGateway({
                path: '/messages',
                method: 'POST',
                body: messageBody
            }).catch(e=>e);
            // Send Message to MQTT
            await this.mqttClient.publish(currentGroup, JSON.stringify(messageBody));
            // Clear MessageBuffer
            this.setState((prevState,props)=>({
                messageBuffer: ''
            }));

        } catch (e) {
            console.log(e);
        }
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
                switch(this.state.currentPage) {
                case '/signin':
                    return <ChatSignin
                                key={'ChatSignin'}
                                signin={this.signin}
                                changeCurrentPage={this.changeCurrentPage} />
                case '/signup':
                    return <ChatSignup
                                key={'ChatSignup'}
                                signup={this.signup}
                                changeCurrentPage={this.changeCurrentPage} />;
                case '/group':
                    return <ChatGroup
                                key={'ChatGroup'}
                                checkAuthentication={this.checkAuthentication}
                                chatGroups={this.state.chatGroups}
                                handleClickChatGroup={this.handleClickChatGroup}
                                handleClickCloseChatGroupButton={this.handleClickCloseChatGroupButton} />;
                case '/':
                    return <Chat
                                key={'Chat'}
                                signout={this.signout}
                                checkAuthentication={this.checkAuthentication}
                                messages={this.state.messages}
                                messageBuffer={this.state.messageBuffer}
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