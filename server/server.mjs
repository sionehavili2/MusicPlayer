import express, { response } from "express";
import cors from "cors";
import "./loadEnvironment.mjs";
import db from "./db/conn.mjs";
import { Server as socketIOServer } from "socket.io";
import http from "http";
import { rmSync } from "fs";
import { callbackify } from "util";

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
app.get("/helloworld", (req,res) => {
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
const rooms = [{roomID: 0, roomName: "firstRoom", Roomdescription: "hello this is a description for a room"}];
console.log(rooms);
let RandomTestMessageForClient = "Message1 here:";

//Socket connections
io.on('connection', (socket) => 
{
  /////////// Debugging Functions ////////////////////\

  /*  Log the connection */
  //console.log("User Connected -- SocketID: " + socket.id);

  /*  Test Passing a parameter * //Pass a string value to socket that just connected
  socket.emit("welcome", "you have received the message from the backend");
  
  /* Test Ping  */
  //socket.on("ping", (count) => { console.log(count);});
  
  /////////// End of Debugging Functions /////////////



  //1 .Pass Data to room

  //socket.emit("dataFromServer", rooms, RandomTestMessageForClient);
  
  // socket.on("dataFromClient", (roomsFromClient) => {

  //   // const roomPassed = [...roomsFromClient,];
  //   // console.log("recieved something from client")
  //   // console.log(roomsFromClient);
  // });

  socket.on("getDataFromServer", (callBackFunction) => 
  {
    //Send Current String
    callBackFunction(RandomTestMessageForClient);
    
  });

  socket.on("add-Message", (message) => 
  {
    RandomTestMessageForClient = RandomTestMessageForClient + "\n\n" + message;
    io.emit("setMessage",RandomTestMessageForClient);
  });

});

//Socket Listener
server.listen(SOCKET_PORT, () => {
  console.log(`Socket server is running on port ${SOCKET_PORT}\n`);
});
