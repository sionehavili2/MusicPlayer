import React, { useState } from "react";
import axios from "axios";

function RandomPlaylist( {accessToken}){
    const [category, setCategory] = useState("");
    
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
               console.log(res);
               console.log("made it here 2")
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
        </div>
      )
    }

export default RandomPlaylist;