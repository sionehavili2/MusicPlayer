import { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

export default function SocketComm() {

  const [clientData, setClientData] = useState();
  const [serverData, setServerData] = useState();


  //Action Listener. updates when server sends new data
  socket.on("dataFromServer", (dataFromServer) => { setServerData(dataFromServer); });

  //Pass data to server
  function sendDataToInterface() { socket.emit("dataToServer", clientData); }

  return (
    <>
      <input
        type="text"
        placeholder="enter Message"
        value={clientData}
        onChange={(e) => setClientData(e.target.value)}
      />
      <button onClick={sendDataToInterface}>Message</button>

      <div className="messageContainer">
        <p>Message Board</p>
        <div>{serverData}</div>
      </div>
    </>
  );
}


