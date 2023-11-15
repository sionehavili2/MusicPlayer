import React, { useState } from "react";
import axios from "axios";

function RandomPlaylist( {accessToken}){
    const [category, setCategory] = useState("");
    const [data, setData] = useState(null)
    const [playlistId3, setplaylistId3] = useState("")

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
              console.log(res.data)
               setData(res.data);
               console.log("made it here 2")
               addPlaylist(res.data)
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
      const  addSelectedPlayist = async (data, playlistId) =>  {
        //  setplaylistId3(playlistId);
        // console.log(playlistId3)
        // const auth = 'Bearer ' + accessToken;
        // const headers = {
        //   'Authorization': auth
        // };
        // let category_id = category;
        // const playlistId2 = await(playlistId);
        // console.log(playlistId2)
        // // Construct the full API call
        // const fullAPICall2 = data.playlists.items[0].href;
        // axios.get(fullAPICall2, {headers})
        //     .then(res => {
        //       console.log(res.data)
        //        console.log("made it here 3")
        //     })
        //      .catch(error => {
        //        console.log("error below")
        //        console.error(error);
        //      });
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
              <div>

                {data.playlists.items.map((playlist, index) => (
                  <div key={index}>
                    <p>{playlist.href}</p>
                    <p>{playlist.id}</p>
                    <p>{playlist.description}</p>
                    {playlist.images && playlist.images.length > 0 && (
                        <img
                          src={playlist.images[0].url}
                          style={{ height: "64px", width: "64px" }}
                          alt={`Playlist Image ${index}`}
                        />
                    )}
                    <button
                      onClick={addSelectedPlayist(playlist.id)} >
                        Add Playlist to Queue
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p> </p>
            )}
          </div>
        </div>
      );
      
      
    }

export default RandomPlaylist;