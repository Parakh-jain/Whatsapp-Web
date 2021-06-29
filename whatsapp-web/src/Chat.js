import { AttachFile, MoreVert, SearchOutlined } from "@material-ui/icons";
import { Avatar, IconButton } from '@material-ui/core';
import React, { useState, useEffect } from 'react'
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import SendIcon from '@material-ui/icons/Send';
import "./Chat.css";
import { useParams } from 'react-router-dom'
import axios from "./axios";
import { useStateValue } from "./StateProvider";

const Chat = ({ messages }) => {

    const [input, setInput] = useState("");
    const { ROOMID } = useParams();
    const [roomname, setRoomname] = useState("");
    const [{ user }, dispatch] = useStateValue();

    /*Get chat messages by roomId*/
    useEffect(() => {
        axios.get(`/rooms/${ROOMID}`)
            .then(res => {
                setRoomname(res.data);
            })

    }, [ROOMID])

    /*Send a new message request*/
    const sendmessage = async (e) => {   // e is event
        e.preventDefault();     // prevent to refresh by default 
        if (input) {
            await axios.post("/messages/new", {
                roomID: ROOMID,
                message: input,
                name: user.displayName,
                timeStamp: `${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}  ${new Date().getHours()}:${new Date().getMinutes()}`,
                received: false
            });
        }
        setInput(""); // when we hit enter it will clear the message
    }

    /*Keeps chat container scrolled bottom */
    useEffect(() => {
        const chatBody = document.querySelector('.chat__body');
        chatBody.scrollTop = chatBody.scrollHeight;
     });

    return (
        <div className="chat">
            <div className="chat__header">
                <Avatar src={roomname.image} />
                <div className="chat__headerinfo">
                    <h3>{roomname.name}</h3>
                    <p>Last Seen {" "}
                        {messages[messages.length-1]?.timeStamp}</p>
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

            {/*Chat Body */}
            <div className="chat__body">
                {messages.map((message) => {
                    return (
                        <div>
                            {(message.roomID === ROOMID) ? (
                                <h6 className={`chat__message ${message.name === user.displayName && "chat__reciever"}`}>   {/*Two persons can have the same name */}
                                    <p className="chat__name">{message.name}</p>
                                    {message.message}
                                    <span className="chat__timestamp">
                                        {message.timeStamp}
                                    </span>
                                </h6>
                            ) :
                                <h1></h1>
                            }
                        </div>
                    )
                })}
            </div>

            {/*footer */}
            <div className="chat__footer">
                <InsertEmoticonIcon />
                <form>
                    <input
                        placeholder="Type message .."
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)} /> {/*set the input to what user typed latest */}
                    <button
                        onClick={sendmessage}
                        type="submit">
                        <SendIcon />
                    </button>
                </form>
                <MicIcon />
            </div>
        </div>
    )
}

export default Chat;
