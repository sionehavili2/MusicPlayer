import express, { response } from "express";
import cors from "cors";
import "./loadEnvironment.mjs";
import db from "./db/conn.mjs";
import { Server as socketIOServer } from "socket.io";
import http from "http";
import { rmSync } from "fs";
import { callbackify } from "util";
import { createBrotliCompress } from "zlib";
import { Timestamp } from "mongodb";
import { time, timeStamp } from "console";
import { join } from "path";
import  React  from "react";

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000", //telling our server which url/server is gonna be makiing calls to our socket.io server
    credentials: true,
  })
);

const SERVER_PORT = process.env.PORT || 4000;
const SOCKET_PORT = process.env.PORT || 5000;

//GET Requests
app.get("/", (req, res) => res.send("Hello, World!"));
app.get("/helloworld", (req, res) => {
  console.log("Hello World!");
  res.send("Hello World!");
});

app.listen(SERVER_PORT, () => {
  console.log(`Server is running on port: ${SERVER_PORT}`);
});


// Developer : Sione Havili

//Sockets VARIABLES
const server = http.createServer(app);
const io = new socketIOServer(server, {cors: { origin: "http://localhost:3000", credentials: true },});

//Audio Variable
let initialRoomData = {roomNumber: null, trackPosition:0, trackTimeStamp:0, isTrackPlaying:false};
let Rooms = [];
Rooms.push({roomNumber:0, trackPosition:0, trackTimeStamp:0, isTrackPlaying:false, partyCount:0, host:null});

//Socket connections
io.on("connection", (socket) => {

  // socket.on("connect", () => { console.log("client socket connected [" + socket.id + "]")});

  /////////// Debugging Functions ////////////////////\

  /*  Log the connection */
  //console.log("User Connected -- SocketID: " + socket.id);

  /*  Test Passing a parameter * //Pass a string value to socket that just connected
  socket.emit("welcome", "you have received the message from the backend");
  
  /* Test Ping  */
  //socket.on("ping", (count) => { console.log(count);});

  /////////// End of Debugging Functions /////////////


  // 1. Send to ALL CLIENTS
  socket.on("sendDataToAll",(listenName, dataFromClient) => 
  {
    io.emit("sendDataToAllClients",listenName,dataFromClient);
  });

  // 2. When a user sends data to room
  socket.on("sendToRoom",(roomIndex, dataSendToAll, callBackFunction) => 
  {
    io.to(roomIndex).emit("sendToRoom",dataSendToAll);
    callBackFunction(dataSendToAll);
  })


  // 3. When a user creates a room
  socket.on("createRoom", (callBackFunction)=>
  {
    Rooms.push(initialRoomData);
    let roomIndex = Rooms.length - 1;
    Rooms[roomIndex].roomNumber = roomIndex;
    socket.join(roomIndex);
    callBackFunction(roomIndex);
  });

  // 4. When a user requests to joins a room
  socket.on("joinRoom", (roomIndex, callBackFunction)=>
  {


    if (!Rooms[roomIndex].host) 
    {
      Rooms[roomIndex].host = socket.id;
    }

    socket.join(roomIndex);
    callBackFunction(Rooms[roomIndex]);
  });

  //5. When a user requests to leave a room;
  socket.on("leaveRoom", (roomIndex) => 
  {
    socket.leave(roomIndex);
  });

  // 6. When a user changes the state of the audio playing
  socket.on("startStopAudio", (audioDataArr)=> 
  {
    // console.log(audioDataArr[0]);
    // console.log(audioDataArr[1]);
    // console.log(audioDataArr[2]);
    // console.log(audioDataArr[3]);

    let thisRoomIndex = audioDataArr[3];
    Rooms[thisRoomIndex].isTrackPlaying = audioDataArr[0];
    Rooms[thisRoomIndex].trackPosition = audioDataArr[1];
    Rooms[thisRoomIndex].trackTimeStamp = audioDataArr[2];
    console.log("room playing has been changed to:" + Rooms[thisRoomIndex].isTrackPlaying);
    socket.broadcast.emit("newAudioData", [Rooms[thisRoomIndex].isTrackPlaying, Rooms[thisRoomIndex].trackPosition, Rooms[thisRoomIndex].trackTimeStamp]);
  });

  // 6. After user join is accepted, sync all user audio (in room) 
  socket.on("updateAllUsers",(audioDataArray) => 
  {
    let currRoomIndex = audioDataArray[0];
    if(Rooms[currRoomIndex])
    {
      //let socketID = audioDataArray[1]; 
      Rooms[currRoomIndex].trackPosition = audioDataArray[2];
      Rooms[currRoomIndex].isTrackPlaying = audioDataArray[3];
      Rooms[currRoomIndex].trackTimeStamp = audioDataArray[4];
      io.to(currRoomIndex).emit("newAudioData", Rooms[currRoomIndex]);
    }
    else console.log("SERVER ERROR: " + "updateAlluser received a room that does not exist");

    socket.on("disconnect", (socket) => {socket.disconnect(); console.log("socket DISCONNECTED [" + socket.id + "]");});
  });

});


//Socket Listener
server.listen(SOCKET_PORT, () => {
  console.log(`Socket server is running on port ${SOCKET_PORT}\n`);
});

