import { useState, useEffect } from 'react';
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
// import  { useState } from "react";
// import PropTypes from "prop-types";
// import { Plus, Trash2, Pencil } from "lucide-react";
// import "../styles/MealLogPage.css"; // your CSS file

// const Button = ({ children, className = "", variant = "default", ...props }) => {
//   const base = "btn";
//   const variants = {
//     default: "default",
//     outline: "outline",
//     ghost: "ghost",
//   };
//   return (
//     <button
//       className={`${base} ${variants[variant]} ${className}`}
//       {...props}
//     >
//       {children}
//     </button>
//   );
// };

// const Card = ({ children, className = "" }) => (
//   <div className={`meal-card ${className}`}>{children}</div>
// );

// const CardContent = ({ children, className = "" }) => (
//   <div className={`meal-card-content ${className}`}>{children}</div>
// );

// const Input = ({ className = "", ...props }) => (
//   <input className={`modal-input ${className}`} {...props} />
// );

// Button.propTypes = {
//   children: PropTypes.node.isRequired,
//   className: PropTypes.string,
//   variant: PropTypes.oneOf(["default", "outline", "ghost"]),
// };

// Card.propTypes = {
//   children: PropTypes.node,
//   className: PropTypes.string,
// };

// CardContent.propTypes = {
//   children: PropTypes.node,
//   className: PropTypes.string,
// };

// Input.propTypes = {
//   className: PropTypes.string,
// };

// const meals = [
//   { name: "Morning Snack", target: 200 },
//   { name: "Lunch", target: 400 },
//   { name: "Evening Snack", target: 200 },
//   { name: "Dinner", target: 400 },
// ];

// const MealLogPage = () => {
//   const [logs, setLogs] = useState({});
//   const [showModal, setShowModal] = useState(null);
//   const [editIndex, setEditIndex] = useState(null);

//   const handleAdd = (meal, food) => {
//     const updated = { ...logs };
//     if (!updated[meal]) updated[meal] = [];
//     if (editIndex !== null) {
//       updated[meal][editIndex] = food;
//     } else {
//       updated[meal].push(food);
//     }
//     setLogs(updated);
//     setShowModal(null);
//     setEditIndex(null);
//   };

//   const handleDelete = (meal, index) => {
//     const updated = { ...logs };
//     updated[meal].splice(index, 1);
//     setLogs(updated);
//   };

//   const handleEdit = (meal, index) => {
//     const food = logs[meal][index];
//     setShowModal(meal);
//     setEditIndex(index);
//     setTimeout(() => {
//       document.getElementById("food-name").value = food.name;
//       document.getElementById("food-cal").value = food.calories;
//       document.getElementById("food-qty").value = food.qty;
//       document.getElementById("food-unit").value = food.unit;
//     }, 0);
//   };

//   const getTotalCalories = () =>
//     Object.values(logs).flat().reduce((sum, item) => sum + Number(item.calories || 0), 0);

//   const getMealCalories = (meal) =>
//     logs[meal]?.reduce((sum, item) => sum + Number(item.calories || 0), 0) || 0;

//   const totalTarget = meals.reduce((sum, m) => sum + m.target, 0);
//   const totalConsumed = getTotalCalories();
//   const totalPercent = Math.min((totalConsumed / totalTarget) * 100, 100);

//   return (
//     <div className="meal-log-container">
//       <h1 className="heading">Log Your Meals</h1>

//       <div className="total-bar-wrapper">
//         <p>
//           Total Calories Today: <strong>{totalConsumed} Cal</strong> / {totalTarget} Cal
//         </p>
//         <div className="total-bar">
//           <div
//             className="total-fill"
//             style={{ width: `${totalPercent}%` }}
//           ></div>
//         </div>
//       </div>

//       {meals.map(({ name: meal, target }) => {
//         const consumed = getMealCalories(meal);
//         const percent = Math.min((consumed / target) * 100, 100);
//         return (
//           <Card key={meal}>
//             <CardContent>
//               <div className="meal-header">
//                 <span className="meal-title">{meal}</span>
//                 <Button variant="outline" onClick={() => {
//                   setShowModal(meal);
//                   setEditIndex(null);
//                 }}>
//                   <Plus size={16} />
//                 </Button>
//               </div>
//               <p>{consumed} / {target} Cal</p>
//               <div className="progress-bar">
//                 <div
//                   className="progress-fill"
//                   style={{ width: `${percent}%` }}
//                 ></div>
//               </div>
//               <p className="meal-desc">
//                 {meal === "Morning Snack"
//                   ? "Get energized by grabbing a morning snack."
//                   : meal === "Lunch"
//                   ? "Don't miss lunch! It's time to get a tasty meal."
//                   : meal === "Evening Snack"
//                   ? "Refuel your body with a delicious evening snack."
//                   : "An early dinner can help you sleep better."}
//               </p>

//               {logs[meal]?.map((item, idx) => (
//                 <div key={idx} className="meal-item">
//                   <span>{item.name} — {item.calories} Cal ({item.qty} {item.unit})</span>
//                   <div className="meal-item-actions">
//                     <Button variant="ghost" onClick={() => handleEdit(meal, idx)}>
//                       <Pencil size={16} />
//                     </Button>
//                     <Button variant="ghost" onClick={() => handleDelete(meal, idx)}>
//                       <Trash2 size={16} />
//                     </Button>
//                   </div>
//                 </div>
//               ))}
//             </CardContent>
//           </Card>
//         );
//       })}

//       {showModal && (
//         <div className="modal-overlay">
//           <div className="modal-box">
//             <h3>{editIndex !== null ? "Edit Food" : `Add Food to ${showModal}`}</h3>
//             <Input placeholder="Food name" id="food-name" />
//             <Input placeholder="Calories" id="food-cal" />
//             <div className="flex-gap">
//               <Input placeholder="Qty" id="food-qty" />
//               <Input placeholder="Unit" id="food-unit" />
//             </div>
//             <div className="flex-gap" style={{ justifyContent: "flex-end", marginTop: "1rem" }}>
//               <Button variant="outline" onClick={() => {
//                 setShowModal(null);
//                 setEditIndex(null);
//               }}>Cancel</Button>
//               <Button onClick={() =>
//                 handleAdd(showModal, {
//                   name: document.getElementById("food-name").value,
//                   calories: document.getElementById("food-cal").value,
//                   qty: document.getElementById("food-qty").value,
//                   unit: document.getElementById("food-unit").value,
//                 })
//               }>
//                 {editIndex !== null ? "Update" : "Add"}
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MealLogPage;
