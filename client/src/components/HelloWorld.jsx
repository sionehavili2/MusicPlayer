import { useEffect, useState } from "react";
import axios from "axios";

function Hello() {
  const [message, setMessage] = useState("");

  useEffect(() => {

  })
  const handleSubmit = async (e) => {
    console.log("Clicked")
    e.preventDefault();

    axios
      .get("http://localhost:4000/helloworld")
      .then((response) => {
        setMessage(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  
  return (
    <>
      <button onClick={handleSubmit}>Click Me</button>
      <br />
       <p>{message}</p>
    </>
  );
}

export default Hello;
