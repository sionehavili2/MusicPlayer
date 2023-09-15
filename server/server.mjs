import express, { response } from "express";
import cors from "cors";
import "./loadEnvironment.mjs";
import db from "./db/conn.mjs";

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
