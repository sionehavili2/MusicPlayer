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
import spotifyWebApi from "spotify-web-api-node";
import bodyParser from 'body-parser';


//const SpotifyWebApi = require("spotify-web-api-node")
// spotifyWebApi = import f('spotify-web-api-node');
const app = express();
app.use(express.json());


app.use(
  cors({
    origin: "http://localhost:3000", //telling our server which url/server is gonna be making calls to our socket.io server
    credentials: true,
  })
);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

const PORT = process.env.PORT || 4000;
const SOCKET_PORT = process.env.PORT || 5000;

// DO NOT EDIT ABOVE THIS LINE

// HELPER FUNCTIONS
function saltShaker(length) {
  let salt = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    salt += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return salt;
}

//API SECTION BELOW

//spotify login
app.post("/spotifyLogin", (req, res) =>  {
    const code = req.body.code
    const spotifyApi = new spotifyWebApi({
      redirectUri: "http://localhost:3000",
      clientId: "7307ec35fb414373b246109805e86181",
      clientSecret: "c77fd6253469467cbc345114f398341e",
    })
    spotifyApi.authorizationCodeGrant(code)
    .then(data => {
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      })
    })
    .catch((error) => {
      console.error("Error in /spotifyLogin or /refresh:", error);
      res.sendStatus(400)
    })
})

app.post("/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken,
  })

app.post("/addToQueue", (req, res) => {
  let base_url = "https://api.spotify.com/v1/me/player/queue?uri=spotify";
  const uri = req.body.track_uri;
  let api_url = base_url + uri;
  axios
    .post(api_url, {
      username: username,
    })
    .then((response) => {
      // Handle the response data
      console.log(response)
    })
    .catch((error) => {
      // Handle any errors
      console.error(error);
    });
    res.send(response)
})

  spotifyApi
    .refreshAccessToken()
    .then(data => {
      res.json({
        accessToken: data.body.accessToken,
        expiresIn: data.body.expiresIn,
      })
    })
    .catch(err => {
      console.log(err)
      res.sendStatus(400)
    })
})



// GET REQUESTS
app.get("/salt", (req, res) => res.send(saltShaker(8)));

app.get("/helloworld", (req, res) => {
  console.log("Hello World!");
  res.send("Hello World!");
});

// POST REQUESTS
app.post("/account", async (req, res) => {
  let newUser = {
    username: req.body.username,
    password: req.body.password,
    type: req.body.type,
    salt: req.body.salt,
  };
  let collection = await db.collection("users");
  let result = await collection.insertOne(newUser);
  res.send(result);
});

app.post("/addToQue", (req, res) => {
  console.log("Made it here");

  // Extract trackUri from the request body
  const { trackUri } = req.body;

  // Validate if trackUri is a string and has the correct format (e.g., 'spotify:track:2QTDuJIGKUjR7E2Q6KupIh')
  if (typeof trackUri !== 'string' || !/^spotify:track:[A-Za-z0-9]+$/.test(trackUri)) {
    return res.status(400).send('Invalid trackUri format');
  }

  // Construct the full API call
  const fullAPICall = `https://api.spotify.com/v1/me/player/queue/${trackUri}`;

  console.log("Track Uri:", trackUri);
  console.log("Full API Call:", fullAPICall);

axios.post

});

app.post("/loginWithSalt", async (req, res) => {
  const username = req.body.username;

  let collection = await db.collection("users");
  let results = await collection.find({ username: username });
  console.log(results);
  results.forEach((document) => {
    let tempSalt = document.salt;
    res.send(tempSalt);
  });
});

app.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log(password);
  console.log("Here");
  console.log(password);
  let collection = await db.collection("users");
  let results = await collection.find({ username: username }).toArray();

  results.forEach((document) => {
    let storedUsername = document.username;
    let storedPassword = document.password;
    if (username === storedUsername && password === storedPassword) {
      res.send({ loggedIn: true }).status(200);
    } else {
      res.send({ loggedIn: false }).status(200);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
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

