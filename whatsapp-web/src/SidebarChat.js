import { Avatar } from "@material-ui/core"
import React, { useEffect, useState } from 'react';
import "./SidebarChat.css";
import { Link } from 'react-router-dom'

const SidebarChat = ({ id, name, image }) => {

    return (
        <Link to={`/rooms/${id}`}>
            <div className="sidebarchat">
                <Avatar src={image} />
                <div className="sidebarchat__info">
                    <h2>{name} </h2>
                </div>
            </div>
        </Link>
    );
}

export default SidebarChat
