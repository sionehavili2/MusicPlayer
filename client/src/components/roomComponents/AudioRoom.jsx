import { useRef, useState, useEffect } from "react";
import MusicList from "./MusicList";
import RoomControl from "./RoomControls";

const AudioRoom = (props) => 
{
  const songList = ["Cupid.mp3","Passionfruit.mp3","Aint Too Proud To Beg.mp3","Mr Telephone Man.mp3","Whats Going On.mp3","Never Too Much.mp3","What You Wont Do for Love.mp3"];
  
  const audioRef = useRef(null);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [roomControls, setRoomControls] = useState(null);

  const handleSkip = () =>  {props.onUpdateAudioData(["skipSong", props.songIndex + 1])}
  const handlePlay = () =>  {if (audioRef.current && audioRef.current.paused) {audioRef.current.play();}};
  const handlePause = () => {if (audioRef.current && !audioRef.current.paused) {audioRef.current.pause();}};
  const handleEnded = () => {props.onUpdateAudioData(["skipSong", props.songIndex + 1]);}
  const handleVoteSkip = ()=> {if(audioRef.current)
  {
    props.onUpdateAudioData(["skipVote", audioRef.current.currentTime])
  }};
  const handlePlayPauseBtn = () => 
  {
    props.onUpdateAudioData(["playPause",audioRef.current.currentTime]);
    setButtonDisabled(true);
    setTimeout(() => {setButtonDisabled(false)}, 200);  
  };

  useEffect(()=>{setRoomControls(props.roomControls)},[props.roomControls]);

  useEffect(() => 
  {
      //Host Commands
      if(!props.isHost && props.roomControls.isHostControl) {setButtonDisabled(true);}
      //Set Audio SRC (mp3)
      if(audioRef.current){audioRef.current.src = songList[props.songIndex];}
      //Set Track position 
      if (isFinite(props.trackPosition)){audioRef.current.currentTime = props.trackPosition;}
      //Play or pause it depending on received command
      props.isTrackPlaying ? handlePlay() : handlePause();
      //If the host has host only audio, pause the audio for other users.
      if(!props.isHost && props.roomControls.audioOutput === "hostOnly") {setTimeout(() => {if (audioRef.current) {audioRef.current.pause();}}, 50);} // Adjust the delay time as needed}
      //Add listeners to audio component
      if(audioRef.current)
      {
        audioRef.current.addEventListener('play', handlePlay);
        audioRef.current.addEventListener('pause', handlePause);
        audioRef.current.addEventListener('ended', handleEnded);
      }      
      // Clean up listeners
      return () => 
      {
        if(audioRef.current)
        {
          audioRef.current.removeEventListener('play', handlePlay);
          audioRef.current.removeEventListener('pause', handlePause);
          audioRef.current.removeEventListener('ended', handleEnded);
        }
      };

},[props]);


   return (
    <div>
      <h2>Audio Room {props.roomNumber}</h2>
      <RoomControl {...roomControls} isHost={props.isHost} onUpdateControls={(newControls)=>{props.onUpdateAudioData(["roomControls", audioRef.current.currentTime, newControls])}}/>
      <audio ref={audioRef} controls>
        <source type="audio/mpeg" />
      </audio>
      <button onClick={handlePlayPauseBtn} disabled={buttonDisabled}>{props.isTrackPlaying ? 'Pause' : 'Play'}</button>
      <button onClick={handleSkip} disabled={buttonDisabled}>Skip</button>
      <br/>
      <br/>
      <button onClick={()=>{props.onLeaveRoom()}}>Leave Room</button>
      <MusicList songList={songList} selectedSongIndex={props.songIndex} hasVoted={props.isVoteAvailable} currentSkipVoteCount={props.skipVoteCount} onVotedToSkip={handleVoteSkip}/>
      
    </div>
  );
}
export default AudioRoom;


