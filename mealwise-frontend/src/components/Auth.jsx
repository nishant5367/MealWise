import React, { useState } from "react";
import "../styles/Auth.css";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-container">
      {/* Navbar Section with Login Button */}
      <nav className="navbar">
        <h2 className="logo">MealWise</h2>
        <button className="login-btn" onClick={() => setIsLogin(true)}>
          Login
        </button>
      </nav>

      <div className="auth-box">
        <h2>{isLogin ? "Welcome Back to MealWise" : "Join MealWise Today"}</h2>
        <p>
          {isLogin
            ? "Log in to track meals and get AI-driven nutrition plans."
            : "Create an account to start tracking meals and receiving meal recommendations."}
        </p>

        <form>
          {!isLogin && <input type="text" placeholder="Full Name" required />}
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <button type="submit" className="auth-button">
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        {/* ✅ Toggle Button for Login & Signup */}
        <div className="switch-container">
          <button className="switch-button" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Create an account" : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
