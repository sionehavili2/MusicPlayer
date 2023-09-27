import { Component } from "react";
import io from "socket.io-client";

class ServerInterface extends Component {
  constructor(props) {
    super(props);
    this.message = "you have received a constructor message";
    this.socket = io("http://localhost:5000");
    this.socket.on("connect", () => {
      console.log("socket.io connected [socketID : " + this.socket.id + "]");
    });
  }

  /* Disconnects socket from server */
  disconnect() {
    this.socket.disconnect();
  }

  /* Takes data and passes it to all */
  passDataToAll(data) {
    console.log("Data has been passed successfully:");
    console.log(data);
  }
}

export default ServerInterface;
