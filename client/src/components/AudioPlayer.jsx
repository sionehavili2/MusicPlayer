// import React, { useRef, useEffect, useState } from 'react';

// const AudioPlayer = ({isPlaying, initTrackPosition}) => 
// {
//   const audioRef = useRef(null);
//   const [myTrackPosition, setMyTrackPosition] = useState(initTrackPosition);
//   const [buttonDisabled, setButtonDisabled] = useState(false);

//   const handlePlayPauseBtn = () => 
//   {
//     setButtonDisabled(true);
//     setTimeout(() => {setButtonDisabled(false)}, 200); 
//   };

//   useEffect(() => 
//   {
//     console.log("audio player useffect initiated...");
//     console.log("postion:" + initTrackPosition);
//     const audioElement = audioRef.current;
//     audioElement.currentTime = initTrackPosition;

//     if(isPlaying)
//     {
//       audioElement.play();
//     }
//     else 
//     {
//       audioElement.pause();
//     }

//     return () => 
//     {
//       console.log("audio player useffect CLEDANUP"); 
//     }
//   }, [isPlaying, initTrackPosition]);

//    return (
//     <div>
//       <h2>MP3 Audio Player</h2>
//       <audio ref={audioRef}>
//         <source src="Passionfruit.mp3" type="audio/mpeg" />
//         Your browser does not support the audio element.
//       </audio>
//       <button onClick={handlePlayPauseBtn} disabled={buttonDisabled}>{isPlaying ? 'Pause' : 'Play'}</button>
//       <div>Current Track Position: {myTrackPosition}</div>
//     </div>
//   );


// };

//export default AudioPlayer;

import React, { useRef, useEffect, useState } from 'react';

const AudioPlayer = ({isPlaying, currentTrackPosition, onAudioCommand, onImmediateTrackPos}) => 
{
  const audioRef = useRef(null);
  const [myTrackPosition, setMyTrackPosition] = useState(currentTrackPosition);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const handlePlayPauseBtn = () => 
  {
    setButtonDisabled(true);
    onAudioCommand(myTrackPosition);
    setTimeout(() => {setButtonDisabled(false)}, 200); 
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
    },1000);

    if(isPlaying)
    {
      audioElement.play();
    }
    else 
    {
      audioElement.pause();
      clearInterval(intervalUpdateTrackPosition);
    }

    return () => 
    { 
      clearInterval(intervalUpdateTrackPosition); 
      onImmediateTrackPos(audioElement.currentTime);
    }
  }, [isPlaying, currentTrackPosition, onAudioCommand]);

   return (
    <div>
      <h2>MP3 Audio Player</h2>
      <audio ref={audioRef}>
        <source src="Passionfruit.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <button onClick={handlePlayPauseBtn} disabled={buttonDisabled}>{isPlaying ? 'Pause' : 'Play'}</button>
      <div>Current Track Position: {myTrackPosition}</div>
    </div>
  );
};

export default AudioPlayer;