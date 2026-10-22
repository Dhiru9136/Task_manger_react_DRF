import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Css/Login.css";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = async (event) => {
    event.preventDefault();

    const response = await fetch(
      "http://127.0.0.1:8000/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      }
    );

    const result = await response.json();

    if (response.ok) {
      localStorage.setItem(
        "access_token",
        result.access_token
      );

      // alert("Login successful");

      navigate("/dashboard");
    } else {
      alert(result.message || "Invalid username or password");
    }
  };

  return (
    <div className="login-container">

      <div className="login-box">

        <h1>Task Manager</h1>
        <h2>Login</h2>

        <form onSubmit={loginUser}>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="login-btn"
          >
            Login
          </button>

        </form>

        <p className="register-text">
          Don't have an account?
        </p>

        <button
          onClick={() => navigate("/register")}
          className="register-btn"
        >
          Register
        </button>

      </div>

    </div>
  );
}

export default Login;