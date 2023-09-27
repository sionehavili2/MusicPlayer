import { React, useState, useEffect } from "react";
import io from "socket.io-client";
import "./Rooms.css";

const socket = io("http://localhost:5000");

function Rooms() {
  //Variables
  const [allData,setAllData] = useState([]);
  const [rooms, setRooms] = useState([]);

  // !! TEST !! Variables
  const [testString, setTestString] = useState();
  const [inputValue, setInputValue] = useState();

  /* ---- SOCKET FUNCTIONS ---- */

  //When a user (webpage) connects to socket
  socket.on("connect", () => {
    //Log connection for web page
    console.log("client socket has connected to server [socketID : " + socket.id + "]");
    //Request "getDataFromServer" Event, handle information when you get it back
    //socket.emit("getDataFromServer", (testString) => {setTestString(testString)});
    socket.emit("getInitialDataFromServer", (receivedInitialDataFromServer) => 
    {
      console.log("received: getInitialDataFromServer");
      setAllData([...receivedInitialDataFromServer]);
      console.log(...receivedInitialDataFromServer);
    });
  });

  //Updates message
  socket.on("sendMessage", (message) => setTestString(message));

  // //Grab Initial Data from server
  // socket.on("dataFromServer", (roomsFromServer, testStringFromServer) => {
  //   console.log(
  //     "client socket event: dataFromServer has received a testStringFromServer: " +
  //       testStringFromServer
  //   );

  //   //Set the Current Rooms Available
  //   setRooms([...roomsFromServer]);
  //   //Set the Test String from Server
  //   setTestString(testStringFromServer);
  // });

  //Handles when Join Room button is pressed
  function handleJoinRoomClick() {
    //Pass users the new string
    socket.emit("add-Message", inputValue);
  }

  /*
   *    VOLATILE EMITS : volatile emits will only emit if there is a connection fromt client to server.
   *                     If you restart web page, youll notice the ping reconnects and the ping skips
   *                     to the current ping count (instead of where you left off)
   *
   *      Good for :
   *        - Video Games
   *        - Syncing (video games or music etc)
   *
   */
  //UNCOMMENT TO TRACK PING (Volatile Emit Example)
  // let count = 0;
  // setInterval(() => { socket.volatile.emit("ping", ++count);}, 1000);

  return (
    <>
      <input
        type="text"
        placeholder="enter Message"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button onClick={handleJoinRoomClick}>Message</button>

      <div className="messageContainer">
        <p>Message Board</p>
        <div>{testString}</div>
      </div>
    </>
  );
}
export default Rooms;
