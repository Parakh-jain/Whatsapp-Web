import React, { useEffect, useState } from "react";
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Sidebar from "./Sidebar";
import Chat from "./Chat";
import Pusher from "pusher-js";
import axios from "./axios";
import Login from "./Login";
import { useStateValue } from './StateProvider'
import Welcome from './Welcome';

const App=()=> {

  const [{ user }, dispatch] = useStateValue();
  const [messages, setMessages] = useState([]);

  /*Fetch Messages*/
  useEffect(() => {
    axios.get('/messages/sync').then(res => {
      setMessages(res.data);
    })
  }, []);
 
  /*Run Pusher script once, when message component loads.*/
  /*Gets new message in real-time*/
  useEffect(() => {
    const pusher = new Pusher(process.env.REACT_APP_PUSHER_HTML, {
      cluster: 'ap2'
    });

    const channel = pusher.subscribe('messages');
    channel.bind('inserted', (newMessage) => {
      // alert(JSON.stringify(newMessage));
      setMessages([...messages, newMessage]) //spread messages + add newMessage also
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    }
  }, [messages]);   // we are depending on messages i.e why we add messages in [] 

  console.log(window.innerWidth);


  return (
   //BEM naming convention
    <div className="app">
      {!user ? (
        <Login />
      ) : (
        <div className="app_body">
          <Router>

            <Sidebar messages={messages} />
            <Switch>
              <Route path="/rooms/:ROOMID">

                <Chat messages={messages} />
                
              </Route>
              <Route path="/">
                <Welcome />
              </Route>
            </Switch>
          </Router>
        </div>
      )
      }
    </div>
  )
}
export default App;
