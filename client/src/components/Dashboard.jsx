import { useState, useEffect } from "react"
import useAuth from "./useAuth"
import Player from "./Player"
import TrackSearchResult from "./TrackSearchResult"
import { Container, Form } from "react-bootstrap"
import SpotifyWebApi from "spotify-web-api-node"
import axios from "axios"
import {Button} from "react-bootstrap"
import RandomPlaylist from "./RandomPlaylist"


const spotifyApi = new SpotifyWebApi({
  clientId: "7307ec35fb414373b246109805e86181",
})



export default function Dashboard({ code }) {
  const codeForTrack = code;
  const accessToken = useAuth(code)
  const [search, setSearch] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [playingTrack, setPlayingTrack] = useState()
  // console.log("dashboard code --")
  // console.log(codeForTrack)
  function chooseTrack(track) {
    setPlayingTrack(track)
    setSearch("")
  }
  
  
  useEffect(() => {
    if (!playingTrack) return


  }, [playingTrack])

  useEffect(() => {
    if (!accessToken) return
    spotifyApi.setAccessToken(accessToken)
  }, [accessToken])

  useEffect(() => {
    if (!search) return setSearchResults([])
    if (!accessToken) return

    let cancel = false
    spotifyApi.searchTracks(search).then(res => {
      if (cancel) return
      setSearchResults(
        res.body.tracks.items.map(track => {
          const smallestAlbumImage = track.album.images.reduce(
            (smallest, image) => {
              if (image.height < smallest.height) return image
              return smallest
            },
            track.album.images[0]
          )

          return {
            artist: track.artists[0].name,
            title: track.name,
            uri: track.uri,
            albumUrl: smallestAlbumImage.url,
          }
        })
      )
    })

    return () => (cancel = true)
  }, [search, accessToken])

  return (
    <>
    <Container className="d-flex flex-column py-2" style={{ height: "100vh" }}>
      <Form.Control
        type="search"
        placeholder="Search Songs/Artists"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div className="flex-grow-1 my-2" style={{ overflowY: "25vh" }}>
        {searchResults.map(track => (
          <TrackSearchResult
            track={track}
            accessToken={accessToken}
            key={track.uri}
            chooseTrack={chooseTrack}
          />
        ))}
       
      </div>
          <RandomPlaylist 
          accessToken={accessToken}
      />
      <div>
        <Player accessToken={accessToken} trackUri={playingTrack?.uri} />
      </div>
    </Container>
    </>
  )
}