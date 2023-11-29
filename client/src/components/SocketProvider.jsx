import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";

const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);

const SocketProvider = ({children}) => 
{
  const [socket, setSocket] = useState(null);

  const onLobbyData = (initCB) => {if (socket) {socket.on("lobbyData", (dataFromServer) => {initCB(dataFromServer)})}}

  const onAudioRoomData = (audioCb) => {if(socket){socket.on("audioCommand", (commandFromServer)=>{audioCb(commandFromServer)})}}

  const onRecieveAll = (recieveCB) => {if(socket){socket.on("receiveAll", (identifier, data) => {recieveCB(identifier, data)})}}

  const onRoomControlData = (hostCB) => {if(socket){socket.on("newRoomControls", (newControlData) => {hostCB(newControlData)})}}

  const sendIt = (identifier, arg, cb) => 
  {
    if (socket)
    {
      if(identifier === "createRoom") socket.emit(identifier, (receivedData) =>{arg(receivedData)})
      else if (identifier === "joinRoom") socket.emit(identifier, arg, (receivedData) =>{cb(receivedData)})
      else if(identifier === "startStopAudio") socket.emit(identifier, arg);
      else if(identifier === "sendRoomControls") socket.emit(identifier, arg);
      else if (identifier === "beHost") socket.emit(identifier,arg);
      // else if (identifier === "roomControls") socket.emit(identifier, arg);
      // else if (identifier === "newHostControls") socket.emit(identifier,arg);
      // else socket.emit("sendAll",identifier,arg);
    }
  }

  useEffect(() => 
  {
    const socketInstance = io("http://localhost:5000");
    socketInstance.on("connect", () => { console.log("socket is connected to server");});
    setSocket(socketInstance);
    return () => {socketInstance.disconnect()};
  }, [] );

  return (<SocketContext.Provider value={{onLobbyData, onAudioRoomData, onRecieveAll, onRoomControlData, sendIt}}>{children}</SocketContext.Provider>);

  // const initialRoomCount = (clientCB) => 
  // {
  //   if (socket) { socket.on("roomCount", (roomCount) => {clientCB(roomCount)})}
  // }

  // /* All RECEIVING Data from server will be returned through this function. Returns listenName identifier and the data with it*/
  // const listenForAllData = (callback) => 
  // { 
  //   if (socket) 
  //   {
  //     socket.on("sendDataToAllClients", (listenName, data) => 
  //     { 
  //       console.log("socket received all:" + listenName); callback(listenName, data); 
  //     });
  //   }
  // };

  // /* All RECEIVING Data from ROOM */
  // const listenForRoomData = (callback) =>
  // {
  //   if (socket) 
  //   {
  //     socket.on("sendToRoom", (data) => 
  //     { 
  //       console.log("socket : sendToRoom: " + data); callback(data); 
  //     });
  //   };
  // }

  // /* Sends data to all in room */
  //   const sendToRoom = (roomNumber, dataToSend, callback) => 
  //   {
  //     if(socket)
  //     {
  //       //console.log("socket : sendToRoom()");
  //       socket.emit("sendToRoom",roomNumber, dataToSend, (dataFromRoom) => {console.log("socket: received room data"); callback(dataFromRoom)});
  //     }
  //   }

  // /* All purpose send Data To Server */
  // const sendDataToAll = (identifier , dataToSend) => 
  // { 
  //   console.log("socket: sendDataToAll: " + identifier);
  //   if (socket) 
  //   {
  //     socket.emit("sendDataToAll",identifier, dataToSend);
  //   } 
  // };


  // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // /* All Audio Commands will run through here */
  // const listenForAudioCommands = (callback) => 
  // {
  //   if (socket)
  //   {
  //     socket.on("newAudioData",(audioData)=>
  //     {
  //       callback(audioData);
  //     });
  //   }
  // }
  
  // /* Updates audio track position */
  // const updateAudioTrackPosition = (roomNumber, trackPosition, timestamp) => 
  // {
  //     if(socket)
  //     {
  //       //console.log("------- Socket: received from rooms: " + roomNumber + " --- " + trackPosition);
  //       socket.emit("updateTrackPosition", roomNumber, trackPosition, timestamp);
  //     }
  // }

  // /* Creates a room and returns the room index number */
  // const createRoom = (callback) => 
  // {
  //   if (socket) 
  //   {
  //     socket.emit("createRoom", (roomNumber) => { callback(roomNumber); });
  //   }
  // }

  // /* Joins a room, must pass a room number and callback function */
  // const joinRoom = (roomNumber, clientCallBack) => 
  // {
  //   if (socket) { socket.emit("joinRoom", roomNumber, clientCallBack) }   
  // }
  // /* Joins a room, must pass a room number and callback function */
  // const leaveRoom = (roomNumber,) => 
  // {
  //   if (socket) { socket.emit("leaveRoom", roomNumber)}   
  // }

  // /*   */
  // const initialRoomCount = (clientCB) => 
  // {
  //   if (socket) { socket.on("roomCount", (roomCount) => {clientCB(roomCount)})}
  // }

  // const startStopAudio = (audioData) => 
  // {
  //   if (socket) socket.emit("startStopAudio", audioData);
  // }

  // const listenForJoinRoomRequest = (thisCallBack) => 
  // { 
  //   if (socket) socket.on("ServerPauseRequest", ()=>{thisCallBack()});
  // }

  // const acceptJoinRoomRequest = (newUserData) => { if (socket) socket.emit("updateAllUsers", newUserData);}

  // useEffect(() => 
  // {
  //   //creates an instance
  //   const socketInstance = io("http://localhost:5000");
  //   //Log
  //   socketInstance.on("connect", () => { console.log("Connected to server");});
  //   //Set socket (to pass to child)
  //   setSocket(socketInstance);
  //   //Unmount socket instance
  //   return () => {socketInstance.disconnect()};
  // }, [] );

  // return (<SocketContext.Provider value={{initialRoomCount, listenForAllData, listenForRoomData, listenForAudioCommands,listenForJoinRoomRequest,acceptJoinRoomRequest, updateAudioTrackPosition, sendDataToAll, createRoom, joinRoom, sendToRoom, startStopAudio}}>{children}</SocketContext.Provider>);
};

export default SocketProvider;
