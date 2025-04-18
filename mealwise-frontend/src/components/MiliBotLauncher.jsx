import React, { useState } from "react";
import LexChatbot from "./LexChatbot";
import miliLogo from "../assets/mili-logo.png";

const MiliBotLauncher = () => {
  const [showChat, setShowChat] = useState(false);

  const toggleChat = () => setShowChat((prev) => !prev); // ⬅️ one toggle function

  return (
    <>
      {/* Chatbot Panel */}
      {showChat && (
        <div
          style={{
            position: "fixed",
            bottom: "100px", // ⬅️ adjusted to give space for logo
            right: "20px",
            zIndex: 1000
          }}
        >
          <LexChatbot onClose={() => setShowChat(false)} />
        </div>
      )}

      {/* Mili Toggle Button (always visible) */}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 1
        }}
      >
        <img
          src={miliLogo}
          alt="Chat with Mili"
          style={{
            width: "80px",
            height: "80px",
            cursor: "pointer",
            borderRadius: "50%",
            boxShadow: "0 0 10px rgba(0,0,0,0.2)",
            backgroundColor: "white",
            padding: "8px"
          }}
          onClick={toggleChat}
        />
      </div>
    </>
  );
};

export default MiliBotLauncher;
