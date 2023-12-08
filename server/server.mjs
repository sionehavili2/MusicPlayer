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
import { ObjectId } from "mongodb";


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
app.get("/*", function (req, res){
  res.sendFile(
    path.join(__dirname, "../client/build/index.html"),
    function(err){
      if(err){
        res.status(500).send(err);
      }
    }
  )
})

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

// Posts and likes
const songTemplate = {
  "song_id": 0,
  // in the future, likes will be an array [] of usernames
  "likes": 0,
  "timesStreamed": 0
}

const postTemplate = {
  "timestamp": 0,
  "body": "",
  "likes": 0,
  "author": "",
}

app.post("/newPost", async (req, res) => {
  let tempName  = req.body.message
  console.log(tempName)
  let collection = db.collection("posts");
  const newPost = { ...postTemplate, "timestamp": new Date(), "body": tempName };
  let result = await collection.insertOne(newPost);
  res.send(result).status(204);
});

app.post("/likePost", async (req, res) => {
  let { id } = req.body
  let collection = await db.collection("posts");
  const objectID = new ObjectId(id)
  let result = await collection.updateOne({ _id: objectID}, { $inc: { likes: 1} });
  res.send(result).status(204);
})

app.get("/posts", async (req, res) => {
  let collection = await db.collection("posts");
  // let results = await collection.find({}).toArray();
  // console.log("results" + results);
  let results = await collection.find({}).sort({ timestamp: -1 }).toArray();
  res.send(results).status(200);
})

app.post("/newSongRecord", async (req, res) => {
  const songID = req.body;
  let collection = db.collection("songs");
  let results = collection.find({ song_id: songID });
  if (results > 0) {
    await collection.updateOne({ song_id: songID }, { $inc: { timesStreamed: 1} });
    res.send("Play counter incremented")
  } else {
    const newSong = { ...songTemplate, song_id: songID };
    await collection.insertOne(newSong);
    res.send(results).status(204);
  }
});

// END POST AND LIKES


// Developer : Sione Havili

//Sockets VARIABLES
const server = http.createServer(app);
const io = new socketIOServer(server, {cors: { origin: "http://localhost:3000", credentials: true },});

//Audio Variable
let Rooms = [];
Rooms.push({roomNumber:0, trackPosition:0, trackTimeStamp:0, isTrackPlaying:false, partyCount:0, host:null});

let HostControls = [];
HostControls.push({isHostControl:true, audioOutput:"all"})

//Socket connections
io.on("connection", (socket) => {

  // socket.on("connect", () => { console.log("client socket connected [" + socket.id + "]")});

  /* 1 -- Send Initial Data for Room -- */
  socket.emit("lobbyData", [Rooms.length]);

  /* 2 -- Create a Room -- */
  socket.on("createRoom", (createCB) => 
  {
    let createdRoomNumber = Rooms.length;
    Rooms.push({roomNumber:createdRoomNumber, trackPosition:0, trackTimeStamp:0, isTrackPlaying:false, partyCount:0, host:socket.id});
    HostControls.push({isHostControl:true, audioOutput:"all"});
    createCB([socket.id,createdRoomNumber, Rooms[createdRoomNumber],HostControls[createdRoomNumber]]);
    io.emit("lobbyData", [Rooms.length]);
  });
  
  /* 3. -- Join a Room -- */
  socket.on("joinRoom", (joinRoomIndex, joinCB) => 
  {
    console.log("Joining a room...: " + joinRoomIndex);
    joinCB([socket.id,joinRoomIndex,Rooms[joinRoomIndex],HostControls[joinRoomIndex]]);
  });

  /* 4 -- Play/Pause Audio -- */
  socket.on("startStopAudio",(recentRoomAudio)=>
  {
    let roomIndex = recentRoomAudio[0];
    Rooms[roomIndex].isTrackPlaying = recentRoomAudio[1];
    Rooms[roomIndex].trackPosition = recentRoomAudio[2];
    Rooms[roomIndex].trackTimeStamp = recentRoomAudio[3];

    if(recentRoomAudio.length === 5) 
    {
      HostControls[roomIndex].isHostControl = recentRoomAudio[4].isHostControl;
      HostControls[roomIndex].audioOutput = recentRoomAudio[4].audioOutput;
      io.emit("audioCommand",[roomIndex, Rooms[roomIndex], HostControls[roomIndex]]);
    }
    else
    {
      io.emit("audioCommand", [roomIndex,Rooms[roomIndex]]);
    }
  })

  /* 5 -- Server recieves data and sends to all -- */
  socket.on("sendAll", (identifier, data)=>
  {
    console.log("server received a sendAll...");
    console.log(identifier);
    console.log(data);
    io.emit("receiveAll",identifier, data);
  })
  // useEffect(()=>{if(roomState === 1){onAudioRoomData((newAudioData)=> {if(newAudioData[0] === roomNumber){ console.log("appliying audio room data...."); setAudioRoomData(newAudioData[1]); if(newAudioData[2]){setRoomControls(newAudioData[2])} }})}},[roomState]);

  /* 6 -- On Disconnect -- */
  socket.on("disconnect", ()=>
  {
    let counter = 0;
    Rooms.forEach(room => 
    { 
      if(room.host === socket.id)
      {
        console.log("A Host has disconnected (function is not finished)....");
        console.log(room);
        room.host = null;
        io.emit("audioCommand", [room.roomNumber,Rooms[room.roomNumber]]);
      }
      counter++;
    })
  })

  /* 7 -- Host Control Commands --*/
  socket.on("sendRoomControls", (roomControlData)=> {    
    HostControls[roomControlData[0]].isHostControl = roomControlData[1].isHostControl;
    HostControls[roomControlData[0]].audioOutput = roomControlData[1].audioOutput;

    io.emit("newRoomControls",[roomControlData[0], HostControls[roomControlData[0]]]);
  })

  socket.on("beHost",(newHostRoomNumber)=>
  {
    Rooms[newHostRoomNumber].host = socket.id; 
    io.emit("audioCommand", [newHostRoomNumber,Rooms[newHostRoomNumber]]);
  })


  // // 1. Send to ALL CLIENTS
  // socket.on("sendDataToAll",(listenName, dataFromClient) => 
  // {
  //   io.emit("sendDataToAllClients",listenName,dataFromClient);
  // });

  // // 2. When a user sends data to room
  // socket.on("sendToRoom",(roomIndex, dataSendToAll, callBackFunction) => 
  // {
  //   io.to(roomIndex).emit("sendToRoom",dataSendToAll);
  //   callBackFunction(dataSendToAll);
  // })


  // // 3. When a user creates a room
  // socket.on("createRoom", (callBackFunction)=>
  // {
  //   console.log("create room: " + Rooms.length);
  //   console.log("BEFORE.....");
  //   console.log(Rooms);
  //   Rooms.push({roomNumber: Rooms.length, trackPosition:0, trackTimeStamp:0, isTrackPlaying:false, partyCount:0, host:socket.id});

  //   let roomIndex = Rooms.length - 1;
  //   Rooms[roomIndex].roomNumber = roomIndex;
  //   socket.join(Rooms[roomIndex].roomNumber);
  //   callBackFunction(Rooms[roomIndex].roomNumber);
  //   socket.emit("roomCount", Rooms.length);
  //   console.log("AFTER....");
  //   console.log(Rooms);
  //   // Create a post when a room is created
  // });

  // // 4. When a user requests to joins a room
  // socket.on("joinRoom", (roomIndex, callBackFunction)=>
  // {
  //   console.log("room index to join: " + roomIndex);
  //   if (!Rooms[roomIndex].host) 
  //   {
  //     Rooms[roomIndex].host = socket.id;
  //   }

  //   console.log(Rooms[roomIndex]);
  //   console.log("------")
  //   socket.join(roomIndex);
  //   callBackFunction(Rooms[roomIndex]);
  // });

  // //5. When a user requests to leave a room;
  // socket.on("leaveRoom", (roomIndex) => 
  // {
  //   socket.leave(roomIndex);
  // });

  // // 6. When a user changes the state of the audio playing
  // socket.on("startStopAudio", (audioDataArr)=> 
  // {
  //   // console.log(audioDataArr[0]);
  //   // console.log(audioDataArr[1]);
  //   // console.log(audioDataArr[2]);
  //   // console.log(audioDataArr[3]);
  //   let thisRoomIndex = parseInt(audioDataArr[3]);
  //   console.log("audio command room: " + thisRoomIndex);
  //   Rooms[thisRoomIndex].isTrackPlaying = audioDataArr[0];
  //   Rooms[thisRoomIndex].trackPosition = audioDataArr[1];
  //   Rooms[thisRoomIndex].trackTimeStamp = audioDataArr[2];
  //   console.log("room playing has been changed to:" + Rooms[thisRoomIndex].isTrackPlaying);
  //   io.emit("newAudioData", [Rooms[thisRoomIndex].isTrackPlaying, Rooms[thisRoomIndex].trackPosition, Rooms[thisRoomIndex].trackTimeStamp, thisRoomIndex]);
  // });

  // // 6. After user join is accepted, sync all user audio (in room) 
  // socket.on("updateAllUsers",(audioDataArray) => 
  // {
  //   let currRoomIndex = audioDataArray[0];
  //   if(Rooms[currRoomIndex])
  //   {
  //     //let socketID = audioDataArray[1]; 
  //     Rooms[currRoomIndex].trackPosition = audioDataArray[2];
  //     Rooms[currRoomIndex].isTrackPlaying = audioDataArray[3];
  //     Rooms[currRoomIndex].trackTimeStamp = audioDataArray[4];
  //     io.to(currRoomIndex).emit("newAudioData", Rooms[currRoomIndex]);
  //   }
  //   else console.log("SERVER ERROR: " + "updateAlluser received a room that does not exist");

  //   socket.on("disconnect", (socket) => {socket.disconnect(); console.log("socket DISCONNECTED [" + socket.id + "]");});
  // });

});


//Socket Listener
server.listen(SOCKET_PORT, () => {
  console.log(`Socket server is running on port ${SOCKET_PORT}\n`);
});

