
import React, {useState, useEffect } from 'react';
import { useSocket } from '../components/SocketProvider.jsx'; 
import Lobby from "../components/roomComponents/Lobby.jsx";
import NewsApi from "./NewsApi.jsx";
import AudioRoom from '../components/roomComponents/AudioRoom.jsx';

function Rooms() 
{
  const { onLobbyData,onAudioCommand, onRecieveAll, sendIt} = useSocket();
  
  const [lobbyData, setLobbyData] = useState(null);
  const [audioRoomData, setAudioRoomData] = useState(null);
  const [incomingAudioData, setIncomingAudioData] = useState(null);
  const [newsApiData, setNewsApiData] = useState({"_id":{"$oid":"6528ad0a89029d75c06d3f63"},"timestamp":{"$numberInt":"2"},"body":"hello","likes":{"$numberLong":"3"},"author":"bob"});

  //1. get initial/updated lobby data && audioCommands
  useEffect(()=> 
  {
    onRecieveAll((identifier, data)=>
    {
      console.log("received all command....."); 
      console.log(identifier); 
      console.log(data);

      switch (identifier) 
      {
        case "newsApi" : console.log("recived news api data..."); console.log(data); setNewsApiData(data); break;
        default: console.log("onRecieveAll() failed to match identifier:" + identifier);
      }
    });
    onLobbyData((incomingLobbyData)=>{setLobbyData(incomingLobbyData)});
    onAudioCommand((incomingAudioCommand) => {setIncomingAudioData(incomingAudioCommand)});
  },[lobbyData, onAudioCommand]);

  //2. When you get a new incoming audio command, check and see if you belong to the room before applying data
  useEffect(()=>{if(audioRoomData && incomingAudioData){if(audioRoomData.roomNumber === incomingAudioData.roomNumber) setAudioRoomData(incomingAudioData)}},[incomingAudioData]);

  //FINAL Decide what to display
  const setDisplay = () => 
  {
    //A. If you have Room data, display room info
    if(audioRoomData)
    {
      const updateAudioHandler = (newTrackPosition)=> {sendIt("startStopAudio", [audioRoomData.roomNumber, !audioRoomData.isTrackPlaying, newTrackPosition, new Date().getTime() + 5000]);} //5000 = 5 miliseconds
      const leaveRoomHandler = () =>{setAudioRoomData(null); setIncomingAudioData(null);}
      const handleNewsApiData = () => {sendIt("newsApi", {"_id":{"$oid":"6528ad0a89029d75c06d3f63"},"timestamp":{"$numberInt":"2"},"body":"hello","likes":{"$numberLong":"33343333"},"author":"bob"});}

      return (
        <>
          <AudioRoom {...audioRoomData} onUpdateAudioData={updateAudioHandler} onLeaveRoom={leaveRoomHandler}/>
          <NewsApi onSendNewsApiData={handleNewsApiData} apiFetchData={newsApiData}/>
        </>
      );
    }
    //B. Else if you have lobby Data, display lobbyf
    else if(lobbyData)
    {
      const lobbyDataHandler = (roomNumberToJoin) => 
      {
        if(roomNumberToJoin === "createRoom") {sendIt("createRoom",(returnedRoomData)=> {setAudioRoomData(returnedRoomData)})}
        else {sendIt("joinRoom", roomNumberToJoin,(returnedRoomData)=> {setAudioRoomData(returnedRoomData)})}
      }
      return <Lobby roomCount={lobbyData} onSendLobbyData={lobbyDataHandler}></Lobby>
    }
    else return <div>setDisplay in Room.jsx error...</div>
    
  }
  return setDisplay();
}
export default Rooms;

    

      // if(roomNumber === 0 || roomNumber)
      // {
      //   return (<>
      //     <h3>Room : {roomNumber}</h3>
      //     <div>Track Position : {currentTrackPosition}</div>
      //     <div>immediate POS: {immediateTrackPos}</div>
      //     <AudioPlayer
      //       isPlaying={isPlaying}
      //       currentTrackPosition={currentTrackPosition}
      //       onAudioCommand={handleAudioCommand}
      //       onImmediateTrackPos={handleImmediateTrackPosition}
      //     />
      //     <button onClick={handleLeaveRoom}>Leave Room</button>
      //     <NewsApi apiFetchData={newsApiData} onSendNewsApiData={handleNewsApiData}/>
      //   </>);
      // }
      // else
      // {
      //   const buttons = [];

      //   for (let i = 0; i < totalRooms; i++) 
      //   {
      //     buttons.push(<button key={i} value={i} onClick={(event) => handleJoinRoom(event.target.value)}>{i !== 0 ? "Join Room " + i : "Open Room"}</button>);
      //   }

      //   return (
      //     <div>
      //       <div>Count: {totalRooms}</div>
      //       <div>Room:{roomNumber}</div>
      //       <div>IsPlaying:{isPlaying}</div>
      //       <button onClick={handleCreateRoom}>Create A Room</button>
      //       <div>{buttons}</div>
      //     </div>
      //   );
      // }
    

//   return setDisplay();
//   const [newsApiData, setNewsApiData] = useState({"_id":{"$oid":"6528ad0a89029d75c06d3f63"},"timestamp":{"$numberInt":"2"},"body":"hello","likes":{"$numberLong":"34"},"author":"bob"})
//   //IMPORTANT: grab data from SocketProvider
//   const {initialRoomCount, listenForAllData, listenForRoomData, listenForAudioCommands, listenForJoinRoomRequest, acceptJoinRoomRequest, updateAudioTrackPosition, 
//     sendDataToAll, createRoom, joinRoom, sendToRoom, startStopAudio} = useSocket();
//   //all users varibles
//   const [allData, setallData] = useState();
//   //room variables
//   const [roomNumber, setRoomNumber] = useState(null);
//   const [roomData, setRoomData] = useState([]);
//   const [totalRooms, setTotalRooms] = useState(null);
//   //data identifier
//   let messageDataIdentifier = "sendAMessageToAll";
//   //Audio Variables
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [currentTrackPosition, setCurrentTrackPosition] = useState(0);
//   const [immediateTrackPos, setImmediateTrackPos] = useState(0);

//   //Create a Room
//   const handleCreateRoom = () => {createRoom((receivedRoomNumber) => {setRoomNumber(receivedRoomNumber)})};

//   const handleJoinRoom = (roomNumberToJoin) => 
//   {
//     console.log("room number it wants to join: " + roomNumberToJoin);
//     joinRoom(roomNumberToJoin, officialInitialAudioData => 
//     {
//       console.log(officialInitialAudioData);
//       setRoomNumber(officialInitialAudioData.roomNumber);
//       setCurrentTrackPosition(officialInitialAudioData.trackPosition);
//       setIsPlaying(officialInitialAudioData.isTrackPlaying);
//     })};

//   const handleLeaveRoom = () =>
//   {

//   }

//   // const handleSendToRoom = (roomData) => { sendToRoom(roomNumber, roomData, (receivedData) =>{ setRoomData(receivedData);});}

//   // const handleSendToAll = (stringMessage) => {sendDataToAll(messageDataIdentifier,stringMessage);};
  
//   const handleAudioCommand = (audioTrackPosition) => 
//   {
//     console.log("current audio track pos before setting:" + audioTrackPosition);
//     setIsPlaying(!isPlaying);
//     setCurrentTrackPosition(audioTrackPosition);
//     startStopAudio([!isPlaying, audioTrackPosition, !isPlaying ? new Date().getTime() : 0, roomNumber]);
//   };

//   const handleImmediateTrackPosition = (newTrackPos) => 
//   {
//     setImmediateTrackPos(newTrackPos);
//   }

//   //new api
//   const handleNewsApiData = () => 
//   {
//     sendDataToAll("newsApi", {"_id":{"$oid":"6528ad0a89029d75c06d3f63"},"timestamp":{"$numberInt":"2"},"body":"hello","likes":{"$numberLong":"33343333"},"author":"bob"});
//   }
  

//   useEffect(() => 
//   {
//     // listenForAllData((dataIdentifier, newData) => { if(dataIdentifier === "sendAMessageToAll") { console.log('client received data id['+dataIdentifier+']'); setallData(newData);}});
//     // listenForRoomData((newRoomData) =>{console.log("client received room data ::"); console.log(newRoomData); setRoomData(newRoomData)})
//     initialRoomCount((roomCount)=> {setTotalRooms(roomCount)});
//     listenForAllData((dataIdentifier, newData) => { if(dataIdentifier === "newsApi") { console.log('client received data id['+dataIdentifier+']');  setNewsApiData(newData);}});

//     listenForAudioCommands((newAudioDataList) => 
//     {
//       if(newAudioDataList[3] === roomNumber)
//       {
//         let incomingIsPlaying = newAudioDataList[0];
//         let thisTrackPos = newAudioDataList[1];
//         let incomingTimeStamp = newAudioDataList[2];
//         let adjustSync = incomingTimeStamp > 0 ? new Date().getTime() - incomingTimeStamp : 0;
//         adjustSync += thisTrackPos;
//         setCurrentTrackPosition(adjustSync);
//         //setCurrentTrackPosition(thisTrackPos);
//         setIsPlaying(incomingIsPlaying);
//       }
//     });

//   }, [listenForAllData,listenForRoomData,allData, roomData, listenForAudioCommands, listenForJoinRoomRequest, roomNumber, isPlaying, currentTrackPosition, newsApiData, initialRoomCount]);

// const setDisplay = () => 
// {
//     if(roomNumber === 0 || roomNumber)
//     {
//       return (<>
//         <h3>Room : {roomNumber}</h3>
//         <div>Track Position : {currentTrackPosition}</div>
//         <div>immediate POS: {immediateTrackPos}</div>
//         <AudioPlayer
//           isPlaying={isPlaying}
//           currentTrackPosition={currentTrackPosition}
//           onAudioCommand={handleAudioCommand}
//           onImmediateTrackPos={handleImmediateTrackPosition}
//         />
//         <button onClick={handleLeaveRoom}>Leave Room</button>
//         <NewsApi apiFetchData={newsApiData} onSendNewsApiData={handleNewsApiData}/>
//       </>);
//     }
//     else
//     {
//       const buttons = [];

//       for (let i = 0; i < totalRooms; i++) 
//       {
//         buttons.push(<button key={i} value={i} onClick={(event) => handleJoinRoom(event.target.value)}>{i !== 0 ? "Join Room " + i : "Open Room"}</button>);
//       }

//       return (
//         <div>
//           <div>Count: {totalRooms}</div>
//           <div>Room:{roomNumber}</div>
//           <div>IsPlaying:{isPlaying}</div>
//           <button onClick={handleCreateRoom}>Create A Room</button>
//           <div>{buttons}</div>
//         </div>
//       );
//     }
//   }

//   return setDisplay();
// }
// export default Rooms;