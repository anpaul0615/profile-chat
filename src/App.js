import React, {Component} from 'react';
import './App.css';
import ChatHeader from './components/ChatHeader';
import ChatBody from './components/ChatBody';

class App extends Component {
    render() {
        return (
            <div className="App">
                <ChatHeader />
                <ChatBody />
            </div>
        );
    }
}

export default App;
