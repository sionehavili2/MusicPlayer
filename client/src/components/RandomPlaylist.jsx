import React, { useState } from "react";
import axios from "axios";

function RandomPlaylist( {accessToken}){
    const [category, setCategory] = useState("");
    const [data, setData] = useState(null)
    
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
    
      return (
        <div>
          <label>
            Enter a Category: <input 
                category="Category" 
                onChange={handleCategoryChange}
                />
            </label>
            <button onClick={addRandomMusicPlayList}>Add Category</button>
            <div>
              {data ? (
                <div>
                  {/* Display the extracted data */}
                  
                  <p>{data.playlists.href}</p>
                  <p>{data.playlists.items[0].href}</p>
                  <p>{data.playlists.items[1].href}</p>
                </div>
              ) : (
                <p> </p>
              )}
            </div>   
        </div>
        
      )
    }

export default RandomPlaylist;