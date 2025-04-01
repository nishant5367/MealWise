import React from 'react';
import '../styles/Profile.css';

const Profile = ({ user }) => {
  return (
    <div className="profile-wrapper">
      <h2 className="profile-heading">User Details</h2>

      <div className="profile-dashboard">
        <div className="dashboard-tile">
          <h3>Account Info</h3>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Age:</strong> {user.age}</p>
          <p><strong>Goal:</strong> {user.goal}</p>
        </div>

        <div className="dashboard-tile">
          <h3>Questionnaire Responses</h3>
          <p><strong>Activity Level:</strong> {user.activity}</p>
          <p><strong>Diet Preference:</strong> {user.diet}</p>
          <p><strong>Allergies:</strong> {user.allergies}</p>
          <p><strong>Calorie Target:</strong> {user.calorieTarget} kcal/day</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
