import { useEffect, useState } from "react";

const Lobby = (props) => 
{
    let totalRooms = props.incomingLobbyData;

    const roomBtns = [];

    for (let i = 0; i < totalRooms; i++) 
    {
        roomBtns.push(<button key={i} value={i} onClick={(event) => props.onSendLobbyData(event.target.value)}>{i !== 0 ? "Join Room " + i : "Open Room"}</button>);
    }

    return (
        <>
            <h2>Lobby</h2>
            <button value="createRoom" onClick={(event)=>{props.onSendLobbyData(event.target.value)}}>Create A Room</button>
            <div>{roomBtns}</div>
        </>
    );
}

export default Lobby;