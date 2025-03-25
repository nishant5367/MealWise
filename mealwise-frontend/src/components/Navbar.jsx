import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
       {/* Clickable Logo to redirect to home page */}
       <div className="logo">
        <Link to="/" className="logo-link">MealWise</Link>
      </div>
      <div className="nav-links">
        <Link to="/about" className="about-btn">About Us</Link>
      </div>
    </nav>
  );
};

export default Navbar;
