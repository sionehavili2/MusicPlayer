import React from "react"
import {Button} from "react-bootstrap"
import axios from 'axios';

export default function TrackSearchResult({ track, chooseTrack, accessToken}) {
  
  function handlePlay() {
    chooseTrack(track)
  }

  
  function addSongClient(){
    if (typeof track.uri !== 'string' || !/^spotify:track:[A-Za-z0-9]+$/.test(track.uri)) {
      console.log('Invalid trackUri format');
    }
    let data = {
      uri: track.trackUri
    }
    const auth = 'Bearer ' + accessToken;
    const headers = {
      'Authorization': auth
    };
    // Construct the full API call
    const fullAPICall = `https://api.spotify.com/v1/me/player/queue/?uri=${track.uri}`;
    console.log(fullAPICall)
    console.log("^full api request for adding to Que via Search bar")
    axios.post(fullAPICall, data, {headers})
        .then(res => {
           console.log(res);
           console.log("made it here 2")
        })
         .catch(error => {
           console.log("error below")
           console.error(error);
         });
  }

  return (
    <div
      className="d-flex m-2 align-items-center"
      style={{ cursor: "pointer" }}
      onClick={handlePlay}
    >
      <img src={track.albumUrl} style={{ height: "64px", width: "64px" }} />
      <div className="ml-3">
        <div>{track.title}</div>
        <div className="text-muted">{track.artist}</div>
        <button onClick={addSongClient}>Add Song to Queue</button>
      </div>
      {/* <Button className="ml-auto" onClick={handleAddToQueue}>
        Add to Queue
      </Button> */}
    </div>
  )
}