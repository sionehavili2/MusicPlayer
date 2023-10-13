import React, {useState, useEffect } from 'react';
//IMPORTANT: call socket talker
import { useSocket } from './SocketProvider'; 
import AudioPlayer from './AudioPlayer';

function Rooms() {

  //IMPORTANT: grab data from SocketProvider
  const {listenForAllData, listenForRoomData, sendDataToAll, sendToRoom, createRoom, joinRoom, playAudio,
     pauseAudio, listenForAudioCommands, listenForAudioTrackPosition, updateAudioTrackPosition} = useSocket();
  //all users varibles
  const [allData, setallData] = useState();
  const [allInput, setAllInput] = useState();
  //room variables
  const [roomInput, setRoomInput] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [roomData, setRoomData] = useState([]);
  //data identifier
  let messageDataIdentifier = "sendAMessageToAll";
  //Audio Variables
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackPosition, setCurrentTrackPosition] = useState(0);
  const [currentTrackPositionTimeStamp, setCurrentTrackPositionTimeStamp] = useState(0);

  //Sending Data
  const handleCreateRoom = () => 
  {
    createRoom((receivedRoomNumber) => {console.log("client received room number" + receivedRoomNumber); setRoomNumber(receivedRoomNumber);});
  }

  const handleJoinRoom = (roomNumber) => 
  {
    joinRoom(roomNumber,(receivedRoomNumber, initialTrackPosition, isTrackPlaying, initialTrackTimeStamp) => 
    {
      console.log("client joined room number: " + receivedRoomNumber + " --- " + initialTrackPosition + " --- " + isTrackPlaying + " --- " + initialTrackTimeStamp); 
      setRoomNumber(receivedRoomNumber);
      setCurrentTrackPosition(initialTrackPosition);
      setCurrentTrackPositionTimeStamp(initialTrackTimeStamp);
      setIsPlaying(isTrackPlaying);
    });
  }

  const handleSendToRoom = (roomData) => 
  {
    sendToRoom(roomNumber, roomData, (receivedData) =>{ /*console.log("client: received callback sendToRoom"); console.log(receivedData);*/ setRoomData(receivedData); });
  }

  const handleSendToAll = (stringMessage) => 
  {
    sendDataToAll(messageDataIdentifier,stringMessage);
  };

  const handleAudioCommand = (audioTrackPosition) => 
  {
    isPlaying ? pauseAudio(roomNumber, audioTrackPosition) : playAudio(roomNumber, audioTrackPosition);
  }

  const handleUpdateAudioTrackPosition = (audioPosition) =>
  {
    // console.log("room has received audio pos from  audio player:" + audioPosition);
    // console.log("timestamp received:" + timeStamp);
    let newTimeStamp = new Date().getTime();
    updateAudioTrackPosition(roomNumber, audioPosition, newTimeStamp); 
  }

  //Receiving Data
  useEffect(() => 
  {
    listenForAllData((dataIdentifier, newData) => { if(dataIdentifier === "sendAMessageToAll") { console.log('client received data id['+dataIdentifier+']'); setallData(newData);}});
    listenForRoomData((newRoomData) =>{console.log("client received room data ::"); console.log(newRoomData); setRoomData(newRoomData)})
    listenForAudioCommands((updatedTrackPosition, isTrackPlaying) => 
    {
      console.log("rooms received audio commands:" + updatedTrackPosition + ":" + isTrackPlaying);
      setIsPlaying(isTrackPlaying);
      setCurrentTrackPosition(updatedTrackPosition);
    });

  }, [listenForAllData,listenForRoomData,listenForAudioCommands, allData, roomData, isPlaying, currentTrackPosition, currentTrackPositionTimeStamp]);

const setDisplay = () => 
{
    if(roomNumber)
    {
      return (<>
        <div>You are in room : {roomNumber}</div>
        <input value={roomInput} onChange={(event)=> {setRoomInput(event.target.value)}}/>
        <button value={roomInput} onClick={(event)=> {handleSendToRoom(event.target.value)}}>send to Room: </button>

        <AudioPlayer
          isPlaying={isPlaying}
          currentTrackPosition={currentTrackPosition}
          timeStamp={currentTrackPositionTimeStamp}
          onAudioCommand={(newCurrentTrackPosition)=>{handleAudioCommand(newCurrentTrackPosition)}}
          onUpdateAudioTrackPos={(newTrackPos)=>{handleUpdateAudioTrackPosition(newTrackPos);}}
        />
        <p>Room Data: {roomData}</p>
        
        <div>------------------------------------------------------------------------------------------------------------</div>
        
        <input value={allInput} onChange={(event)=> {setAllInput(event.target.value)}}/>

        <button value={allInput} onClick={(event)=> {handleSendToAll(event.target.value)}}>Send To All</button>
        <p>All Data: {allData}</p>

      </>);
    }
    else
    {
      return (
        <div>
              <button onClick={handleCreateRoom}>Create A Room</button>
              <button value={2} onClick={(event)=> {handleJoinRoom(event.target.value)}}>Join Room 2</button>
        </div>
      );
    }
  }

  return setDisplay();
}
export default Rooms;