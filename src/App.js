import React, {Component} from 'react';
import './App.css';
import ChatHeader from './components/ChatHeader';
import ChatBody from './components/ChatBody';
import ChatConfiguration from "./components/ChatConfiguration";

class App extends Component {
    constructor(){
        super();
        this.state = {
            configMode: false,
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
    handleClickConfigButton = ()=>{
        console.log('handleClickConfigButton is called..!');
        this.setState({
            configMode: true
        });
    }
    handleClickExitButton = ()=>{
        console.log('handleClickExitButton is called..!');
        alert('exit!');
    }
    handleClickCloseConfigButton = ()=>{
        console.log('handleClickCloseConfigButton is called..!');
        this.setState({
            configMode: false
        });
    }
    render() {
        console.log(this.state.configMode);
        return (
            <div className="App">
                {
                    this.state.configMode
                        ?
                        <ChatConfiguration
                            handleClickCloseConfigButton={this.handleClickCloseConfigButton} />
                        :
                        [
                            <ChatHeader
                                handleClickConfigButton={this.handleClickConfigButton}
                                handleClickExitButton={this.handleClickExitButton} />,
                            <ChatBody
                                messages={this.state.messages} />
                        ]
                }

            </div>
        );
    }
}

export default App;
