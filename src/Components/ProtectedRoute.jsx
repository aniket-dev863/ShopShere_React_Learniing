import { useContext } from "react";
import React from "react";
import AuthContext from "../Context/AuthContext";
import { Navigate } from "react-router-dom";
function ProtectedRoute({ children }) {
  const { token, authLoading } = useContext(AuthContext);

  //console.log("ProtectedRoute token:", token);
  if (authLoading === true) {
    return (
      <>
        <h1>Loading Auth Data</h1>
      </>
    );
  } else {
    if (token === null) {
      //console.log("Im Here");
      return <Navigate to="/login" replace />;
    }

    return children;
  }
}

export default ProtectedRoute;
