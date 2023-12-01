import React, { useState, useEffect } from "react";
import axios from "axios";

function RandomPlaylist( {accessToken}){
    const [category, setCategory] = useState("");
    const [data, setData] = useState(null)
    const [playlistId3, setplaylistId3] = useState("")
    const [playlistIds, setPlaylistIds] = useState([]);

    useEffect(() => {
    // You can perform additional actions here
    console.log("playlistId3 has been updated:");
  }, [playlistId3]);

    function handleCategoryChange (e) {
        setCategory(e.target.value)
    }

    function addRandomMusicPlayList(){
        const auth = 'Bearer ' + accessToken;
        const headers = {
          'Authorization': auth
        };
        let category_id = category;
        // Construct the full API call
        const fullAPICall = `https://api.spotify.com/v1/browse/categories/${category_id}/playlists`;
        axios.get(fullAPICall, {headers})
            .then(res => {
               setData(res.data);
               console.log("Playlist Id below")
               addPlaylist(res.data)
               const ids = res.data.playlists.items.map((playlist) => playlist.id);
               setPlaylistIds(ids);
               
            })
             .catch(error => {
               console.log("error below")
               console.error(error);
             });
      }
      function addPlaylist(data){
        const auth = 'Bearer ' + accessToken;
        const headers = {
          'Authorization': auth
        };
        let category_id = category;
        // Construct the full API call
        const fullAPICall = data.playlists.items[0].href;
        axios.get(fullAPICall, {headers})
            .then(res => {
              console.log(res.data)
               console.log("made it here 3")
            })
             .catch(error => {
               console.log("error below")
               console.error(error);
             });
      }
      async function addSelectedPlaylist(data) {
        console.log("made it inside addSelectedPlaylist");
        console.log(playlistId3);
        const auth = 'Bearer ' + accessToken;
        const headers = {
          'Authorization': auth
        };
        let category_id = category;
      
        // Construct the full API call
        const fullAPICall2 = `https://api.spotify.com/v1/playlists/${playlistId3}/tracks`;
        await axios.get(fullAPICall2, { headers })
          .then(res => {
            console.log(res.data);
            console.log("playlist get request");
            res.data.items.forEach(async (item, index) => {
              if (item.track && item.track.uri) {
                console.log(`Item ${index + 1} Track URI:`, item.track.uri);
                setTimeout(async () => {
                  const apiCallAddToQue = `https://api.spotify.com/v1/me/player/queue/?uri=${item.track.uri}`;
                  await addTrackToQueue(apiCallAddToQue, headers);
                }, (index + 1) * 1000);
              }
            });
          })
          .catch(error => {
            console.log("error below");
            console.error(error);
          });
      }
      
      async function addTrackToQueue(apiCallAddToQue, headers) {
        try {
          const response = await axios.post(apiCallAddToQue, null, { headers });
          console.log(response);
          console.log("add playlist to Queue");
        } catch (error) {
          console.log("error below");
          console.error(error);
        }
      }
      
    
      return (
        <div>
          <label>
            Enter a Category:{" "}
            <input category="Category" onChange={handleCategoryChange} />
          </label>
          <button onClick={addRandomMusicPlayList}>Add Category</button>
          
          <div>
            {data ? (
              <div style={{ 
              border: '1px solid #000', 
              padding: '10px', 
              borderRadius: '5px' }}>
           {data.playlists.items.map((playlist, index) => (
            <div key={index} style={{ 
              marginBottom: '10px', 
              border: '1px solid #121212',
              padding: '10px',
              borderRadius: '5px', 
              backgroundColor: `#212121`,
              color: 'b3b3b3',
              fontFamily: 'Ethos Nova, sans-serif'}}>
          {/* <p>{playlist.href}</p>
          <p>playlist - id {playlist.id}</p> */}

      <p style={{ color: 'white',
       fontFamily: 'Ethos Nova, sans-serif',
       fontSize: `28px`}}>{playlist.description}</p>
      {playlist.images && playlist.images.length > 0 && (
        <img
          src={playlist.images[0].url}
          style={{ height: "180px", width: "180px" }}
          alt={`Playlist Image ${index}`}
        />
      )} 
      <button
            onClick={() => {
              setplaylistId3(playlist.id);
              console.log(playlistId3);
              addSelectedPlaylist();
              // window.scrollTo(0, document.body.scrollHeight);
              console.log("Finished Adding Playlist");
           }}
           style={{
            backgroundColor: '#535353', 
            color: 'white',
            marginLeft: '13px',
            fontFamily: 'Ethos Nova, sans-serif',
            fontSize: '20px',
            borderRadius: "7px",
            padding:`10px`
          }}
      >
        Add Playlist to Queue
      </button>
    </div>
  ))}
</div>

            ) : (
              <p> </p>
              )}
            </div>
      
            {/* <div>
              <p>Saved Playlist IDs:</p>
              <ul>
                {playlistIds.map((id, index) => (
                  <li key={index}>{id}</li>
                ))}
              </ul>
            </div> */}
          </div>
        );
      }
      
      export default RandomPlaylist;