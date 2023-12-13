import React, { useState, useEffect } from "react";
import { useSocket } from "../components/SocketProvider.jsx";
import Lobby from "../components/roomComponents/Lobby.jsx";
// <<<<<<< HEAD
// import NewsApi from "./NewsApi.jsx";
// import AudioRoom from '../components/roomComponents/AudioRoom.jsx';
// import MusicList from '../components/roomComponents/MusicList.jsx';
// import RoomControl from '../components/roomComponents/RoomControls.jsx';
// import axios from 'axios';
// =======
import AudioRoom from "../components/roomComponents/AudioRoom.jsx";
import classes from "./Rooms.module.css";
// >>>>>>> b4a2fd0ea3d6f389498f77604604cd8bb0e7f980

function Rooms() {
  const {
    onLobbyData,
    onAudioRoomData,
    onRecieveAll,
    onRoomControlData,
    sendIt,
  } = useSocket();

  const [userID, setUserID] = useState(null);
  const [roomState, setRoomState] = useState(0);
  const [roomNumber, setRoomNumber] = useState(null);
  const [lobbyData, setLobbyData] = useState(null);
  const [audioRoomData, setAudioRoomData] = useState(null);
  const [roomControls, setRoomControls] = useState(null);
  const [hasUserVoted, setHasUserVoted] = useState(false);

  //1. This will received lobby data that will populate open screen.
  useEffect(() => {
    if (roomState === 0)
      onLobbyData((incomingLobbyData) => {
        setLobbyData(incomingLobbyData);
      });
  }, [onLobbyData]);
  //2. if you are in a room, you can receive audio commands
  useEffect(() => {
    if (roomState === 1) {
      onAudioRoomData((newAudioData) => {
        if (newAudioData[0] === roomNumber) {
          setAudioRoomData((currData) => ({ ...currData, ...newAudioData[1] }));
          if (newAudioData[2]) {
            setRoomControls(newAudioData[2]);
          }
          if (
            newAudioData[1].trackPosition === 0 &&
            newAudioData[1].isTrackPlaying
          ) {
            setHasUserVoted(false);
          }
        }
      });
    }
  }, [roomState]);
  //4 If In Room, you can receive host controls
  useEffect(() => {
    if (roomState === 1) {
      onRoomControlData((newControls) => {
        if (newControls[0] === roomNumber) {
          setRoomControls(newControls[1]);
        }
      });
    }
  }, [roomState]);

  const handleUpdateAudio = (audioRoomResponse) => {
    if (audioRoomResponse[0] === "skipVote") {
      setHasUserVoted(true);
    }

    //If you received new room controls
    if (audioRoomResponse[0] === "roomControls") {
      let newTrackPosition = audioRoomResponse[1];
      let newHostCommands = audioRoomResponse[2];
      sendIt("startStopAudio", [
        roomNumber,
        audioRoomResponse[0],
        newTrackPosition,
        new Date().getTime() + 5000,
        newHostCommands,
      ]);
    } else {
      sendIt("startStopAudio", [
        roomNumber,
        audioRoomResponse[0],
        audioRoomResponse[1],
        new Date().getTime() + 5000,
      ]);
    }
  };

  const displayRoomState = () => {
    //2. If we have lobby data display Lobby
// <<<<<<< HEAD
//     if(roomState === 0 && lobbyData)
//     {
//       const handleSendLobbyData = (value)=>
//       {
//         if(value === "createRoom") sendIt("createRoom", (returnedRoomData)=>
//         {
//           console.log("create room..."); 
//           console.log(returnedRoomData); 
//           setUserID(returnedRoomData[0]);
//           setRoomNumber(returnedRoomData[1]); 
//           setAudioRoomData(returnedRoomData[2]);  
//           setRoomControls(returnedRoomData[3]); 
//           setRoomState(1);
//           axios.post("http://localhost:4000/newPost");
//         }) 
//         else sendIt("joinRoom",parseInt(value),(returnedJoinRoomData)=>{console.log("join room..."); setUserID(returnedJoinRoomData[0]);setRoomNumber(returnedJoinRoomData[1]); setAudioRoomData(returnedJoinRoomData[2]);  setRoomControls(returnedJoinRoomData[3]); setRoomState(1);})
//       }      
//       return (<>
//         <div>Room Number: {roomNumber}</div>
//         <Lobby incomingLobbyData={lobbyData} onSendLobbyData={handleSendLobbyData}/>
//       </>);
// =======
    if (roomState === 0 && lobbyData) {
      const handleSendLobbyData = (value) => {
        if (value === "createRoom")
          sendIt("createRoom", (returnedRoomData) => {
            setUserID(returnedRoomData[0]);
            setRoomNumber(returnedRoomData[1]);
            setAudioRoomData(returnedRoomData[2]);
            setRoomControls(returnedRoomData[3]);
            setRoomState(1);
          });
        else
          sendIt("joinRoom", parseInt(value), (returnedJoinRoomData) => {
            setUserID(returnedJoinRoomData[0]);
            setRoomNumber(returnedJoinRoomData[1]);
            setAudioRoomData(returnedJoinRoomData[2]);
            setRoomControls(returnedJoinRoomData[3]);
            setRoomState(1);
          });
      };
      return (
        <div className={classes.roomContainer}>
          <Lobby
            incomingLobbyData={lobbyData}
            onSendLobbyData={handleSendLobbyData}
          />
        </div>
      );
// >>>>>>> b4a2fd0ea3d6f389498f77604604cd8bb0e7f980
    }
    //3. If You have audio room, display Audio Room
    else if (roomState === 1 && audioRoomData) {
      const handleLeaveRoom = () => {
        setAudioRoomData(null);
        setRoomControls(null);
        setRoomNumber(null);
        setRoomState(0);
      };
      const AudioRoomMemo = React.memo(AudioRoom);
      return (
        <>
          {/* <>{audioRoomData && !audioRoomData.host && <><h3>NO HOST</h3><button onClick={()=>{sendIt("beHost",roomNumber)}}>Be Host</button></>}</> */}
          <AudioRoomMemo
            {...audioRoomData}
            onBeHost={() => {
              sendIt("beHost", roomNumber);
            }}
            isHost={audioRoomData.host === userID}
            roomControls={roomControls}
            roomNumber={roomNumber}
            isVoteAvailable={hasUserVoted}
            onUpdateAudioData={handleUpdateAudio}
            onLeaveRoom={handleLeaveRoom}
          />
        </>
      );
    }
    //1. If We dont have lobby data display loading
    else return <div>Loading....</div>;
  };
  return displayRoomState();
}

export default Rooms;
