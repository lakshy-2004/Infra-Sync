import React from "react";
const Layout = ({ children }) => (
  <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
    {children}
  </div>
);
export default Layout;
