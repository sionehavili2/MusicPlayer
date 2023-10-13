import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";

// Create a context to manage the WebSocket connection
const SocketContext = createContext();
//Export const for child to use
export const useSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }) => 
{
  const [socket, setSocket] = useState(null);

  /* All RECEIVING Data from server will be returned through this function. Returns listenName identifier and the data with it*/
  const listenForAllData = (callback) => 
  { 
    if (socket) 
    {
      socket.on("sendDataToAllClients", (listenName, data) => 
      { 
        console.log("socket received all:" + listenName); callback(listenName, data); 
      });
    }
  };

  /* All RECEIVING Data from ROOM */
  const listenForRoomData = (callback) =>
  {
    if (socket) 
    {
      socket.on("sendToRoom", (data) => 
      { 
        console.log("socket : sendToRoom: " + data); callback(data); 
      });
    };
  }

  /* All Audio Commands will run through here */
  const listenForAudioCommands = (callback) => 
  {
    if (socket)
    {
      console.log("socket recieved audio command");
      socket.on("audioCommand",(currentTrackPosition, isTrackPlaying)=>
      {
        callback(currentTrackPosition, isTrackPlaying);
      });
    }
  }
  

/* Updates audio track position */
const updateAudioTrackPosition = (roomNumber, trackPosition, timestamp) => 
{
    if(socket)
    {
      console.log("------- Socket: received from rooms: " + roomNumber + " --- " + trackPosition);
      socket.emit("updateTrackPosition", roomNumber, trackPosition, timestamp);
    }
}

  /* All purpose send Data To Server */
  const sendDataToAll = (identifier , dataToSend) => 
  { 
    console.log("socket: sendDataToAll: " + identifier);
    if (socket) 
    {
      socket.emit("sendDataToAll",identifier, dataToSend);
    } 
  };

  /* Creates a room and returns the room index number */
  const createRoom = (callback) => 
  {
    if (socket) 
    {
      //console.log("create room function is running;");
      socket.emit("createRoom", (roomNumber) => { console.log("socket received created room number:" + roomNumber); callback(roomNumber); });
    }
  }

  /* Joins a room, must pass a room number and callback function */
  const joinRoom = (roomNumber, callback) => 
  {
    if (socket) 
    {
      //console.log("room number from socket:" + roomNumber);
      socket.emit("joinRoom", roomNumber, (roomNumber, currentTrackPosition, isTrackPlaying, trackTimeStamp) => 
      { 
        console.log("socket received data for joinRoom callback" + roomNumber + "--" + currentTrackPosition + "--" + isTrackPlaying);
        callback(roomNumber, currentTrackPosition, isTrackPlaying, trackTimeStamp);
      });
    }   
  }

  /* Sends data to all in room */
  const sendToRoom = (roomNumber, dataToSend, callback) => 
  {
    if(socket)
    {
       //console.log("socket : sendToRoom()");
       socket.emit("sendToRoom",roomNumber, dataToSend, (dataFromRoom) => {console.log("socket: received room data"); callback(dataFromRoom)});
    }
  }

  /* Play audio to room */
  const playAudio = (roomNumber, audioTrackPosition) => 
  {
    //console.log("play audio clicked");
    if(socket)
    {
      socket.emit("play", roomNumber, audioTrackPosition);
    }
  }

  /* Play audio to room */
  const pauseAudio = (roomNumber, audioTrackPosition) => 
  {
    //console.log("pause audio clicked");
    if(socket)
    {
      socket.emit("pause", roomNumber, audioTrackPosition);
    }
  }

  useEffect(() => 
  {
    //creates an instance
    const socketInstance = io("http://localhost:5000");
    //Log
    socketInstance.on("connect", () => { console.log("Connected to server");});
    //Set socket (to pass to child)
    setSocket(socketInstance);
    //Unmount socket instance
    return () => {socketInstance.disconnect()};
  }, [] );

  //Wrap Children and pass them call back functions and initial data
  return (<SocketContext.Provider value={{ listenForAllData, listenForRoomData, listenForAudioCommands, updateAudioTrackPosition, sendDataToAll, createRoom, joinRoom, sendToRoom, playAudio, pauseAudio}}>{children}</SocketContext.Provider>);
};

export default SocketProvider;
