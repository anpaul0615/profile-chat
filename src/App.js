import React, { Component } from 'react';
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
      currentUser: undefined,
      currentPage: '/signin',
    };
  }

  getGlobalState = () => new Promise(
    resolve => resolve(this.state),
  );

  setGlobalState = newState => new Promise(
    resolve => this.setState(() => {
      resolve();
      return { ...newState };
    }),
  );

  render() {
    const { isPending, currentPage } = this.state;
    return (
      <div className="App">
        { isPending && <LoadingCircle /> }
        {(() => {
          switch (currentPage) {
            case '/signin':
              return (
                <ChatSignin
                  key="ChatSignin"
                  setGlobalState={this.setGlobalState}
                  getGlobalState={this.getGlobalState}
                />
              );
            case '/signup':
              return (
                <ChatSignup
                  key="ChatSignup"
                  setGlobalState={this.setGlobalState}
                  getGlobalState={this.getGlobalState}
                />
              );
            case '/group':
              return (
                <ChatGroup
                  key="ChatGroup"
                  setGlobalState={this.setGlobalState}
                  getGlobalState={this.getGlobalState}
                />
              );
            case '/':
              return (
                <Chat
                  key="Chat"
                  setGlobalState={this.setGlobalState}
                  getGlobalState={this.getGlobalState}
                />
              );
            default:
              return <h1>Something is wrong..!</h1>;
          }
        })()}
      </div>
    );
  }
}

export default App;
