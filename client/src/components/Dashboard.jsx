import React from "react";
import useAuth from "./useAuth";

export default function Dashboard({ code }) {
    const accessToken = useAuth(code);
    console.log(code);
    return (
      <div>
        
        {code}
      </div>
    );
  }