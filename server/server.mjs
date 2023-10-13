import express, { response } from "express";
import cors from "cors";
import "./loadEnvironment.mjs";
import db from "./db/conn.mjs";
import spotifyWebApi from "spotify-web-api-node";
import bodyParser from 'body-parser';


//const SpotifyWebApi = require("spotify-web-api-node")
// spotifyWebApi = import f('spotify-web-api-node');
const app = express();
app.use(express.json());



app.use(
  cors({
    origin: "http://localhost:3000", //telling our server which url/server is gonna be makiing calls to our socket.io server
    credentials: true,
  })
);

const PORT = process.env.PORT || 4000;
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
app.get("/", (req, res) => res.send("Hello, World!"));
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
