import express, { response } from "express";
import cors from "cors";
import "./loadEnvironment.mjs";
import db from "./db/conn.mjs";

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000", //telling our server which url/server is gonna be making calls to our socket.io server
    credentials: true,
  })
);

const PORT = process.env.PORT || 4000;
// DO NOT EDIT ABOVE THIS LINE

// DATA STRUCTS
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

// TODO: Move these after they are written
app.post("/newPost", async (req, res) => {
  let collection = await db.collection("posts");
  const newPost = { ...postTemplate, "timestamp": new Date(), "body": req.body.body };
  let result = await collection.insertOne(newPost);
  res.send(result).status(204);
});

app.get("/posts", async (req, res) => {
  let collection = await db.collection("posts");
  let results = await collection.find({}).toArray();
  // let results = await collection.find({}).sort({ timestamp: 1 }).toArray();
  res.send(results).status(200);
})

app.post("/newSongRecord", async (req, res) => {
  const songID = req.body.song_id;
  let collection = await db.collection("songs");
  let results = await collection.find({ song_id: songID });
  if (await results.count() > 0) {
    await collection.updateOne({ song_id: songID }, { $inc: { timesStreamed: 1} });
    res.send("Play counter incremented")
  } else {
    const newSong = { ...songTemplate, song_id: songID };
    await collection.insertOne(newSong);
    res.send(result).status(204);
  }
});


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
