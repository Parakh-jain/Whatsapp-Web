import React from 'react'
import "./Sidebar.css";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import {Avatar, IconButton} from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchOutLined  from "@material-ui/icons/Search";
import SidebarChat from "./SidebarChat";
import {useStateValue} from './StateProvider'

const Sidebar=({messages})=>{
    const [{user},dispatch]= useStateValue();
    return (
        <div className="sidebar">
            <div className="sidebar_header">
                <Avatar src={user?.photoURL}/>
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
                    <input placeholder="Search or Start New Chat" type="text"></input>
                </div>
            </div>
            <div className="sidebar__chats">
                <SidebarChat messages={messages} />
            </div>
        </div>
    )
}

export default Sidebar
