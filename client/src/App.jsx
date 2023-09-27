import "./App.css";
import Hello from "./components/HelloWorld";
import SocketComm from "./components/SocketComm.jsx";
// import Room from "./components/Rooms/Rooms.jsx";
// import Messager from "./components/Messager/Messager";

function App() {
  return (
    <>
      <h1>At least 4</h1>
      <Hello />
      <SocketComm/>
    </>
  );
}

export default App;
