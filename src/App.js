import React, {Component} from 'react';
import './App.css';
import ChatHeader from './components/ChatHeader';
import ChatBody from './components/ChatBody';
import ChatConfigHeader from "./components/ChatConfigHeader";
import ChatConfigBody from "./components/ChatConfigBody";

class App extends Component {
    constructor(){
        super();
        this.state = {
            isConfigMode: false,
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
    handleClickOpenConfigButton = ()=>{
        console.log('handleClickOpenConfigButton is called..!');
        this.setState({
            isConfigMode: true
        });
    }
    handleClickExitButton = ()=>{
        console.log('handleClickExitButton is called..!');
        alert('exit!');
    }
    handleClickCloseConfigButton = ()=>{
        console.log('handleClickCloseConfigButton is called..!');
        this.setState({
            isConfigMode: false
        });
    }
    handleChangeUserAccessCode = (event)=>{
        console.log('handleChangeUserAccessCode is called..!');
        console.log(event.target.value);
        // alert('change!');
    }
    handleChangeUserName = (event)=>{
        console.log('handleChangeUserName is called..!');
        console.log(event.target.value);
        // alert('change!');
    }
    handleChangeUserContact = (event)=>{
        console.log('handleChangeUserContact is called..!');
        console.log(event.target.value);
        // alert('change!');
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
        console.log(isConfigMode);
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
                                handleChangeUserAccessCode={this.handleChangeUserAccessCode} 
                                handleChangeUserName={this.handleChangeUserName} 
                                handleChangeUserContact={this.handleChangeUserContact} />
                        ]
                        :
                        [
                            <ChatHeader
                                key={'ChatHeader'}
                                handleClickOpenConfigButton={this.handleClickOpenConfigButton}
                                handleClickExitButton={this.handleClickExitButton} />,
                            <ChatBody
                                key={'ChatBody'}
                                messages={this.state.messages}
                                handleChangeInputText={this.handleChangeInputText}
                                handleClickMessageSendButton={this.handleClickMessageSendButton} />
                        ]
                }

            </div>
        );
    }
}

export default App;
