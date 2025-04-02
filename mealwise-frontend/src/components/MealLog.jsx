import React, { useState, useEffect } from 'react';
// import '../styles/Profile.css'; // Reusing your dashboard-style CSS
import '../styles/MealLog.css';


const MealLog = () => {
  const [meal, setMeal] = useState('');
  const [food, setFood] = useState('');
  const [calories, setCalories] = useState('');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const username = localStorage.getItem("username");

  // Fetch meals from backend
  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://to61j7m685.execute-api.us-east-1.amazonaws.com/prod/meals/${username}`);
      const data = await response.json();
      if (response.ok) {
        setLogs(data.meals || []);
      } else {
        console.error("Failed to fetch logs:", data);
        setLogs([]);
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Submit new meal
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      username,
      meal,
      food,
      calories,
      timestamp: new Date().toISOString(),
    };

    try {
      const res = await fetch("https://to61j7m685.execute-api.us-east-1.amazonaws.com/prod/log-meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.text();

      if (res.ok) {
        alert("✅ Meal logged!");
        setMeal('');
        setFood('');
        setCalories('');
        fetchLogs();
      } else {
        alert("❌ Failed to log meal:\n" + result);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("❌ Error logging meal.");
    }
  };

  return (
    <div className="meallog-wrapper">
      <h2 className="meallog-heading">Log Your Meals</h2>
  
      <div className="meallog-dashboard">
        {/* Meal Input Form */}
        <div className="meallog-tile form-tile">
          <h3>Meal Entry</h3>
          <form onSubmit={handleSubmit}>
            <input 
              type="text" 
              value={meal} 
              onChange={(e) => setMeal(e.target.value)} 
              placeholder="Meal (e.g., Lunch)" 
              required 
            />
            <input 
              type="text" 
              value={food} 
              onChange={(e) => setFood(e.target.value)} 
              placeholder="Food Item" 
              required 
            />
            <input 
              type="number" 
              value={calories} 
              onChange={(e) => setCalories(e.target.value)} 
              placeholder="Calories" 
              required 
            />
            <button type="submit">Submit</button>
          </form>
        </div>
  
        {/* Meal Logs */}
        <div className="meallog-tile logs-tile">
          <h3>Logged Meals</h3>
          {loading ? (
            <p>Loading logs...</p>
          ) : logs.length === 0 ? (
            <p>No meals logged yet.</p>
          ) : (
            <ul>
              {logs.map((entry, idx) => (
                <li key={idx}>
                  <strong>{entry.meal}</strong>: {entry.food} — {entry.calories} kcal<br />
                  <small>{new Date(entry.timestamp).toLocaleString()}</small>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
  
};

export default MealLog;
