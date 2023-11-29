import NavigationBar from "../components/Navigation";
import Hello from "../components/HelloWorld";
import SocketProvider from "../components/SocketProvider";
import Rooms from "./Rooms";

function HomePage() {
  return (
    <div>
        <NavigationBar />
      <h1>At least 4</h1>
      <Hello />
      <SocketProvider>
        <Rooms />
      </SocketProvider>
    </div>
  );
}

export default HomePage;
