import { sha256 } from "js-sha256";
import { useState } from "react";
import axios from "axios";
import PasswordCheckList from "react-password-checklist";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../components/Navigation";

const Register = () => {
  // Variables
  let types = [
    { label: "Customer", value: "customer" },
    { label: "Employee", value: "employee" },
    { label: "Admin", value: "admin" },
  ];
  const [type, setType] = useState("Select a User Type");
  const [username, setUsername] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [salt, setSalt] = useState("");
  const navigate = useNavigate();
  let hashed = "";

  function saltUpdate(word) {
    setSalt(word);
  }

  // Handle Changers
  function handleUserTypeChange(e) {
    setType(e.target.value);
  }
  function handleUsernameChange(e) {
    setUsername(e.target.value);
    axios.get("http://localhost:4000/salt").then((res) => {
      saltUpdate(res.data);
      console.log(salt);
    });
    console.log();
  }
  function handlePassword1Change(e) {
    setPassword1(e.target.value);
  }
  function handlePassword2Change(e) {
    setPassword2(e.target.value);
  }
  function hasher(word) {
    const hashed = sha256(word + salt).toString();
    return hashed;
  }

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password1 === password2) {
      hashed = hasher(password1);
    } else {
      alert("Passwords do not match");
      return;
    }
    const user = {
      username: username,
      password: hashed,
      salt: salt,
      type: type,
    };

    // axios request
    await axios
      .post("http://localhost:4000/account", user)
      .then((res) => {
        console.log(
          "The express server response is: " + JSON.stringify(res.data)
        );
        localStorage.setItem("loggedIn", res.data.loggedIn);

        if (res.data.loggedIn) {
          console.log("Logged in!");
          navigate("/loggedin", { replace: true });
        }
      })
      .catch((err) => {
        console.log("Error, couldn't log in here");
        console.log(err.message);
      });
  };

  // Return Code
  return (
    <div>
      <NavigationBar />
      <form onSubmit={handleSubmit}>
        <label>Username: </label>
        <input
          type="text"
          name="username"
          id="username"
          onChange={handleUsernameChange}
        />
        <br />
        <label>Password: </label>
        <input
          type="password"
          name="password1"
          id="password1"
          onChange={handlePassword1Change}
        />
        <br />
        <label>Password: </label>
        <input
          type="password"
          name="password2"
          id="password2"
          onChange={handlePassword2Change}
        />
        <br />
        <PasswordCheckList
          rules={["minLength", "specialChar", "number", "capital"]}
          minLength={5}
          value={password1}
          value2={[password2]}
        />
        <br />
        <select onChange={handleUserTypeChange}>
          <option value="Select a User Type">Select a User Type</option>
          {types.map((type) => (
            <option key={type.label} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        <br />
        <button type="Submit">Submit Profile</button>
      </form>
    </div>
  );
};

export default Register;
