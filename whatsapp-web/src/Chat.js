import { AttachFile, MoreVert, SearchOutlined } from "@material-ui/icons";
import { Avatar, IconButton } from '@material-ui/core';
import React, { useState, useEffect } from 'react'
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import "./Chat.css";
import axios from "./axios";
import {useStateValue} from "./StateProvider";
function Chat({ messages }) {

    const [seed, setSeed] = useState("");
    const [{user},dispatch]=useStateValue();
    const [input, setInput] = useState("");

    useEffect(() => {
        setSeed(Math.floor(Math.random() * 5000))
    }, [])


    const sendmessage = async (e) => {
        e.preventDefault();

        await axios.post("/messages/new", {
            message: input,
            name: user.displayName,
            timestamp: "Just For Now",
            received: true
        })
        setInput("");
    };

    return (
        <div className="chat">
            <div className="chat__header">
                <Avatar src={`https://avatars.dicebear.com/api/human/b${seed}.svg`} />
                <div className="chat__headerinfo">
                    <h3>Dev Room</h3>
                    <p>Last Seen {" "}
                        {messages[messages.length-1]?.timestamp}
                    </p>
                </div>
                <div className="chat__headerright">
                    <IconButton>
                        <SearchOutlined />
                    </IconButton>

                    <IconButton>
                        <AttachFile />
                    </IconButton>

                    <IconButton>
                        <MoreVert />
                    </IconButton>
                </div>
            </div>
            <div className="chat__body">
                {messages.map((message) => (
                    <p className={`chat__message ${message.name === user.displayName && "chat__reciever"}`} >
                        <span className="chat__name">{message.name}</span>
                        {message.message}
                        <span className="chat__timestamp">{message.timestamp} </span>
                    </p>
                ))}
            </div>
            <div className="chat__footer">
                <InsertEmoticonIcon />
                <form>
                    <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a Message" type="text">
                    </input>
                    <button onClick={sendmessage} type="submit" >
                        Send a Message
                        </button>
                </form>
                <MicIcon />
            </div>
        </div>
    )
}

export default Chat
