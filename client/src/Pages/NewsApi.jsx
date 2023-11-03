import React, {useState, useEffect} from 'react'
import {Card, Button} from 'antd'
import axios from 'axios'
import NavigationBar from "../components/Navigation";

//npx create-react-app
//npm install antd
//npm install axios


const {Meta} = Card;

function NewsApi() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getPosts = async () => {
      console.log("Requesting posts");
      const response = await axios.get("http://localhost:4000/posts");
      console.log(response.data);
      setPosts(response.data); 
    };
    getPosts();
  }, []);

  const handleLike = async (id) => {
    console.log("Post", id, "liked");
    await axios.post("http://localhost:4000/likePost", { id });
  }

  console.log("Posts: ", posts)

  return (
    <div className='App'>
      <NavigationBar />
      {posts &&
        posts.map((item,index) => {
          return (
            
            
            <Card 
            key={index}
            hoverable
            style={{width: "70%"}}
            >
              <Meta title={item._id}/>
              <h1>{item.body}</h1>
              <button onClick={()=>{handleLike(item._id)}}>Like</button>
              <h2>{item.likes}</h2>
            </Card>
          );
        })}

    </div>
  );
}

export default NewsApi;
