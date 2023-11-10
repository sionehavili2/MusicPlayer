import NavigationBar from "../components/Navigation";
import SocketProvider from "../components/SocketProvider";
import Rooms from "./Rooms";

function RoomPage() {
  return (
    <div>
      <NavigationBar />
      <SocketProvider>
        <Rooms />
      </SocketProvider>
    </div>
  );
}

export default RoomPage;
