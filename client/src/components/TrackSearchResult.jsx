import React from "react"
import {Button} from "react-bootstrap"

export default function TrackSearchResult({ track, chooseTrack, accessToken}) {
  
  function handlePlay() {
    chooseTrack(track)
  }
  // function addSongToQue() {
  //   console.log("this is track")
  //   console.log(track.uri)
  //   console.log(track)
  //   console.log("this is track end")
  //   axios
  //     .post("http://localhost:4000/addToQue", {
  //       trackUri: track.uri 
  //     })
  //     .then(res => {
  //       console.log(res);
  //       console.log("made it here 2")
  //     })
  //     .catch(error => {
  //       console.error(error);
  //     });
  // }


//axios.post(track.uri, data, {header})
  
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
    const fullAPICall = `https://api.spotify.com/v1/me/player/queue/${track.uri}`;
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
        <button onClick={addSongClient}>test button</button>
      </div>
      <Button className="ml-auto" onClick={handleAddToQueue}>
        Add to Queue
      </Button>
    </div>
  )
}