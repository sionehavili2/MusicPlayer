import { useState, useEffect } from "react"
import SpotifyPlayer from "react-spotify-web-playback"

export default function Player({ accessToken, trackUri }) {
  const [play, setPlay] = useState(false)
  const [trackID, setTrackID] = useState("")

  useEffect(() => {
    setPlay(true),
    setTrackID(trackUri)
  }, [trackUri])

  if (!accessToken) return null
  return (
    <div>
    <button onClick={() => console.log(trackID + " liked")}>Like</button>
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