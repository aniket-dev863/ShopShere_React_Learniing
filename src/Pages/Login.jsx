import React, { useEffect, useState } from "react";
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
    localStorage.setItem("AccessToken", data.accessToken);
  };
  useEffect(() => {
    const token = localStorage.getItem("AccessToken");
    console.log(`Here is the Access Token Present ${token}`);
  }, []);
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
