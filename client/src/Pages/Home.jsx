import NavigationBar from "../components/Navigation";
import Hello from "../components/HelloWorld";
import SocketProvider from "../components/SocketProvider";
import Rooms from "./Rooms";
import classes from "./Home.module.css";
function HomePage() {
  return (
    <div>
      <NavigationBar />
      <div className={classes.homeContainer}>
        <h1>At least 4</h1>
      </div>
      <div className={classes.github}>
        <a
          href="https://github.com/sionehavili2/MusicPlayer"
          target="_blank"
          rel="noopener noreferrer"
        >
          Check out our Repo
        </a>
        <br />
      </div>
      <div className={classes.image}>
        <img
          src="https://preview.redd.it/iuhykaaln5961.jpg?width=640&crop=smart&auto=webp&s=a64349b75616ff5c9fde107118545b834492edac"
          alt="This could be you"
          style={{ maxWidth: "100%", marginTop: "10px" }}
        />
      </div>
    </div>
  );
}

export default HomePage;
