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
