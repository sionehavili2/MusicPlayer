import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";

// Create a context to manage the WebSocket connection
const SocketContext = createContext();

//Export const for child to use
export const useSocket = () => useContext(SocketContext);

const SocketTalker = ({children}) => 
{
    const [socket, setSocket] = useState(null);

    /* 1. **** CatchALL SEND AND LISTNER ******/
    const catchAllListener = (callback) => 
    { 
        if (socket) 
        {
            socket.on("sendDataToAllClients", (listenName, data) => 
            { 
                console.log("socket received all:" + listenName); callback(listenName, data); 
            });
        }
    };

    const sendDataToCatchAll = (identifier , dataToSend) => 
    { 
        console.log("socket: sendDataToAll: " + identifier);
        if (socket) 
        {
        socket.emit("sendDataToAll",identifier, dataToSend);
        } 
    };


    /* 2. *****  Room SEND AND LISTNER ******/
    const roomDataListener = (callback) =>
    {
        if (socket) 
        {
            socket.on("sendToRoom", (data) => 
            { 
                console.log("socket : sendToRoom: " + data); callback(data); 
            });
        };
    }

    const sendRoomData = (roomNumber, dataToSend, callback) => 
    {
      if(socket)
      {
        socket.emit("sendToRoom",roomNumber, dataToSend, (dataFromRoom) => {console.log("socket: received room data"); callback(dataFromRoom)});
      }
    }

    /* 3. *** AUDIO SEND AND LISTENER *****/
    const listenForAudioCommands = (callback) => 
    {
        if (socket)
        {
            socket.on("newAudioData",(audioData)=>
        {
            callback(audioData);
        });
        }
    }



}

export default SocketTalker;