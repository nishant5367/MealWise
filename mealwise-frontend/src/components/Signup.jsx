// Signup.jsx
import  { useState } from "react";
import { useNavigate } from "react-router-dom";
import cognito from "../cognitoConfig";
import "../styles/Auth.css";

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");  // Reset error before attempting signup

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    const params = {
      ClientId: "38ml86305n6s418eu5h4dc7vua",  // Your App Client ID
      Username: email.split('@')[0],  // Use a simple username (not an email)
      Password: password,
      UserAttributes: [
        { Name: "email", Value: email },
        { Name: "phone_number", Value: phoneNumber },
        { Name: "gender", Value: gender },
        { Name: "name", Value: name },
      ],
    };

    try {
      await cognito.signUp(params).promise();
      alert("Signup successful! Please check your email for verification.");
      navigate("/login");
    } catch (err) {
      console.error("Signup failed:", err);

      // Handle different error messages
      if (err.code === "UsernameExistsException") {
        setError("User already exists. Please try logging in.");
      } else if (err.code === "InvalidPasswordException") {
        setError("Password does not meet complexity requirements.");
      } else if (err.code === "InvalidParameterException") {
        setError("Invalid parameters. Please check your input.");
      } else if (err.code === "NotAuthorizedException") {
        setError("Sign-up is not authorized. Please contact support.");
      } else {
        setError("Failed to sign up. Please try again.");
      }
    }
  };

  return (
    <div className="auth-container">
      <h2>Create a MealWise Account</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="tel"
          placeholder="Phone Number (+1234567890)"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <select className="gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <input
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
      <p className='para'>
        Already have an account?{" "}
        <span className="toggle-link" onClick={() => navigate("/login")}>
          Login
        </span>
      </p>
    </div>
  );
};

export default Signup;
