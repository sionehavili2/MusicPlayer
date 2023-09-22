import "./App.css";
import { Routes, Route } from "react-router-dom";
import HomePage from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import 'bootstrap/dist/css/bootstrap.min.css'
import SpotifyAuth  from "./components/spotifyAuth";
import Dashboard from "./components/Dashboard";


const code = new URLSearchParams(window.location.search).get('code')


function App() {
  return code ? <Dashboard code ={code} /> : 
    <div>
      <Routes>
        <Route path="" element={<HomePage />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        
      </Routes>
      <SpotifyAuth />
    </div>
  
}

export default App;
