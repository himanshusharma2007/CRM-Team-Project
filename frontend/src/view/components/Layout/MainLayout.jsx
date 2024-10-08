import React from "react";
import Navbar from "./NavBar";
const MainLayout = ({ children }) => {
  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div>{children}</div>
    </div>
  );
};

export default MainLayout;
