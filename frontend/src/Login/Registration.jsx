import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Css/registration.css";

function Register() {

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [email, setEmail] = useState("");
  const [f_name, setFName] = useState("");
  const [l_name, setLName] = useState("");
  const [mobile, setMobile] = useState("");

  const registerUser = async (event) => {

    event.preventDefault();

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            username: username,
            password: password,
            password2: password2,
            email: email,
            f_name: f_name,
            l_name: l_name,
            mobile: mobile,
          }),
        }
      );

      const result = await response.json();

      console.log(result);

      if (response.ok) {

        alert("Registration successful");

        navigate("/");

      } else {

        console.log(result);

        alert(
          result.message ||
          "Registration failed"
        );
      }

    } catch (error) {

      console.error("Registration Error:", error);

      alert("Server se connection nahi ho raha");
    }
  };

  return (
    <div className="register-container">

      <div className="register-box">

        <h1>Task Manager</h1>
        <h2>Create Account</h2>

        <form onSubmit={registerUser}>

          <div className="form-group">
            <label>Username</label>

            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>


          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>


          <div className="form-group">
            <label>Confirm Password</label>

            <input
              type="password"
              placeholder="Confirm password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
            />
          </div>


          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>


          <div className="form-group">
            <label>First Name</label>

            <input
              type="text"
              placeholder="Enter first name"
              value={f_name}
              onChange={(e) => setFName(e.target.value)}
            />
          </div>


          <div className="form-group">
            <label>Last Name</label>

            <input
              type="text"
              placeholder="Enter last name"
              value={l_name}
              onChange={(e) => setLName(e.target.value)}
            />
          </div>


          <div className="form-group">
            <label>Mobile</label>

            <input
              type="text"
              placeholder="Enter mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          </div>


          <button
            type="submit"
            className="register-submit"
          >
            Register
          </button>

        </form>


        <p className="login-text">
          Already have an account?
        </p>

        <button
          className="login-link"
          onClick={() => navigate("/")}
        >
          Login
        </button>

      </div>

    </div>
  );
}

export default Register;