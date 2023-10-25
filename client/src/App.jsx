import "./App.css";
import Hello from "./components/HelloWorld";
import SocketProvider from "./components/SocketProvider";
import Rooms from "./components/Rooms";

function App() {
  return (
    <>
      <h1>At least 4</h1>
      <SocketProvider>
        <Rooms/>
      </SocketProvider>
    </>
  );
}

export default App;

// import "./App.css";
// import Hello from "./components/HelloWorld";
// import SocketProvider from "./components/SocketProvider";
// import Rooms from "./components/Rooms";
// import { useState } from "react";
// import Sender from "./components/Sender.jsx"

// function App() {

//   const[userState, updateUserState] = useState(null);
//  // const audioElement = document.getElementById('audioPlayer');

//   function display()
//   {
//     const defaultDisplay = 
//     <>
//       <h1>At least 4</h1>
//       <button onClick={()=>updateUserState("Streamer")}>Stream Music</button>
//       <button onClick={()=>updateUserState("StreamListener")}>Listen to Stream</button>
//     </>

//     const displayAudioPlayer = 
//     <>
//       <Sender/>
//     </>

//     const displayStreamListener = <div>You are a listener...</div>;

//     if(!userState) return defaultDisplay;
//     else if (userState == "Streamer") return displayAudioPlayer;
//     else if (userState == "StreamListener") return displayStreamListener;
//     else console.error("HANDLED ERROR: App.jsx does not know what to display. please check code");
//   }

//   return (
//     <>
//       <h1>At least 4</h1>
//       <audio id="audioPlayer" controls autoplay></audio>
//       {/* <SocketProvider>
//         <Rooms/>
//       </SocketProvider> */}
      
//     </>
//   );
//   return display();
// }

// export default App;
