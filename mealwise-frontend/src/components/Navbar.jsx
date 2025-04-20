
import { Link, useLocation } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/" className="logo-link">MealWise</Link>
      </div>

      <div className="nav-links">
        {isDashboard ? (
          <Link to="/profile" className="nav-btn">Profile</Link>
        ) : (
          <Link to="/about" className="nav-btn">About Us</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
