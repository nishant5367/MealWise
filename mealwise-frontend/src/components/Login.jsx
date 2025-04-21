import  { useState } from "react";
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
    setError("");

    const username = email.split("@")[0];

    const params = {
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: "38ml86305n6s418eu5h4dc7vua",
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    };

    try {
      const result = await cognito.initiateAuth(params).promise();
      console.log(" Login successful:", result);
      alert("Login successful!");

      const idToken = result.AuthenticationResult?.IdToken;

      //  Store tokens and user info in localStorage
      localStorage.setItem("username", username);
      localStorage.setItem("email", email);
      localStorage.setItem("idToken", idToken); // ✅ Needed for Lex authentication
      localStorage.setItem("name", username);   // Optional alias for greeting

      //  Check if questionnaire was submitted
      const response = await fetch(`https://3.109.200.236/api/questionnaire/status/${username}`);

      if (!response.ok) throw new Error(`Status check failed: ${response.status}`);

      const hasSubmitted = await response.json();

      
      if (hasSubmitted) {
        navigate("/dashboard");
      } else {
        navigate("/questionnaire");
      }

    } catch (err) {
      console.error(" Login failed:", err);

      if (err.message?.includes("Status check failed")) {
        setError("Couldn't verify account setup. Please try again.");
      } else if (err.code === "NotAuthorizedException") {
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
        Don&apos;t have an account?{" "}
        <span className="toggle-link" onClick={() => navigate("/signup")}>
          Sign Up
        </span>
      </p>
    </div>
  );
};

export default Login;
