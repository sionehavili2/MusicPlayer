import { useRef, useState, useEffect } from "react";

const AudioRoom = (props) => 
{
  const audioRef = useRef(null);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const handlePlayPauseBtn = () => 
  {
    props.onUpdateAudioData(audioRef.current.currentTime);
    setButtonDisabled(true);
    setTimeout(() => {setButtonDisabled(false)}, 200); 
  };

  useEffect(() => 
  {
    audioRef.current.currentTime = props.trackPosition;
    props.isTrackPlaying ? audioRef.current.play() :  audioRef.current.pause();
    // return () => { console.log("audio player useffect CLEDANUP")}
  }, [props.isTrackPlaying]);

   return (
    <div>
      <h2>Audio Room {props.roomNumber}</h2>
      <audio ref={audioRef}>
        <source src="Passionfruit.mp3" type="audio/mpeg" />
      </audio>
      <button onClick={handlePlayPauseBtn} disabled={buttonDisabled}>{props.isTrackPlaying ? 'Pause' : 'Play'}</button>
      <br/>
      <br/>
      <button onClick={()=>{props.onLeaveRoom()}}>Leave Room</button>
    </div>
  );
}
export default AudioRoom;