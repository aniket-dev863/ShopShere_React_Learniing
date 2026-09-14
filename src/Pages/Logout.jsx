import React from "react";
import { useContext } from "react";
import "../App.css";
import AuthContext from "../Context/AuthContext";
function Logout() {
  const { setToken } = useContext(AuthContext);
  const logout = () => {
    localStorage.removeItem("AccessToken");
    setToken(null);
  };
  return (
    <>
      <button type="button" className="logout-button" onClick={logout}>
        Logout
      </button>
    </>
  );
}

export default Logout;
