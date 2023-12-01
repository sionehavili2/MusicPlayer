
import React, {useState, useEffect } from 'react';
import { useSocket } from '../components/SocketProvider.jsx'; 
import Lobby from "../components/roomComponents/Lobby.jsx";
import NewsApi from "./NewsApi.jsx";
import AudioRoom from '../components/roomComponents/AudioRoom.jsx';
import MusicList from '../components/roomComponents/MusicList.jsx';
import RoomControl from '../components/roomComponents/RoomControls.jsx';
import axios from 'axios';
import MusicPage from './MusicPage.jsx';

function Rooms()
{
  const { onLobbyData, onAudioRoomData, onRecieveAll, onRoomControlData, sendIt} = useSocket();

  const [userID, setUserID] = useState(null);
  const [roomState, setRoomState] = useState(0);
  const [roomNumber, setRoomNumber] = useState(null);
  const [lobbyData, setLobbyData] = useState(null);
  const [audioRoomData,setAudioRoomData] = useState(null);
  const [roomControls, setRoomControls] = useState(null);
  
  //1. This will received lobby data that will populate open screen.
  useEffect(()=>{if(roomState === 0)onLobbyData((incomingLobbyData) => {setLobbyData(incomingLobbyData)});},[onLobbyData]);
  //2. if you are in a room, you can receive audio commands
  useEffect(()=>{if(roomState === 1){onAudioRoomData((newAudioData)=> {if(newAudioData[0] === roomNumber){ console.log("appliying audio room data...."); setAudioRoomData((currData)=>({...currData,...newAudioData[1]})); if(newAudioData[2]){setRoomControls(newAudioData[2])} }})}},[roomState]);
  //4 If In Room, you can receive host controls
  useEffect(()=>{if(roomState === 1){onRoomControlData((newControls)=>{console.log("recieved room control..."); if(newControls[0]=== roomNumber){console.log("applying room controls..."); console.log(newControls); setRoomControls(newControls[1])}})}},[roomState]);
  
  const displayRoomState = () => 
  {
    //2. If we have lobby data display Lobby
    if(roomState === 0 && lobbyData)
    {
      const handleSendLobbyData = (value)=>
      {
        if(value === "createRoom") sendIt("createRoom", (returnedRoomData)=>
        {
          console.log("create room..."); 
          console.log(returnedRoomData); 
          setUserID(returnedRoomData[0]);
          setRoomNumber(returnedRoomData[1]); 
          setAudioRoomData(returnedRoomData[2]);  
          setRoomControls(returnedRoomData[3]); 
          setRoomState(1);
          axios.post("http://localhost:4000/newPost");
        }) 
        else sendIt("joinRoom",parseInt(value),(returnedJoinRoomData)=>{console.log("join room..."); setUserID(returnedJoinRoomData[0]);setRoomNumber(returnedJoinRoomData[1]); setAudioRoomData(returnedJoinRoomData[2]);  setRoomControls(returnedJoinRoomData[3]); setRoomState(1);})
      }      
      return (<>
        <div>Room Number: {roomNumber}</div>
        <Lobby incomingLobbyData={lobbyData} onSendLobbyData={handleSendLobbyData}/>
        <MusicPage />
      </>);
    }
    //3. If You have audio room, display Audio Room
    else if(roomState === 1 && audioRoomData)
    {
      const handleUpdateAudio = (audioRoomResponse) => 
      {
        if(audioRoomResponse.length === 1)
        {

          let newTrackPosition = audioRoomResponse;
          sendIt("startStopAudio", [roomNumber, !audioRoomData.isTrackPlaying, newTrackPosition, new Date().getTime() + 5000])
        }
        else
        {
          let newTrackPosition = audioRoomResponse[0];
          let newHostCommands =  audioRoomResponse[1];
          sendIt("startStopAudio", [roomNumber, audioRoomData.isTrackPlaying, newTrackPosition, new Date().getTime() + 5000, newHostCommands]);
        }
      } 
      const handleLeaveRoom = () => {setAudioRoomData(null);setRoomControls(null); setRoomNumber(null); setRoomState(0);}
      const AudioRoomMemo = React.memo(AudioRoom);
      
      return<>
        {audioRoomData && !audioRoomData.host && <><h3>NO HOST</h3><button onClick={()=>{sendIt("beHost",roomNumber)}}>Be Host</button></>}
        {/* <RoomControl {...roomControls} isHost={audioRoomData.host === userID} onUpdateControls={(newControls)=>{sendIt("sendRoomControls",[roomNumber,newControls])}}/> */}
        <AudioRoomMemo {...audioRoomData} isHost={audioRoomData.host === userID}  roomControls={roomControls} roomNumber={roomNumber} onUpdateAudioData={handleUpdateAudio} onLeaveRoom={handleLeaveRoom}/>
      </>;
    }
    //1. If We dont have lobby data display loading
    else return <div>Loading....</div>
  }
  return displayRoomState();
}



// function Rooms() 
// {
//   const { onLobbyData,onAudioCommand, onRecieveAll, onControlCommands, sendIt} = useSocket();
  
//   const [userID, setUserID] = useState(null);
//   const [lobbyData, setLobbyData] = useState(null);
//   const [audioRoomData, setAudioRoomData] = useState(null);
//   const [incomingAudioData, setIncomingAudioData] = useState(null);
//   const [roomControlData, setRoomControlData] = useState(null);
//   const [newsApiData, setNewsApiData] = useState({"_id":{"$oid":"6528ad0a89029d75c06d3f63"},"timestamp":{"$numberInt":"2"},"body":"hello","likes":{"$numberLong":"3"},"author":"bob"});

//   useEffect(()=> 
//   {
//     console.log("audio room data");
//     console.log(audioRoomData);
//     //1. If you are NOT in a room (no audioRoomData) listen for lobby Data
//     if(!audioRoomData) onLobbyData((incomingLobbyData)=>{setLobbyData(incomingLobbyData)});
//     //2. If you have a Room, and the incoming command is for your room, receive incomingAudioData and apply it to your RoomData
//     if(audioRoomData && incomingAudioData){if(audioRoomData.roomNumber === incomingAudioData.roomNumber) setAudioRoomData(incomingAudioData);}
//     //3. else If you dont having incomingAudioData then wait (listen for incoming audio Commands)
//     else onAudioCommand((incomingAudioCommand) => {console.log("incoming audio data running...."); setIncomingAudioData(incomingAudioCommand)});

//   });

//   useEffect(()=>
//   {
//     onControlCommands((newControlData)=> 
//     { 
//     if(audioRoomData && audioRoomData.roomNumber === newControlData[0])
//     {
//       console.log("new")
//       console.log(newControlData);
//       setRoomControlData(newControlData[1]);
//       setAudioRoomData((currentAudioRoomData)=>({...currentAudioRoomData, roomControls:newControlData[1]})) 
//     }
//   })});

//   //1. get initial/updated lobby data && audioCommands
//   useEffect(()=> 
//   {
//     onRecieveAll((identifier, data)=>
//     {
//       console.log("received all command....."); 
//       console.log(identifier); 
//       console.log(data);

//       switch (identifier) 
//       {
//         case "newsApi" : console.log("recived news api data..."); console.log(data); setNewsApiData(data); break;
//         default: console.log("onRecieveAll() failed to match identifier:" + identifier);
//       }
//     });
//   },[onRecieveAll]);

//   //FINAL Decide what to display
//   const setDisplay = () => 
//   {
//     //A. If you are in a room (have audioRoomData) then display Audio Room
//     if(audioRoomData && roomControlData)
//     {
//       return (
//         <>
//           <div>host controls: {JSON.stringify(roomControlData)}</div>
//           <>{audioRoomData && !audioRoomData.host && <button>Be Host</button>}</>
//           <RoomControl {...roomControlData} onUpdateControls={(newHostControls)=>{ console.log("room reports host contorl"); console.log(newHostControls);sendIt("newHostControls",[audioRoomData.roomNumber,newHostControls])}}/>
//           <AudioRoom {...audioRoomData} onUpdateAudioData={(newTrackPosition)=> {sendIt("startStopAudio", [audioRoomData.roomNumber, !audioRoomData.isTrackPlaying, newTrackPosition, new Date().getTime() + 5000]);}} onLeaveRoom={() => {setAudioRoomData(null); setIncomingAudioData(null);}}/>
//           <NewsApi onSendNewsApiData={() => {sendIt("newsApi", {"_id":{"$oid":"6528ad0a89029d75c06d3f63"},"timestamp":{"$numberInt":"2"},"body":"hello","likes":{"$numberLong":"33343333"},"author":"bob"});}} apiFetchData={newsApiData}/>
//         </>
//       );
//     }
//     //B. Else if you have lobby Data, display Rooms to create/join
//     else if(lobbyData)
//     {
//       const lobbyDataHandler = (roomNumberToJoin) => 
//       {
//         if(roomNumberToJoin === "createRoom") {sendIt("createRoom",(returnedCreateRoomData)=> {setUserID(returnedCreateRoomData[0]); setAudioRoomData(returnedCreateRoomData[1]); setRoomControlData(returnedCreateRoomData[2]);})}
//         else 
//         {
//           sendIt("joinRoom", roomNumberToJoin, (returnedJoinRoomData)=> {setUserID(returnedJoinRoomData[0]); setAudioRoomData(returnedJoinRoomData[1]); setRoomControlData(returnedJoinRoomData[2]);});
//         }
//       }
//       return <>
//         <>{audioRoomData && <div>RoomNumber: {audioRoomData.roomNumber}</div>}</>
//         <Lobby roomCount={lobbyData} onSendLobbyData={lobbyDataHandler}></Lobby>
//       </>
//     }
//     else return <div>setDisplay in Room.jsx error...</div>
    
//   }
//   return setDisplay();
// }
export default Rooms;

    

