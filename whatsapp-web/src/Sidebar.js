import React from 'react'
import "./Sidebar.css";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import { Avatar, IconButton } from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchOutLined from "@material-ui/icons/Search";
import SidebarChat from "./SidebarChat";
import { useStateValue } from './StateProvider'
import Pusher from 'pusher-js'
import axios from "./axios"
import { useState, useEffect } from 'react';

const Sidebar = (props) => {
    const [rooms, setRooms] = useState([]);
    const [{ user }, dispatch] = useStateValue();
    const [search, setSearch] = React.useState("");

    const filterRooms = rooms.filter((room) => {
        return room.name.toLowerCase().includes(search.toLowerCase());
    });

    useEffect(() => {
        axios.get('/rooms/sync')
            .then(res => {
                setRooms(res.data);
            })
    }, [])

    useEffect(() => {
        const pusher2 = new Pusher(process.env.REACT_APP_PUSHER_HTML, {
            cluster: 'ap2'
        });
        const channel2 = pusher2.subscribe('rooms');

        channel2.bind('inserted', (newRoom) => {
            setRooms([...rooms, newRoom])
        });

        return () => {
            channel2.unbind_all();
            channel2.unsubscribe();
        };
    }, [rooms]);

    const [seed, setSeed] = useState("");

    useEffect(() => {
        setSeed(Math.floor(Math.random() * 5000))
    }, [])


    const createRoom = async (e) => {
        e.preventDefault();
        const roomName = prompt("Please enter Room name : ");
        if (roomName) {
            await axios.post("/rooms/new", {
                name: roomName,
                image: `https://avatars.dicebear.com/4.5/api/male/${seed}.svg`
            });
        }

        window.location.reload(true);
    }

    

    return (
        <div className="sidebar">
            <div className="sidebar_header">
                <Avatar src={user?.photoURL} className="profilepic" />
                <div className="sidebar__headerRight">

                    <IconButton>
                        <DonutLargeIcon />
                    </IconButton>

                    <IconButton>
                        <ChatIcon />
                    </IconButton>

                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </div>

            </div>
            <div className="sidebar__search">
                <div className="sidebar__searchcontainer">
                    <SearchOutLined />
                    <input placeholder="Search or Start New Chat" type="text" onChange={e => setSearch(e.target.value)}></input>
                </div>
            </div>
            <div onClick={createRoom} className="sidebar__button">
                <h2>Add New Chat</h2>
            </div>
            <div className="sidebar__chats">
                {filterRooms.map((room) => {
                    return <SidebarChat key={room._id} id={room._id} name={room.name} image={room.image}  />
                })}            
            </div>
        </div>
    )
}

export default Sidebar
