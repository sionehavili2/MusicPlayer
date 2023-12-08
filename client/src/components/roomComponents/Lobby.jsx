import { useEffect, useState } from "react";
import classes from "./Lobby.module.css";

const Lobby = (props) => 
{
    let totalRooms = props.incomingLobbyData;

    const roomBtns = [];

    for (let i = 0; i < totalRooms; i++) 
    {
        roomBtns.push(<button className={classes.button} key={i} value={i} onClick={(event) => props.onSendLobbyData(event.target.value)}>{i !== 0 ? "Join Room " + i : "Open Room"}</button>);
    }

    return (
        <div className={classes.mainContainer}>
            <h2>Rooms Lobby</h2>
            <div><button className={classes.createBtn} value="createRoom" onClick={(event)=>{props.onSendLobbyData(event.target.value)}}>Create A Room</button></div>
            <div>{roomBtns}</div>
        </div>
    );
}

export default Lobby;