import React, { useState, useContext } from "react";
import AuthContext from "../Context/AuthContext";
import "../App.css";
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { setToken } = useContext(AuthContext);

  const login = async () => {
    const response = await fetch("https://dummyjson.com/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    const data = await response.json();

    console.log(data);

    setToken(data.accessToken);

    localStorage.setItem("AccessToken", data.accessToken);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Welcome Back</h1>

        <p className="login-subtitle">Login to your ShopSphere account</p>

        <div className="login-form">
          <div className="form-group">
            <label className="form-label">Username</label>

            <input
              className="form-input"
              type="text"
              name="userName"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>

            <input
              className="form-input"
              type="password"
              name="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>

          <button type="button" className="login-button" onClick={login}>
            LOGIN
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
