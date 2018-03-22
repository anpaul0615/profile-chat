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
                    content: 'aaa',
                    timestamp: 'yyyy-mm-dd hh:mm:ss'
                },
                {
                    content: 'bbb',
                    timestamp: 'yyyy-mm-dd hh:mm:ss'
                },
                {
                    content: 'ccc',
                    timestamp: 'yyyy-mm-dd hh:mm:ss'
                }
            ]
        };
    }
    handleEnterConfigClick = ()=>{
        console.log('handleEnterConfigClick is called..!');
        this.setState({
            configMode: true
        });
    }
    handleExitConfigClick = ()=>{
        console.log('handleExitConfigClick is called..!');
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
                            handleExitConfigClick={this.handleExitConfigClick} />
                        :
                        [
                            <ChatHeader
                                handleEnterConfigClick={this.handleEnterConfigClick} />,
                            <ChatBody
                                messages={this.state.messages} />
                        ]
                }

            </div>
        );
    }
}

export default App;
