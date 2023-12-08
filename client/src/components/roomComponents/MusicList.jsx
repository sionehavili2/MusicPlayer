import React, {useState, useEffect} from 'react';

const MusicList = (props) => {

  const formatFileName = (fileName) => {
    return fileName.slice(0, fileName.lastIndexOf('.mp3'));
  };


  return (
    <div>
      <h2>Music List</h2>
      <div>
        {props.songList.map((fileName, index) => 
        (
          <div key={index}>
            {props.selectedSongIndex === index ?
            
              <h3>{index + 1} : {formatFileName(fileName)} <button onClick={()=>{props.onVotedToSkip()}} disabled={props.hasVoted}>Vote to Skip</button>{props.currentSkipVoteCount > 0 && <div>Total Skip Vote:{props.currentSkipVoteCount}</div>}</h3>
             
            : 
              <div>{index + 1} : {formatFileName(fileName)}</div>
            
            }
          </div>
        ))}
      </div>
    </div>
  );
};

export default MusicList;