import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "bootstrap/dist/css/bootstrap.css";

const NavigationBar = () => {
  return (
    <Navbar bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="/">Ear book</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="Login">Login</Nav.Link>
          <Nav.Link href="Register">Register</Nav.Link>
          <Nav.Link href="spotifyAuth">Spotify Login</Nav.Link>
          <Nav.Link href="Music">Music</Nav.Link>
          <Nav.Link href="Rooms">Rooms</Nav.Link>
          <Nav.Link href="News">News</Nav.Link>
          {/* <Nav.Link href="How-To-Play">How-to-Play</Nav.Link>
          <Nav.Link href="deck">Deck</Nav.Link>
          <Nav.Link href="Scores">Scores</Nav.Link> */}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
