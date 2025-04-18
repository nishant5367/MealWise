import  { useEffect, useState, useRef } from "react";
import { jsPDF } from "jspdf";
import {
  LexRuntimeV2Client,
  RecognizeTextCommand
} from "@aws-sdk/client-lex-runtime-v2";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";

const LexChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [lastMealPlan, setLastMealPlan] = useState(null);
  const [visible, setVisible] = useState(true);
  const messagesEndRef = useRef(null);

  const username = localStorage.getItem("username");
  const idToken = localStorage.getItem("idToken");
  const sessionId = username || Date.now().toString();

  const client = new LexRuntimeV2Client({
    region: "us-east-1",
    credentials: fromCognitoIdentityPool({
      identityPoolId: "us-east-1:93e2bc76-01e3-4c52-b973-0c57b51c95cd",
      logins: idToken
        ? { "cognito-idp.eu-north-1.amazonaws.com/eu-north-1_mHj1Cy2bP": idToken }
        : undefined
    })
  });

  const handleSend = async () => {
    if (!inputText.trim()) return;
    setMessages((prev) => [...prev, { from: "user", text: inputText }]);

    const command = new RecognizeTextCommand({
      botId: "TCZZOHUCY6",
      botAliasId: "TSTALIASID",
      localeId: "en_US",
      sessionId,
      text: inputText
    });

    try {
      const response = await client.send(command);
      const lexMessages = response.messages || [];

      lexMessages.forEach((msg) => {
        setMessages((prev) => [...prev, { from: "bot", text: msg.content }]);
      });

      const intent = response.sessionState?.intent;
      if (intent?.state === "Fulfilled" && intent.name === "GetMealRecommendationIntent") {
        const slots = intent.slots;
        const userInput = {
          Age: parseInt(slots.Age?.value?.interpretedValue),
          Gender: slots.Gender?.value?.interpretedValue,
          Weight_Goal: slots.Weight_Goal?.value?.interpretedValue,
          Health_Condition: slots.Health_Condition?.value?.interpretedValue,
          Diet_Type: slots.Diet_Type?.value?.interpretedValue,
          Activity_Level: slots.Activity_Level?.value?.interpretedValue
        };

        const apiRes = await fetch("https://mealwise-ml-api.onrender.com/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userInput)
        });

        const data = await apiRes.json();
        const recommendations = data.recommendations;

        const jsxFormatted = (
          <div>
            <strong>✅ Your meal plan:</strong>
            <div style={{ marginTop: "8px" }}>
              {Object.entries(recommendations).map(([meal, dishes]) => (
                <div key={meal} style={{ marginBottom: "10px" }}>
                  <div style={{ fontWeight: "bold", color: "#2ecc71", textTransform: "capitalize" }}>
                    🍽️ {meal}:
                  </div>
                  <ul style={{ paddingLeft: "20px", marginTop: "4px" }}>
                    {dishes.map((dish, i) => (
                      <li key={i} style={{ color: "#444", fontSize: "14px" }}>{dish}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        );

        setMessages((prev) => [...prev, { from: "bot", jsx: jsxFormatted }]);

        const plainFormatted = Object.entries(recommendations)
          .map(([meal, dishes]) => `${meal.toUpperCase()}: ${dishes.join(", ")}`)
          .join("\n");
        setLastMealPlan(plainFormatted);
      }
    } catch (err) {
      console.error("Lex error:", err);
      setMessages((prev) => [...prev, { from: "bot", text: "❌ Something went wrong!" }]);
    }

    setInputText("");
  };

  const exportToPDF = () => {
    if (!lastMealPlan) return alert("No meal plan available to export!");
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("🥗 Personalized Meal Plan", 20, 20);
    doc.setFontSize(12);
    doc.text(lastMealPlan, 20, 35);
    doc.save("Meal_Plan.pdf");
  };

  useEffect(() => {
    const user = localStorage.getItem("username");
    setMessages([
      {
        from: "bot",
        text: `Hi ${user || "there"}! 👋 I'm Mili, your meal assistant.`
      }
    ]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!visible) return null;

  return (
    <div style={styles.chatContainer}>
      <div style={styles.topBar}>
        <h4 style={{ margin: 0 }}>Mili Chatbot</h4>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button onClick={exportToPDF} style={styles.exportBtn}>
            📄 Export Plan
          </button>
          <span onClick={() => setVisible(false)} style={styles.closeBtn} title="Close">✖</span>
        </div>
      </div>

      <div style={styles.messages}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              ...styles.message,
              alignSelf: msg.from === "user" ? "flex-end" : "flex-start",
              backgroundColor: msg.from === "user" ? "#d1f0ff" : "#f1f1f1"
            }}
          >
            <strong>{msg.from === "user" ? "You" : "Mili"}:</strong>{" "}
            {msg.jsx ? msg.jsx : msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div style={styles.inputArea}>
        <input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask Mili something..."
          style={styles.input}
        />
        <button onClick={handleSend} style={styles.sendBtn}>
          Send
        </button>
      </div>
    </div>
  );
};

const styles = {
  chatContainer: {
    position: "fixed",
    right: "20px",
    bottom: "-10px",
    width: "400px",
    height: "520px",
    backgroundColor: "#fff",
    borderRadius: "16px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
    display: "flex",
    flexDirection: "column",
    zIndex: 9999,
    overflow: "hidden"
  },
  topBar: {
    padding: "10px 16px",
    backgroundColor: "#2ecc71",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexShrink: 0
  },
  exportBtn: {
    padding: "5px 10px",
    backgroundColor: "#fff",
    color: "#2ecc71",
    border: "1px solid #fff",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer"
  },
  closeBtn: {
    fontSize: "18px",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold"
  },
  messages: {
    flex: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    padding: "12px"
  },
  message: {
    padding: "10px 14px",
    borderRadius: "12px",
    maxWidth: "85%",
    fontSize: "14px",
    whiteSpace: "pre-wrap",
    color: "#333",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
  },
  inputArea: {
    display: "flex",
    gap: "8px",
    padding: "12px",
    borderTop: "1px solid #eee",
    flexShrink: 0
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "14px"
  },
  sendBtn: {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#28a745",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer"
  }
};

export default LexChatbot;
