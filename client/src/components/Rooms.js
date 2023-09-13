import io from "socket.io-client";

const socket = io("http://localhost:3000");

function Rooms()
{
    socket.on("welcome", () =>{
        console.log("we are receiving it");
    });

    socket.emit("game-started", roomIndex);
    console.log("Rooms is here");
}
export default Rooms;
