import React, {useState, useEffect} from 'react';
import classes from "./MusicList.module.css";

const MusicList = (props) => {

  const [isDisabled, setIsDisabled] = useState(false);

  const formatFileName = (fileName) => {
    return fileName.slice(0, fileName.lastIndexOf('.mp3'));
  };


  return (
    <div className={classes.mainContainer}>{props.songList.map((fileName, index) => 
      (
        <div key={index}>{props.selectedSongIndex === index 
          ?
            <div className={classes.selectedMainContainerTiles + " " + classes.mainContainerTiles}>
              <div className={classes.selectedSongText}>{index + 1}. {formatFileName(fileName)}</div>
              {!props.hasVoted && <button onClick={()=>{props.onVotedToSkip();}} className={classes.voteBtn} disabled={props.hasVoted}>Vote to Skip</button>}
              {props.currentSkipVoteCount > 0 && <div> Skip Votes : {props.currentSkipVoteCount}</div>}
            </div>
          : 
            <div className={classes.mainContainerTiles}>{index + 1}. {formatFileName(fileName)}</div> 
          }
        </div>
      ))}
    </div>
  );
};

export default MusicList;