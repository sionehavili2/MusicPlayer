import React, { useState } from 'react';

const MusicList = ({ audioQueue, onAddToQueue, removeFromQueue }) => {
  
  const [songList] = useState([
    "Aint Too Proud To Beg.mp3",
    "Cupid.mp3",
    "Mr Telephone Man.mp3",
    "Never Too Much.mp3",
    "Passionfruit.mp3",
    "What You Wont Do for Love.mp3",
    "Whats Going On.mp3"
  ]);

  const formatFileName = (fileName) => {
    return fileName.slice(0, fileName.lastIndexOf('.mp3'));
  };

  const addToQueue = (fileName) => {
    onAddToQueue(fileName);
  };

  // return (
  //   <div>
  //     <h2>Music List</h2>
  //     {songList.map((fileName, index) => (
  //       <div key={index}>
  //         <p>{formatFileName(fileName)}</p>
  //         <button onClick={() => addToQueue(fileName)}>Add to Queue</button>
  //       </div>
  //     ))}
  //     <h2>Audio Queue</h2>
  //     <ul>
  //       {audioQueue.map((queuedFile, index) => (
  //         <li key={index}>
  //           {formatFileName(queuedFile)}
  //           <button onClick={() => removeFromQueue(index)}>Remove</button>
  //         </li>
  //       ))}
  //     </ul>
  //   </div>
  // );

  return <div>Music list...</div>
};

export default MusicList;