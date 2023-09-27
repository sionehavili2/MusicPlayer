import { useState } from "react";
import ServerInterface from "../../serverInterface/serverInterface";
import io from "socket.io-client";

//const serverInterface = new ServerInterface();
const serverComm = new ServerInterface();

//socket.on("connect", () => {console.log("client socket has connected to server [socketID : " + socket.id + "]");});

function Messager() 
{
  const [testString, setTestString] = useState();
  const [inputValue, setInputValue] = useState();

  //CATCH ActionListener for when server distributes a message
  //socket.on("sendMessage", (message) => setTestString(message));

  //SEND message to server to handle message distribution
  function handleJoinRoomClick() 
  {
     //socket.emit("add-Message", inputValue);
     serverComm.passDataToAll(inputValue);
  }

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

export default Messager;