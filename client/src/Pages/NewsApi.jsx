import React, {useState, useEffect} from 'react'
import {Card, Button} from 'antd'
import NavigationBar from "../components/Navigation";



const {Meta} = Card;

function NewsApi(props) {

  const { _id, body, likes, author } = props.apiFetchData;
  const handleLike = (thing) => {props.onSendNewsApiData();}


  return (
  <div className='App'>
    <NavigationBar />
    <Card
      hoverable
      style={{ width: "70%" }}
    >
      <Meta title={_id.$oid} />
      <h1>{body}</h1>
      <button onClick={() => { handleLike(_id.$oid) }}>Like</button>
      <h2>{likes.$numberLong}</h2>
      <p>Author: {author}</p>
    </Card>
  </div>
);
}

export default NewsApi;