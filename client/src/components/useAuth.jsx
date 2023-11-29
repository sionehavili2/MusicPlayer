import { useState, useEffect } from "react"
import axios from "axios"

export default function useAuth(code) {
  const [accessToken, setAccessToken] = useState()
  const [refreshToken, setRefreshToken] = useState()
  const [expiresIn, setExpiresIn] = useState()
 
  useEffect(() => {
    console.log("Inside Spotify Login Effect");
    axios
      .post("http://localhost:4000/spotifyLogin", {
        code,
      })
      .then(res => {
        //console.log("Spotify Login Response", res.data);
        setAccessToken(res.data.accessToken)
        setRefreshToken(res.data.refreshToken)
        setExpiresIn(res.data.expiresIn)
        const tokenData = {
          accessToken: res.data.accessToken,
          refreshToken: res.data.refreshToken,
          expiresIn: res.data.expiresIn,
        };
        localStorage.setItem('authTokens', JSON.stringify(tokenData));
        console.log(tokenData)
        window.history.pushState({}, null, "/")
        
      })
      
      .catch((error) => {
        console.error("Spotify Login Error", error);
        //window.location = "/"
      })
  }, [code]
  )
  //console.log(refreshToken);
 // console.log(accessToken);

  useEffect(() => {
    if (!refreshToken || !expiresIn) return
    const interval = setInterval(() => {
      axios
        .post("http://localhost:4000/refresh", {
          refreshToken,
        })
        .then(res => {
          setAccessToken(res.data.accessToken)
          setExpiresIn(res.data.expiresIn)
         
        })
        .catch(() => {
         // window.location = "/"
        })
    }, (expiresIn - 60) * 1000)

    return () => clearInterval(interval)
  }, [refreshToken, expiresIn])
 

  return accessToken
}