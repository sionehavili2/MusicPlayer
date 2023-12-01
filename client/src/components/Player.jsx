import { useState, useEffect } from "react"
import SpotifyPlayer from "react-spotify-web-playback"
import axios from "axios"

export default function Player({ accessToken, trackUri }) {
  const [play, setPlay] = useState(false)
  const [trackID, setTrackID] = useState("")

  useEffect(() => {
    if (play) {
      const message = `${trackID} is now playing`
      console.log(message)
      axios.post("http://localhost:4000/newPost", { message })
    }
  }, [play]);

  useEffect(() => {
    setPlay(true), 
    setTrackID(trackUri)
  }, [trackUri])

  const handleLike = async(e) => {
    console.log(e)
    await axios.post("http://localhost:4000/newSongRecord", { e });
  }

  if (!accessToken) return null
  return (
    <div>
    <button onClick={() => {handleLike(trackID)}}>Like</button>
    <SpotifyPlayer
      token={accessToken}
      showSaveIcon
      callback={state => {
        if (!state.isPlaying) setPlay(false)
      }}
      play={play}
      uris={trackUri ? [trackUri] : []}
    />
    </div>
  )
}