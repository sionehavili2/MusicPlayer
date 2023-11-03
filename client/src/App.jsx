import "./App.css";
import { Routes, Route } from "react-router-dom";
import HomePage from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import NewsApi from "./Pages/NewsApi"

function App() {
  return (
    <div>
      <Routes>
        <Route path="" element={<HomePage />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="news" element={<NewsApi/>}/>
      </Routes>
    </div>
  );
}

export default App;
