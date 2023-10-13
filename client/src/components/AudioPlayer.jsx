import React, { useEffect, useRef, useState } from 'react';

const AudioPlayer = ({ isPlaying, currentTrackPosition, onAudioCommand, onUpdateAudioTrackPos}) => 
{
  const audioRef = useRef(null);
  const [myTrackPosition, setMyTrackPosition] = useState(currentTrackPosition);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const handlePlayPauseBtn = () => 
  {
    setButtonDisabled(true);
    onAudioCommand(myTrackPosition);
    setTimeout(() => {setButtonDisabled(false); console.log("timeout running pause/playbtn")}, 200); 
  };

  //when a user joins a room, it needs the current track position and isplaying......
  useEffect(() => 
  {
    const audioElement = audioRef.current;
    audioElement.currentTime = currentTrackPosition;

    const intervalUpdateTrackPosition = setInterval(() => 
    {
      let currentTrackTime = audioElement.currentTime;
      setMyTrackPosition(currentTrackTime);
      onUpdateAudioTrackPos(currentTrackTime);
    }, 1000);

    if(isPlaying)
    {
      audioElement.play();
    }
    else 
    {
      audioElement.pause();
      clearInterval(intervalUpdateTrackPosition);
    }

    return () => {clearInterval(intervalUpdateTrackPosition);}
  }, [isPlaying, currentTrackPosition, onAudioCommand]);

   return (
    <div>
      <h2>MP3 Audio Player</h2>
      <audio ref={audioRef}>
        <source src="testSong.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <button onClick={handlePlayPauseBtn} disabled={buttonDisabled}>{isPlaying ? 'Pause' : 'Play'}</button>
      <div>Current Track Position: {myTrackPosition}</div>
    </div>
  );


};

export default AudioPlayer;