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

let messageBoxString = "Message1 here. ";
let randomNum = 3;
let roomCount = 2;
let allData = [{roomHost: "Tim", members:["Tim","Mat","Car"]}, {roomHost: "Teddy ",members:["Teddy","Timothy","Car"]}];
//Audio Variable
let absoluteTrackPosition = 0;
let absoluteTrackTimeStamp = 0;
let isTrackPlaying = false;
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
  socket.on("sendDataToAll",(listenName, dataFromClient)=> 
  {
    io.emit("sendDataToAllClients",listenName,dataFromClient);
  });

  // 2. When a user creates a room
  socket.on("createRoom", (callBackFunction)=>
  {
    console.log("server: createRoom");
    roomCount++;
    let newRoomIndex = roomCount - 1; 
    socket.join(newRoomIndex);
    callBackFunction(newRoomIndex);
  });

  // 3. When a user joins a room
  socket.on("joinRoom", (roomIndex, callBackFunction)=>
  {
    console.log("server: joinRoom[" + roomIndex + "]");
    console.log("absolute track position:" + absoluteTrackPosition);
    console.log("isTrackPlaying: " + isTrackPlaying);
    socket.join(roomIndex);
    callBackFunction(roomIndex, absoluteTrackPosition, isTrackPlaying, absoluteTrackTimeStamp);
  });

  // 4. When a user sends data to room
  socket.on("sendToRoom",(roomIndex, dataSendToAll, callBackFunction) => 
  {
    io.to(roomIndex).emit("sendToRoom",dataSendToAll);
    callBackFunction(dataSendToAll);
  })

  //5. When a user plays a song to room
  socket.on("play", (roomIndex, incomingTrackPosition)=> 
  {
    console.log("server recieved play command");
    absoluteTrackPosition = incomingTrackPosition;
    isTrackPlaying = true;
    io.to(roomIndex).emit("audioCommand",absoluteTrackPosition, isTrackPlaying);
  });

  //6. When a user pauses a song to room
  socket.on("pause", (roomIndex, incomingTrackPosition)=> 
  {
    console.log("server received PAUSE command");
    absoluteTrackPosition = incomingTrackPosition;
    isTrackPlaying = false;
    io.to(roomIndex).emit("audioCommand", absoluteTrackPosition, isTrackPlaying);
  });

  //7. Get current track position in song
  socket.on("updateTrackPosition", (roomIndex, immediateTrackPosition, timeOfStamp)=> 
  {
    console.log("SERVER RECEIVED UPDATE");
    console.log(roomIndex);
    console.log(immediateTrackPosition);
    console.log(timeOfStamp);

    absoluteTrackPosition = immediateTrackPosition;
    absoluteTrackTimeStamp = timeOfStamp;
    
    console.log("new absolute track position: " + absoluteTrackPosition);
    
    //io.to(roomIndex).emit("updatedTrackPosition",currentTrackPosition);
  });

});

io.on("disconnect", (socket) => {socket.disconnect(); console.log("socket DISCONNECTED [" + socket.id + "]");});

//Socket Listener
server.listen(SOCKET_PORT, () => {
  console.log(`Socket server is running on port ${SOCKET_PORT}\n`);
});

