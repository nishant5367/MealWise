import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import About from "./components/About";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import Questionnaire from "./components/Questionnaire";
import Profile from "./components/Profile"; // ✅ Import Profile
import MealLog from "./components/MealLog";


const AppRoutes = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/questionnaire" element={<Questionnaire />} />
        <Route path="/meallog" element={<MealLog/>}/>
        <Route
          path="/profile"
          element={
            <Profile
              user={{
                name: "Jane Doe",
                email: "jane@example.com",
                age: 30,
                goal: "Maintain weight",
                activity: "Light",
                diet: "Vegan",
                allergies: "None",
                calorieTarget: 1800,
                avatar: ""
              }}
            />
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
