import React, { useEffect, useState } from "react";
import './App.css';
import Sidebar from "./Sidebar";
import Chat from "./Chat";
import Pusher from "pusher-js";
import axios from "./axios";
import Login from "./Login";
import {useStateValue} from './StateProvider'

function App() {
  const [messages, setMessages] = useState([]);
  const [{user},dispatch]= useStateValue()
  useEffect(() => {
    axios.get('/messages/sync').then(response => {
      setMessages(response.data);
    })
  }, []);

  useEffect(() => {
    const pusher = new Pusher('02f75b8643a9091101fe', {
      cluster: 'ap2'
    });

    const channel = pusher.subscribe('messages');
    channel.bind('inserted', (newMessage) => {
      // alert(JSON.stringify(newMessage));
      setMessages([...messages, newMessage])
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    }
  }, [messages]);

  console.log(messages);

  return (
    <div className="app">
          {!user ? 
          <Login /> :(
            <div className="app_body">

            <Sidebar messages={messages} />
  
            <Chat messages={messages} />
          </div>
          )}
    </div>
  );
}

export default App;
