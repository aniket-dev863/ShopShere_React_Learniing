import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../Context/AuthContext";
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
    <>
      <input
        type="text"
        name="userName"
        id=""
        placeholder="Username"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
        }}
      />
      <input
        type="password"
        name="Password"
        id=""
        placeholder="Password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />

      <button type="submit" onClick={login}>
        LOGIN
      </button>
    </>
  );
}

export default Login;
