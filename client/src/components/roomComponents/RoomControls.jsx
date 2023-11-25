import { useState, useEffect} from "react";

const RoomControl = (props) => 
{
    const [onlyHostControl, setOnlyHostControl] = useState();
    const [onlyHostAudio, setOnlyHostAudio] = useState();

    useEffect(()=>
    {
        props.onUpdateRoomControls([onlyHostAudio,onlyHostControl]);
        
    },[onlyHostAudio, onlyHostControl]);

    return (
        <>
            <div>
                <h3>Host Controls</h3>
                <div>
                    <>Play/Pause Controls : {" "}</>
                    <button onClick={()=>{setOnlyHostControl(!onlyHostControl)}}>{onlyHostControl ? "Host only" : "Open Controls"}</button>
                </div>

                <div>
                    <>Audio Output : {" "}</>
                    <button onClick={()=>{setOnlyHostAudio(!onlyHostAudio)}}>{onlyHostAudio ? "Host Output" : "All Members Output"}</button>
                </div>
            </div>
        </>
    );
}

export default RoomControl;