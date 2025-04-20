import  { useState } from 'react';
import '../styles/QuestionMeals.css';
import MiliBotLauncher from './MiliBotLauncher'; // ✅ Import MiliBotLauncher

function QuestionMeals() {
  const [formData, setFormData] = useState({
    Age: '',
    Gender: 'Male',
    Weight_Goal: 'Weight Loss',
    Health_Condition: 'None',
    Diet_Type: 'Veg',
    Activity_Level: 'Moderate'
  });

  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('http://3.109.200.236:8080/api/recommend', 
        {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      setRecommendations(data.recommendations);
    } catch (err) {
      console.error('Error:', err);
    }

    setLoading(false);
  };

  const handleRegenerate = () => {
    setFormData({
      Age: '',
      Gender: 'Male',
      Weight_Goal: 'Weight Loss',
      Health_Condition: 'None',
      Diet_Type: 'Veg',
      Activity_Level: 'Moderate'
    });
    setRecommendations(null);
  };

  const handleAccept = async () => {
    try {
      await fetch('http://3.109.200.236:8080/api/logMealPlan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: localStorage.getItem("username"),
          recommendations
        })
      });
      alert(" Meal plan saved to Meal Log!");
    } catch (err) {
      console.error("Error logging meal plan:", err);
      alert(" Failed to save meal plan.");
    }
  };

  const handleExport = () => {
    const printable = `
      <h2>AI-Powered Meal Plan</h2>
      ${Object.entries(recommendations).map(([mealType, meals]) => `
        <h3>${mealType.toUpperCase()}</h3>
        <ul>${meals.map(m => `<li>${m}</li>`).join("")}</ul>
      `).join("")}
    `;

    const win = window.open("", "_blank");
    win.document.write(`
      <html>
        <head>
          <title>Meal Plan PDF</title>
        </head>
        <body>${printable}</body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <div className="question-meals-wrapper">
      <div className="questionnaire">
        <h2> Personalized Meal Plan Questionnaire</h2>

        <form onSubmit={handleSubmit}>
          <label>
            Age:
            <input type="number" name="Age" value={formData.Age} onChange={handleChange} required />
          </label>

          <label>
            Gender:
            <select name="Gender" value={formData.Gender} onChange={handleChange}>
              <option>Male</option>
              <option>Female</option>
            </select>
          </label>

          <label>
            Weight Goal:
            <select name="Weight_Goal" value={formData.Weight_Goal} onChange={handleChange}>
              <option>Weight Loss</option>
              <option>Weight Gain</option>
              <option>Maintain</option>
            </select>
          </label>

          <label>
            Health Condition:
            <select name="Health_Condition" value={formData.Health_Condition} onChange={handleChange}>
              <option>None</option>
              <option>Diabetes</option>
              <option>Hypertension</option>
              <option>PCOS</option>
            </select>
          </label>

          <label>
            Diet Type:
            <select name="Diet_Type" value={formData.Diet_Type} onChange={handleChange}>
              <option>Veg</option>
              <option>Non-Veg</option>
            </select>
          </label>

          <label>
            Activity Level:
            <select name="Activity_Level" value={formData.Activity_Level} onChange={handleChange}>
              <option>Sedentary</option>
              <option>Moderate</option>
              <option>Active</option>
            </select>
          </label>

          <button type="submit"> Get Meal Plan</button>
        </form>

        {loading && <p style={{ textAlign: 'center' }}>Generating recommendations...</p>}

        {recommendations && (
          <>
            <div className="recommendations">
              <h3> Your Personalized Meal Recommendations</h3>

              <div className="meal-groups">
                {Object.entries(recommendations).map(([mealType, meals]) => (
                  <div className="meal-group" key={mealType}>
                    <h4> {mealType.charAt(0).toUpperCase() + mealType.slice(1)}</h4>
                    <div className="meal-cards">
                      {meals.map((dish, i) => (
                        <div className="meal-card" key={i}>
                          <div className="dish-name">{dish}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="action-buttons">
                <button className="secondary-button" onClick={handleRegenerate}>
                   Regenerate Plan
                </button>
                <button className="primary-button" onClick={handleAccept}>
                   Accept & Save to Meal Log
                </button>
                <button className="primary-button" onClick={handleExport}>
                   Export to PDF
                </button>
              </div>
            </div>

            <div className="news-section">
              <h3> Latest Food News</h3>

              <div className="news-item">
                <a href="https://www.reuters.com/world/india/india-receive-above-average-monsoon-rains-2025-government-says-2025-04-15/" target="_blank" rel="noopener noreferrer">
                  India forecasts above average monsoon rains for 2025 
                </a>
                <p>Expected monsoons will impact food production and crop yield.</p>
              </div>

              <div className="news-item">
                <a href="https://www.reuters.com/sustainability/land-use-biodiversity/indias-government-sugar-industry-face-off-over-jute-bags-2025-04-15/" target="_blank" rel="noopener noreferrer">
                  Govt vs Sugar Industry on Jute Bag Usage 
                </a>
                <p>Legal debate arises over eco-friendly jute packaging for food transport.</p>
              </div>

              <div className="news-item">
                <a href="https://www.reuters.com/world/india/indias-march-retail-inflation-eases-334-yy-2025-04-15/" target="_blank" rel="noopener noreferrer">
                  Food inflation drops to 5-year low 
                </a>
                <p>Retail prices fall as food costs stabilize in early 2025.</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ✅ Floating chatbot button (Mili) only visible on this page */}
      <MiliBotLauncher />
    </div>
  );
}

export default QuestionMeals;
