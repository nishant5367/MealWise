// Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import cognito from "../cognitoConfig";
import "../styles/Auth.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message

    const username = email.split('@')[0];  // Extract the username from the email

    const params = {
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: "38ml86305n6s418eu5h4dc7vua",  // Your App Client ID
        AuthParameters: {
            USERNAME: username,  // Try using the username part instead of the full email
            PASSWORD: password,
        },
    };

    try {
        const result = await cognito.initiateAuth(params).promise();
        console.log("Login successful:", result);
        alert("Login successful!");
        navigate("/dashboard");
    } catch (err) {
        console.error("Login failed:", err);

        if (err.code === "NotAuthorizedException") {
            setError("Incorrect username or password.");
        } else if (err.code === "UserNotFoundException") {
            setError("User does not exist. Please sign up first.");
        } else if (err.code === "UserNotConfirmedException") {
            setError("User not confirmed. Please check your email for the verification code.");
        } else {
            setError("Login failed. Please try again.");
        }
    }
};


  return (
    <div className="auth-container">
      <h2>Login to MealWise</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p className="para">
        Don't have an account?{" "}
        <span className="toggle-link" onClick={() => navigate("/signup")}>
          Sign Up
        </span>
      </p>
    </div>
  );
};

export default Login;
