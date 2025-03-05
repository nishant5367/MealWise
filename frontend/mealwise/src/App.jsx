//import React from "react";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <div style={{ width: "100vw", height: "100vh", overflowX: "hidden" }}>
      <Navbar />
      <Dashboard />
    </div>
  );
}

export default App;
