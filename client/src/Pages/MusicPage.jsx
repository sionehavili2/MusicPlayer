import Rooms from "./Rooms";
import Dashboard from "../components/Dashboard";
import RandomPlaylist from "../components/RandomPlaylist";
import SpotifyAuth  from "../components/spotifyAuth";

function MusicPage() {

    return(
        <div>
        <SpotifyAuth />
           {/* <Rooms />  */}
           {/* <Dashboard />    */}
        </div>
    )
}

export default MusicPage;