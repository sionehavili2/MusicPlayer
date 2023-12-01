import { useState, useEffect} from "react";

const RoomControl = (props) => 
{
    console.log("roomcontrol");
    console.log(props);
    return (
        <>
            <>{props.isHost ? <h3>Host Controls</h3> : <h5>Host Settings</h5>}</>
            <div>  
                <>{props.isHost &&<>Play/Pause Controls : {" "}<button isDisabled={true} onClick={()=>{props.onUpdateControls({isHostControl: !props.isHostControl, audioOutput: props.audioOutput})}}> {props.isHostControl ? "Host Only" : "All Members"}</button></>}</>
                <>{!props.isHost &&<div>Play/Pause Controls : {" "}{props.isHostControl ? "Host Only" : "All Members"}</div>}</>
            </div>

            <div>
                <>{props.isHost && <>Audio Output : {" "}<button onClick={()=>{props.onUpdateControls({isHostControl: props.isHostControl, audioOutput: (props.audioOutput === "all" ? "hostOnly" : "all")})}}>{props.audioOutput}</button></>}</>
                <>{!props.isHost && <div>Audio Output : {" "}{props.audioOutput}</div>}</>
            </div>

        </>
    );

}

export default RoomControl;

// import { useState, useEffect} from "react";

// const RoomControl = (props) => 
// {

//     return (
//         <>
//             <>{props.isHost ? <h3>Host Controls</h3> : <h5>Host Settings</h5>}</>

//             <div>
                
//                 <>{props.isHost &&<>Play/Pause Controls : {" "}<button onClick={()=>{props.onUpdateControls({isHostControl: !props.isHostControl, audioOutput: props.audioOutput})}}>{props.isHostControl ? "Host Only" : "All Members"}</button></>}</>
//                 <>{!props.isHost &&<div>Play/Pause Controls : {" "}{props.isHostControl ? "Host Only" : "All Members"}</div>}</>
//             </div>

//             <div>
//                 <>{props.isHost && <>Audio Output : {" "}<button onClick={()=>{props.onUpdateControls({isHostControl: props.isHostControl, audioOutput: (props.audioOutput === "all" ? "hostOnly" : "all")})}}>{props.audioOutput}</button></>}</>
//                 <>{!props.isHost && <div>Audio Output : {" "}{props.audioOutput}</div>}</>
//             </div>
//         </>
//     );
// }

// export default RoomControl;