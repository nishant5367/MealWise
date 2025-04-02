import "../styles/Dashboard.css"; 
import CalorieCounter from "../assets/CalorieCount.jpg";
import MealPlanner from "../assets/MealPlan.jpg";
import { Link } from "react-router-dom"; // ✅ Add this import

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h2>Welcome to MealWise – Your AI-Powered Nutrition Companion!</h2>
      <p className="tagline">Effortless meal tracking and personalized AI-driven nutrition plans tailored just for you.</p>

      <div className="options">
        <div className="option-card">
          <img src={CalorieCounter} alt="Calorie Counter" />
          <h3>Log Your Food</h3>
          <p>Track your daily meals and calculate calories easily.</p>
          <Link to="/meallog">
            <button className="action-button">Start Logging</button>
          </Link>
        </div>

        <div className="option-card">
          <img src={MealPlanner} alt="Healthy meals" />
          <h3>AI Meal Plan</h3>
          <p>Get AI-generated meal plans and recommendations.</p>
          <button className="action-button">Get Meal Plan</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
