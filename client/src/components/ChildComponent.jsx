


/// OFFFICIAL DO NOT MODIFY ///////


/************************************************************************************************************************************************************/
import React, {useState, useEffect } from 'react';

//IMPORTANT: call socket talker
import { useSocket } from './SocketProvider'; 

function ChildComponent() {

  //IMPORTANT: grab data from SocketProvider
  const { listenForData, sendDataToServer, initialData } = useSocket();
  const [data, setData] = useState();
  const name = "timmy"

  //IMPORTANT: useEffect
  useEffect(() => 
  {
    //This call back function must be placed in a useEffect()
    listenForData((listenName, newData) => 
    {
      if(listenName === "initialData")
       console.log("ClientFromSocket listen Name:" + listenName); setData(newData); 
    });
  }, [listenForData]);

  const handleClick = () => 
  {
    // Send data to the server
    sendDataToServer(name,'Data from child component');
  };

  return (
    <div>
      <h2>ChildComponent</h2>
      <p>Initial Data: {JSON.stringify(initialData)}</p>
      <p>Data received: {JSON.stringify(data)}</p>
      <button onClick={handleClick}>Send Data to Server</button>
    </div>
  );
}

export default ChildComponent;

/************************************************************************************************************************************************************ */