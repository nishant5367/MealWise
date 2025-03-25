import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

const Home = () => {
  const navigate = useNavigate(); // Hook for navigation

  return (
    <div className="home">
      {/* Hero Section */}
      <div className="hero">
        <h1 className="fade-in">Welcome to MealWise</h1>
        <p className="slide-in">AI-Powered Meal Tracking & Nutrition Guidance</p>
        <button className="hero-button bounce" onClick={() => navigate("/login")}>
          Get Started
        </button>
      </div>

      {/* Features Section */}
      <div className="features">
        <h2 className="slide-up">Key Features</h2>
        <div className="features-container">
          <div className="feature-card fade-in">
            <h3>Chat with AI Bot Mili</h3>
            <p>Chat with Mili to help get your food-related queries resolved and log meals.</p>
          </div>
          <div className="feature-card fade-in">
            <h3>Smart Meal Plans</h3>
            <p>Get personalized meal recommendations based on your goals.</p>
          </div>
          <div className="feature-card fade-in">
            <h3>Nutrition Tracking</h3>
            <p>Monitor your daily macros with ease.</p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="cta fade-in">
        <h2>Start Your Healthy Journey with AI</h2>
        <button className="cta-button bounce" onClick={() => navigate("/signup")}>
          Sign Up for Free
        </button>
      </div>
    </div>
  );
};

export default Home;
