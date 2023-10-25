
import React, { useState, useRef, useEffect } from 'react';
import SimplePeer from 'simple-peer';

const Sender = () => {

    const audioElement = useRef(null);
    
    // const [usersAudioList, setUsersAudioList] = useState();
    // const audioElement = document.getElementById('audioPlayer');
    // const audioStream = audioElement.captureStream();

    // /* 1. *********** Permission Request to control user's media devices ***************/

    // //Function that will request Permissions from users
    // const openUserAudioDevices = async (constraints) => {return await navigator.mediaDevices.getUserMedia(constraints);}
    
    // //Request Audio Permissions
    // try 
    // { 
    //     const stream = openUserAudioDevices({'audio':true});
    //     console.log('Got MediaStream:', stream);
    // }
    // //Report Audio Request Failure 
    // catch(error) 
    // {
    //     console.error('Error accessing media devices.', error);
    // }



    // /* 2. **********  Returns all connected audio devices ***************/
    // async function getConnectedDevices(type) 
    // {
    //     const devices = await navigator.mediaDevices.enumerateDevices();
    //     return devices.filter(device => device.kind === type)
    // }


    // /* 3. ********** Updates state of all connected user audio devices ******/
    // function getAudioDeviceList ()
    // {
    //     const allAudioDevices = getConnectedDevices('audiooutput');
    //     setUsersAudioList(allAudioDevices);
    //     console.log('audio (controls) devices updated... passed: ' + allAudioDevices + " === " + usersAudioList);
    // }


    // /* 4. ********* Listener for changes to audio devices and update the list accordingly **********/
    // navigator.mediaDevices.addEventListener('devicechange', event => 
    // {
    //     const newAudioList = getConnectedDevices('audio');
    //     setUsersAudioList(newAudioList);
    // });


    // /* 5. Local Playback. Once you have the stream. assign it to a video or audio element to play locally **************************/
    // async function playAudioFromMusicStream() 
    // {
    //     try 
    //     {
    //         const stream = await navigator.mediaDevices.getUserMedia({'audio': true});
    //         const audioElement = document.getElementById('audioPlayer');
    //         audioElement.srcObject = stream;
    //     } 
    //     catch(error) 
    //     {
    //         console.error('Error opening video camera.', error);
    //     }
    // }

    return <audio ref={audioElement} controls autoplay></audio>


};

export default Sender;
