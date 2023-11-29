import React from 'react'
import {Container } from "react-bootstrap"


const AUTH_URL = 
"https://accounts.spotify.com/authorize?client_id=7307ec35fb414373b246109805e86181&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state"


export default function spotifyAuth(){

    function openNewWindow(e) {
        e.preventDefault();
        const newWindow = window.open(AUTH_URL);
        if(newWindow){
            newWindow.focus()
        }
    }
    
    return(
        <Container className="d-flex justify-center align-items-center"
        style={{minHeight: "100vh"}}
        >
            <a className='btn btn-success btn-lg' onClick={openNewWindow}>Login to Spotify</a>
           
        </Container>
        
    )
}