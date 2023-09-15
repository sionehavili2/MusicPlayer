import { React, useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

function Rooms() {
  //LOG DATA FROM BACKEND
  socket.on("welcome", (stringMessage) => {
    console.log("Room.jsx received a message: " + stringMessage);
  });

  function handleJoinRoomClick() {
    console.log("Join room has been clicked");
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
      <div>this is being returned from rooms</div>
      <button onClick={handleJoinRoomClick}>Join Room</button>
    </>
  );
}
export default Rooms;
