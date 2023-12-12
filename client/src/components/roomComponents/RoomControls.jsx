import { useState, useEffect} from "react";
import classes from "./RoomControls.module.css"

const RoomControl = (props) => 
{    return (<>
        
        <>{!props.host &&       
          <div className={classes.mainContainer}>
            <h4>NO HOST</h4>
            <div>
                <button  className={classes.hostBtn} onClick={()=>{props.onBeHost()}}>Be Host</button>
            </div>
          </div>
        }</>
        <div className={classes.mainContainer}>
            <h4>{props.isHost ? "Host Controls" : "Host Settings"}</h4>
            <div>  
                <>{props.isHost &&<>Play/Pause Controls : {" "}<button className={classes.button} isDisabled={true} onClick={()=>{props.onUpdateControls({isHostControl: !props.isHostControl, audioOutput: props.audioOutput})}}> {props.isHostControl ? "Host Only" : "All Members"}</button></>}</>
                <>{!props.isHost &&<div>Play/Pause Controls : {" "}{props.isHostControl ? "Host Only" : "All Members"}</div>}</>
            </div>

            <div>
                {props.isHost && <>Audio Output : {" "}<button className={classes.button} onClick={()=>{props.onUpdateControls({isHostControl: props.isHostControl, audioOutput: (props.audioOutput === "all" ? "hostOnly" : "all")})}}>{props.audioOutput}</button></>}
                {!props.isHost && <div>Audio Output : {" "}{props.audioOutput}</div>}
            </div>

        </div>
    </>);

}

export default RoomControl;
