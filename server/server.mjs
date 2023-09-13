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

const PORT = process.env.PORT || 4000;
const PORT2 = process.env.PORT || 5000;

//Sione Havili
//Sockets
const server = http.createServer(app);
const io = new socketIOServer(server, {cors: { origin: "http://localhost:3000", credentials: true },});

io.on('connection', (socket) => 
{
  console.log("socketId: " + socket.id);
  console.log("io. connection recieved");

  socket.emit("welcome", socket.id);
});

server.listen(PORT2, () => {
  console.log(`WebSocket server is running on port ${PORT2}`);
});


//GET Requests
app.get("/", (req, res) => res.send("Hello, World!"));
app.get("/helloworld", (req,res) => {
  console.log("Hello World!");
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});



