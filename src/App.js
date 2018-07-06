import APIConfig from './configs/api.config.json';
import React, {Component} from 'react';
import Axios from 'axios';
import './App.css';
import ChatHeader from './components/ChatHeader';
import ChatBody from './components/ChatBody';
import ChatConfigHeader from "./components/ChatConfigHeader";
import ChatConfigBody from "./components/ChatConfigBody";

class App extends Component {
    constructor(){
        super();
        this.inputFetchingTimer = null;
        this.state = {
            isConfigMode: false,
            chatMode: {
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
                ],
            },
            configMode: {
                isFetching: false,
                userAccessCode: '',
                userName: '',
                userContact: ''
            }
        };
    }

    getUserInfo = async (accessCode)=>{
        try {
            // before
            this.setState({
                ...this.state,
                configMode: {
                    ...this.state.configMode,
                    isFetching: true
                }
            });
            // fetching
            const { data } = await Axios({
                url: '/auth/users',
                method: 'GET',
                baseURL: APIConfig.endpoint,
                headers: { accessCode }
            }).then(result=>result.data);
            // done
            this.setState({
                ...this.state,
                configMode: {
                    ...this.state.configMode,
                    isFetching: false,
                    userAccessCode: accessCode,
                    userName: data.userName,
                    userContact: data.userContact
                }
            });

        } catch(e) {
            console.log(e);
            this.setState({
                ...this.state,
                configMode: {
                    ...this.state.configMode,
                    isFetching: false
                }
            });
        }
    }

    handleClickOpenConfigButton = ()=>{
        console.log('handleClickOpenConfigButton is called..!');
        this.setState({
            ...this.state,
            isConfigMode: true
        });
    }
    handleClickExitButton = ()=>{
        console.log('handleClickExitButton is called..!');
        window.parent.postMessage('chat-off','*');
    }
    handleClickCloseConfigButton = ()=>{
        console.log('handleClickCloseConfigButton is called..!');
        this.setState({
            ...this.state,
            isConfigMode: false
        });
    }
    handleChangeUserAccessCode = (userAccessCode)=>{
        if (this.inputFetchingTimer) {
            clearTimeout(this.inputFetchingTimer);
        }
        this.inputFetchingTimer = setTimeout(()=>{
            this.getUserInfo(userAccessCode);
        }, 1000);
    }
    handleClickRequestButton = async ()=>{
        const userName = window.prompt('Please enter your name: (ex. Paul An)', '');
        if (!userName) return;

        const userContact = window.prompt('Please enter your contact: (ex. anpaul0615@gmail.com)', '');
        if (!userContact) return;

        const isConfirm = window.confirm('Request access-code now?');
        if (isConfirm) {
            try {
                await Axios({
                    url: '/auth/users',
                    method: 'POST',
                    baseURL: APIConfig.endpoint,
                    data: {
                        userName,
                        userContact
                    }
                }).then(result=>result.data);

            } catch(e) {
                const { userAccessCode, userName, userContact } = e.response.data.data;
                if (userAccessCode) {
                    let msg = 'Already registered..!\n\n';
                    msg += `Access Code : ${userAccessCode}\n`;
                    msg += `Name : ${userName}\n`;
                    msg += `Contact : ${userContact}\n`;
                    alert(msg);
                } else {
                    alert('Unexpected Error..!');
                }
            }
        }
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

    render() {
        const { isConfigMode } = this.state;
        const { userName, userContact } = this.state.configMode;
        return (
            <div className="App">
                {
                    isConfigMode
                        ?
                        [
                            <ChatConfigHeader
                                key={'ChatConfigHeader'}
                                handleClickCloseConfigButton={this.handleClickCloseConfigButton} />,
                            <ChatConfigBody
                                key={'ChatConfigBody'}
                                userName={userName}
                                userContact={userContact}
                                handleChangeUserAccessCode={this.handleChangeUserAccessCode}
                                handleChangeUserName={this.handleChangeUserName}
                                handleChangeUserContact={this.handleChangeUserContact}
                                handleClickRequestButton={this.handleClickRequestButton} />
                        ]
                        :
                        [
                            <ChatHeader
                                key={'ChatHeader'}
                                handleClickOpenConfigButton={this.handleClickOpenConfigButton}
                                handleClickExitButton={this.handleClickExitButton} />,
                            <ChatBody
                                key={'ChatBody'}
                                messages={this.state.chatMode.messages}
                                handleChangeInputText={this.handleChangeInputText}
                                handleClickMessageSendButton={this.handleClickMessageSendButton} />
                        ]
                }

            </div>
        );
    }
}

export default App;
