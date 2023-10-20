import React, {useState, useEffect} from 'react'
import {Card, Button} from 'antd'
import axios from 'axios'
import NavigationBar from "../components/Navigation";

//npx create-react-app
//npm install antd
//npm install axios


const {Meta} = Card;

function NewsApi() {
  // const [news, setNews] = useState([]);
  const [posts, setPosts] = useState([]);

  // useEffect(()=> {
  //   const loadNews = async () => {
  //     const response = await axios.get(
  //       "http://newsapi.org/v2/top-headlines?country=us&category=entertainment&apiKey=77d4ca45dba14d37807355344addcfc5"
  //     );
  //     setNews(response.data.articles);
  //   };
  //   loadNews();
  // },[]);

  useEffect(() => {
    console.log("HERE!");
    const getPosts = async () => {
      console.log("Requesting posts");
      const response = await axios.get("http://localhost:4000/posts");
      console.log(response.data[0]);
      // setPosts(response.data.posts); 
    };
    getPosts();
  }, []);


  // console.log("posts:\n",posts);

//   return (
//     <div className='App'>
//       <NavigationBar />
//       {news &&
//         news.map((item,index) => {
//           return (
            
            
//             // <Card 
//             // key={index}
//             // hoverable
//             // style={{width: "70%"}}
//             // conver={<img alt="" src={item.urlToImage}/>} 
//             // >
//             //   <Meta title={item.title} description={item.content}/>
//             //   <a href={item.url} target="_blank" rel={"noopener noreferrer"}>
//             //     <Button type="primary" style={{marginTop: "10px"}}>
//             //       Read More
//             //     </Button>
//             //   </a>
//               <button onClick={()=>{sendLikeToServer()}}>Like</button>
//             /* </Card> */
//           );
//         })}

//     </div>
//   );
}

export default NewsApi;
