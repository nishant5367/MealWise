import React from "react";
import "../styles/About.css";

const About = () => {
  return (
    <div className="about-page">
      <h1>About MealWise</h1>
      <p>
        Welcome to <strong>MealWise</strong>! Our platform is designed to help you track your meals, plan your nutrition, and reach your health goals effortlessly.
      </p>
      <p>
        At MealWise, we leverage AI-powered solutions to provide personalized meal recommendations, nutrition tracking, and easy meal logging. Whether you want to lose weight, gain muscle, or simply eat healthier, MealWise is here to support you every step of the way.
      </p>
      <h2>Key Features:</h2>
      <ul>
        <li>Chat with AI Bot Mili to get instant meal suggestions and log your food intake.</li>
        <li>Generate smart meal plans based on your personal goals and dietary preferences.</li>
        <li>Track your daily nutrition, including calories and macronutrients.</li>
        <li>Seamless integration with fitness apps and devices.</li>
        <li>Comprehensive analytics and insights to help you stay on track.</li>
      </ul>
      <p>
        Join the MealWise community today and take control of your nutrition journey!
      </p>
    </div>
  );
};

export default About;
