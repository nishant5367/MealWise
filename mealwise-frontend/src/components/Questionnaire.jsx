import { useState } from 'react';
import '../styles/Questionnaire.css';
import { useNavigate } from 'react-router-dom';


const questions = [
    { question: "What's your age?", type: "number", placeholder: "Enter your age" },
    { question: "What's your weight (in kgs)?", type: "number", placeholder: "Enter your weight" },
    { question: "What's your target weight?", type: "number", placeholder: "Enter your target weight" },
    { question: "What's your height (in cms)?", type: "number", placeholder: "Enter your height" },
    { question: "Any medical conditions you are aware of?", type: "checkbox", options: ["None", "Diabetes", "PCOS", "Thyroid", "Hypertension", "Cholesterol", "Depression", "Sleep Issues", "Anxiety"] },
    { question: "What's your meal preference?", type: "select", options: ["Vegetarian", "Non-Vegetarian", "Eggetarian"], placeholder: "Select your preference" }
];

const Questionnaire = () => {
    
    const navigate = useNavigate();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [responses, setResponses] = useState({});
    const [error, setError] = useState('');

    const handleNext = () => {
        if (!validateInput()) return;

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setError('');  // Clear error on successful validation
        }
    };

    const handleBack = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
            setError('');  // Clear error when going back
        }
    };

    const validateInput = () => {
        const currentQ = questions[currentQuestion];
        const answer = responses[currentQ.question];

        // Check for empty input
        if (currentQ.type === 'number' && (!answer || isNaN(answer))) {
            setError('Please enter a valid number.');
            return false;
        }

        // Check for unselected options
        if (currentQ.type === 'select' && (!answer || answer === '')) {
            setError('Please select an option.');
            return false;
        }

        // Check for checkbox selections
        if (currentQ.type === 'checkbox' && (!answer || answer.length === 0)) {
            setError('Please select at least one option.');
            return false;
        }

        return true;
    };

    const handleChange = (event) => {
        setResponses({ ...responses, [questions[currentQuestion].question]: event.target.value });
        setError('');  // Clear error on valid input
    };

    const handleCheckboxChange = (event) => {
        const value = event.target.value;
        setResponses((prevResponses) => {
            const selectedOptions = prevResponses[questions[currentQuestion].question] || [];

            if (value === 'None') {
                return { ...prevResponses, [questions[currentQuestion].question]: ['None'] };
            }

            if (selectedOptions.includes('None')) {
                selectedOptions.splice(selectedOptions.indexOf('None'), 1);
            }

            if (event.target.checked) {
                return { ...prevResponses, [questions[currentQuestion].question]: [...selectedOptions, value] };
            } else {
                return { ...prevResponses, [questions[currentQuestion].question]: selectedOptions.filter((option) => option !== value) };
            }
        });
        setError('');  // Clear error on valid selection
    };
    const submitResponses = async () => {
        if (!validateInput()) return;
    
        const username = localStorage.getItem("username");
        if (!username) {
            alert("User not logged in.");
            return;
        }
    
        try {
            const response = await fetch("http://localhost:8080/api/questionnaire/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    responses: responses
                }),
                mode: "cors"
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}`);
            }
    
            const result = await response.text();
            alert(result); // e.g., "Questionnaire saved successfully!"
            navigate("/dashboard");
        } catch (error) {
            console.error("Error submitting questionnaire:", error);
            alert("Something went wrong while submitting. Please try again.");
        }
    };
    

    return (
        <div className="container">
            <div className="question-wrapper">
                <div className="progress-bar">
                    {questions.map((_, index) => (
                        <div
                            key={index}
                            className={`progress-dot ${index <= currentQuestion ? 'active' : ''}`}
                        ></div>
                    ))}
                </div>
                <h2>{questions[currentQuestion].question}</h2>
                {error && <p className="error-message">{error}</p>}  {/* Display error message */}
                
                {questions[currentQuestion].type === "select" ? (
                    <select onChange={handleChange} className="input">
                        <option value="">Select your preference</option>
                        {questions[currentQuestion].options.map((option, index) => (
                            <option key={index} value={option}>{option}</option>
                        ))}
                    </select>
                ) : questions[currentQuestion].type === "checkbox" ? (
                    <div className="checkbox-group">
                        {questions[currentQuestion].options.map((option, index) => (
                            <label key={index} className="checkbox-label">
                                <input
                                    type="checkbox"
                                    value={option}
                                    onChange={handleCheckboxChange}
                                    checked={(responses[questions[currentQuestion].question] || []).includes(option)}
                                />
                                {option}
                            </label>
                        ))}
                    </div>
                ) : (
                    <input
                        type={questions[currentQuestion].type}
                        placeholder={questions[currentQuestion].placeholder}
                        value={responses[questions[currentQuestion].question] || ''}
                        className="input"
                        onChange={handleChange}
                    />
                )}
                <div className="button-group">
                    {currentQuestion > 0 && (
                        <button onClick={handleBack} className="button back-button">Back</button>
                    )}
                    {currentQuestion < questions.length - 1 ? (
                        <button onClick={handleNext} className="button next-button">Next</button>
                    ) : (
                        <button className="button submit-button" onClick={submitResponses}>Submit</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Questionnaire;
