import { useState, useEffect } from "react"
import SpotifyPlayer from "react-spotify-web-playback"

export default function Player({ accessToken, trackUri }) {
  const [play, setPlay] = useState(false)
  const [trackID, setTrackID] = useState("")

  useEffect(() => {
    setPlay(true), [trackUri]
    console.log(trackID)
    setTrackID(trackUri)
    console.log(trackID)
  }, [trackID])

  if (!accessToken) return null
  return (
    <SpotifyPlayer
      token={accessToken}
      showSaveIcon
      callback={state => {
        if (!state.isPlaying) setPlay(false)
      }}
      play={play}
      uris={trackUri ? [trackUri] : []}
    />
  )
}