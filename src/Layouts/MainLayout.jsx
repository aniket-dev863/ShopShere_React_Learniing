import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar";
import React from "react";

function MainLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default MainLayout;
