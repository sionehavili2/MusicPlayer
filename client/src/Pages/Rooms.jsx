
import React, {useState, useEffect } from 'react';
//IMPORTANT: call socket talker
import { useSocket } from '../components/SocketProvider'; 
import AudioPlayer from '../components/AudioPlayer';
import NavigationBar from "../components/Navigation";
import Dashbaord from "../components/Dashboard";
// const Rooms = () => 
// {
//   const [allRoomData, setAllRoomData] = useState({RoomNumber:null, HostID:null, HostName:null,});
//   const [audioData, setAudioData] = useState({isplaying:true,initTrackPosition:10.5,});

//   return <>
//     <AudioPlayer {...audioData}/>
//   </>
// }

// export default Rooms;

function Rooms() {

  //IMPORTANT: grab data from SocketProvider
  const {initialRoomCount, listenForAllData, listenForRoomData, listenForAudioCommands, listenForJoinRoomRequest, acceptJoinRoomRequest, updateAudioTrackPosition, 
    sendDataToAll, createRoom, joinRoom, sendToRoom, startStopAudio} = useSocket();
  //all users varibles
  const [allData, setallData] = useState();
  const [allInput, setAllInput] = useState();
  //room variables
  const [roomInput, setRoomInput] = useState("");
  const [roomNumber, setRoomNumber] = useState(null);
  const [roomData, setRoomData] = useState([]);
  //data identifier
  let messageDataIdentifier = "sendAMessageToAll";
  //Audio Variables
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackPosition, setCurrentTrackPosition] = useState(0);
  const [immediateTrackPos, setImmediateTrackPos] = useState(0);

  //Create a Room
  const handleCreateRoom = () => {createRoom((receivedRoomNumber) => {setRoomNumber(receivedRoomNumber)})};

  const handleJoinRoom = (roomNumberToJoin) => 
  {
    joinRoom(roomNumberToJoin, officialInitialAudioData => 
    {
      console.log("client has recevied initialaudio data");
      console.log(officialInitialAudioData);
      setRoomNumber(officialInitialAudioData.roomNumber);
      setCurrentTrackPosition(officialInitialAudioData.trackPosition);
      setIsPlaying(officialInitialAudioData.isTrackPlaying);
    })};

  // const handleSendToRoom = (roomData) => { sendToRoom(roomNumber, roomData, (receivedData) =>{ setRoomData(receivedData);});}

  // const handleSendToAll = (stringMessage) => {sendDataToAll(messageDataIdentifier,stringMessage);};
  
  const handleAudioCommand = (audioTrackPosition) => 
  {
    console.log("current audio track pos before setting:" + audioTrackPosition);
    setIsPlaying(!isPlaying);
    setCurrentTrackPosition(audioTrackPosition);
    startStopAudio([!isPlaying, audioTrackPosition, !isPlaying ? new Date().getTime() : 0, roomNumber]);
  };

  const handleImmediateTrackPosition = (newTrackPos) => 
  {
    setImmediateTrackPos(newTrackPos);
  }
  

  useEffect(() => 
  {
    console.log(initialRoomCount);
    // listenForAllData((dataIdentifier, newData) => { if(dataIdentifier === "sendAMessageToAll") { console.log('client received data id['+dataIdentifier+']'); setallData(newData);}});
    // listenForRoomData((newRoomData) =>{console.log("client received room data ::"); console.log(newRoomData); setRoomData(newRoomData)})
    
    listenForAudioCommands((newAudioDataList) => 
    {
      let incomingIsPlaying = newAudioDataList[0];
      let thisTrackPos = newAudioDataList[1];
      let incomingTimeStamp = newAudioDataList[2];
      let adjustSync = incomingTimeStamp > 0 ? new Date().getTime() - incomingTimeStamp : 0;

      console.log("time to adjust for sync : " + adjustSync);
      console.log("incoming timestamp:" + incomingTimeStamp);
      console.log("incoming track position: " + thisTrackPos);
      adjustSync += thisTrackPos;
      //setCurrentTrackPosition(adjustSync);
      setCurrentTrackPosition(thisTrackPos);
      setIsPlaying(incomingIsPlaying);
    });

    //listenForJoinRoomRequest(()=>{console.log("host has recevied a pause request");});
  
    // listenForJoinRoomRequest((socketID, callBackForAudioData)=> 
    // {
    //   if(roomNumber)
    //   {
    //     console.log("received room request from :" + socketID);
    //     //STILL NEED TO MAKE SURE YOUR CURRENT TRACK POS is updated
    //     //callBackForAudioData([roomNumber,currentTrackPosition, isPlaying]);
    //     acceptJoinRoomRequest([roomNumber,currentTrackPosition, isPlaying]);
    //   } 
    //   else console.log("ERROR: listenForJoinRoomRequest but roomNumber is invalid");
    // });

  }, [listenForAllData,listenForRoomData,allData, roomData, listenForAudioCommands, listenForJoinRoomRequest, roomNumber, isPlaying, currentTrackPosition]);

const setDisplay = () => 
{
    // if (!isLoggedIn)
    // {
    //   <Dashbaord/>
    // }
    if(roomNumber == 0)
    {
      return (<>
        <div>You are in room : {roomNumber}</div>
        <div>Track Position : {currentTrackPosition}</div>
        <div>immediate POS: {immediateTrackPos}</div>
        <AudioPlayer
          isPlaying={isPlaying}
          currentTrackPosition={currentTrackPosition}
          onAudioCommand={handleAudioCommand}
          onImmediateTrackPos={handleImmediateTrackPosition}
        />
        {/* 
          <input value={roomInput} onChange={(event)=> {setRoomInput(event.target.value)}}/>
          <button value={roomInput} onClick={(event)=> {handleSendToRoom(event.target.value)}}>send to Room: </button>
          <p>Room Data: {roomData}</p>
          
          <div>------------------------------------------------------------------------------------------------------------</div>
          
          <input value={allInput} onChange={(event)=> {setAllInput(event.target.value)}}/>

          <button value={allInput} onClick={(event)=> {handleSendToAll(event.target.value)}}>Send To All</button>
          <p>All Data: {allData}</p> */}
      </>);
    }
    else
    {
      return (
        <div>
          <div>Room:{roomNumber}</div>
          <div>IsPlaying:{isPlaying}</div>
          <button onClick={handleCreateRoom}>Create A Room</button>
          <button value={0} onClick={(event)=> {handleJoinRoom(event.target.value)}}>Join Open Room 0</button>
        </div>
      );
    }
  }

  return setDisplay();
}
export default Rooms;