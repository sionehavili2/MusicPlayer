import io from "socket.io-client";
import { useEffect, useHook } from "react";

class SocketService {

  constructor() {

    this.socket = io("http://localhost:5000"); // Replace with your server URL
    this.socket.on("connect", () => 
    {
       console.log("client socket has connected to server [socketID : " + this.socket.id + "]");
       this.socket.emit("requestDataFromServer", (dataFromServer) => {console.log("socket server has initialized 'data' variable"); this.data = dataFromServer});
    });
    
  }

  passDataToServer (dataFromClient) {
    console.log("socket service has received data from client: " + dataFromClient);
    
    this.socket.emit("relayToServer", dataFromClient, (dataFromServer) => {
      console.log('interface has received a response ['+ dataFromServer+'] and is now setting Data'); 
      this.data = dataFromServer;
    });
    console.log("interface has attempted to relay data to server: " + dataFromClient);
  }

   async getDataFromServer(){
    console.log("getDataFromServer() is returning data: ");
    console.log(this.data);
    return this.data;
  }
}

export default SocketService;
