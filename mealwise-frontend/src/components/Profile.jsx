import React, { useEffect, useState } from 'react';
import '../styles/Profile.css';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState({});
  const [questionnaire, setQuestionnaire] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const username = localStorage.getItem("username");
      const email = localStorage.getItem("email");

      if (!email || !username) {
        console.warn("User not logged in.");
        navigate("/login");
        return;
      }

      setUser({ name: username, email });

      try {
        const response = await fetch(`http://localhost:8080/api/questionnaire/${username}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user questionnaire");
        }

        const data = await response.json();
        setQuestionnaire(data.responses || {});
      } catch (error) {
        console.error("❌ Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="profile-wrapper">
      <h2 className="profile-heading">User Details</h2>

      <div className="profile-dashboard">
        <div className="dashboard-tile">
          <h3>Account Info</h3>
          <p><strong>Username:</strong> {user.name || 'N/A'}</p>
          <p><strong>Email:</strong> {user.email || 'N/A'}</p>
          <p><strong>Age:</strong> {questionnaire["What's your age?"] || 'N/A'}</p>
          <p><strong>Height:</strong> {questionnaire["What's your height (in cms)?"] || 'N/A'} cm</p>
          <p><strong>Weight:</strong> {questionnaire["What's your weight (in kgs)?"] || 'N/A'} kg</p>
          <p><strong>Target Weight:</strong> {questionnaire["What's your target weight?"] || 'N/A'} kg</p>
        </div>

        <div className="dashboard-tile">
          <h3>Questionnaire Responses</h3>
          <p><strong>Meal Preference:</strong> {questionnaire["What's your meal preference?"] || 'N/A'}</p>
          <p><strong>Medical Conditions:</strong> {questionnaire["Any medical conditions you are aware of?"] || 'None'}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
