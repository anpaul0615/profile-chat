import React, {Component} from 'react';
import './App.css';
import ChatSignin from './components/ChatSignin';
import ChatSignup from './components/ChatSignup';
import Chat from './components/Chat';
import ChatGroup from './components/ChatGroup';
import LoadingCircle from './components/LoadingCircle';

class App extends Component {
    constructor() {
        super();
        this.state = {
            isPending: false,
            currentPage: '/signin',
            currentUser: '',
            currentGroup: ''
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

    render() {
        return (
            <div className="App">
                { this.state.isPending ? <LoadingCircle /> : null }
                {(()=>{
                switch(this.state.currentPage) {
                case '/signin':
                    return <ChatSignin
                                key={'ChatSignin'}
                                setGlobalState={this.setGlobalState}
                                getGlobalState={this.getGlobalState} />
                case '/signup':
                    return <ChatSignup
                                key={'ChatSignup'}
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
                                getGlobalState={this.getGlobalState} />;
                default:
                    return <h1>Something is wrong..!</h1>;
                }
                })()}
            </div>
        );
    }
}
export default App;