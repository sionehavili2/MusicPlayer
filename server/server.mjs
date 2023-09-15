import express, { response } from "express";
import cors from "cors";
import "./loadEnvironment.mjs";
import db from "./db/conn.mjs";
import { Server as socketIOServer } from "socket.io";
import http from "http";

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


//       Sione Havili
//Sockets
const server = http.createServer(app);
const io = new socketIOServer(server, {cors: { origin: "http://localhost:3000", credentials: true },});

io.on('connection', (socket) => 
{
  /*  Log the connection */
  //console.log("User Connected -- SocketID: " + socket.id);
  
  /*  Test Passing a parameter */  //Pass a string value to socket that just connected
  socket.emit("welcome", "you have received the message from the backend");


  /* Test Ping  */
  socket.on("ping", (count) => { console.log(count);});
});

server.listen(SOCKET_PORT, () => {
  console.log(`Socket server is running on port ${SOCKET_PORT}\n`);
});


