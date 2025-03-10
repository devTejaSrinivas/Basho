import React from "react";

const LanguageSelector = ({ language, setLanguage, translations }) => {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "40px",
        background: "linear-gradient(135deg, #2d2d2d, #444)",
        border: "2px solid #fff",
        borderRadius: "15px",
        width: "90%",
        maxWidth: "500px",
        margin: "40px auto",
        color: "#fff",
        fontFamily: "'Roboto', sans-serif",
        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
      }}
    >
      <h1
        style={{
          marginBottom: "25px",
          fontSize: "32px",
          letterSpacing: "1px",
        }}
      >
        Choose Language
      </h1>

      <select
        onChange={(e) => setLanguage(e.target.value)}
        value={language}
        style={{
          padding: "15px",
          fontSize: "16px",
          borderRadius: "8px",
          border: "none",
          background: "#222",
          cursor: "pointer",
          outline: "none",
          marginBottom: "25px",
          color: "#fff",
          appearance: "none",
          backgroundImage:
            "url('data:image/svg+xml;charset=US-ASCII,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2210%22 height=%2210%22 viewBox=%220 0 10 10%22><polygon points=%225,7 0,2 10,2%22 fill=%22%23fff%22/></svg>')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 10px center",
          backgroundSize: "10px 10px",
        }}
      >
        <option value="en">English</option>
        <option value="hi">Hindi (हिन्दी)</option>
        <option value="mr">Marathi (मराठी)</option>
        <option value="te">Telugu (తెలుగు)</option>
        <option value="bn">Bengali (বাংলা)</option>
        <option value="kn">Kannada (ಕನ್ನಡ)</option>
        <option value="gu">Gujarati (ગુજરાતી)</option>
        <option value="pa">Punjabi (ਪੰਜਾਬੀ)</option>
      </select>

      <p
        style={{
          marginTop: "15px",
          fontWeight: "bold",
          fontSize: "28px",
        }}
      >
        {translations[language]}
      </p>
    </div>
  );
};

export default LanguageSelector;
