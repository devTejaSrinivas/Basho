import React from "react";
import { useNavigate } from "react-router-dom";
import { Send } from "lucide-react";

const AnimatedButton = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Define keyframes for the animated gradient */}
      <style>{`
        @keyframes gradientAnimation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
      <button
        style={{
          fontSize: "25px",
          width: "100%",
          padding: "15px 30px",
          background: "linear-gradient(45deg, #007bff, #00d4ff, #007bff)",
          backgroundSize: "200% 200%",
          animation: "gradientAnimation 3s ease infinite",
          color: "white",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
          outline: "none",
          display: "block",
          margin: "20px auto",
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = "scale(1.03)";
          e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.3)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
        }}
        onClick={() => navigate("/deepchat")}
      >
        <b>Deep Talk</b>
        <br />
        <span style={{ color: "lightgray", fontSize: "18px" }}>
          Know more about your "Basho" of interest
        </span>
      </button>
    </>
  );
};

export default AnimatedButton;
