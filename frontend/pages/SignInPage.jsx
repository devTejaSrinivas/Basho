import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignInPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setMessage({
        type: "success",
        text: "Sign in successful! Redirecting...",
      });

      // Redirect to /chat after successful login
      setTimeout(() => {
        navigate("/chat");
      }, 1000);
    }, 1000);
  };

  const styles = {
    container: {
      minHeight: "100vh",
      background: "linear-gradient(to bottom right, #EEF2FF, #F3E8FF)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "16px",
    },
    card: {
      maxWidth: "400px",
      width: "100%",
      backgroundColor: "#FFFFFF",
      borderRadius: "8px",
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
      overflow: "hidden",
    },
    header: {
      background: "linear-gradient(to right, #3B82F6, #4F46E5)",
      padding: "24px",
      textAlign: "center",
    },
    title: {
      fontSize: "28px",
      fontWeight: "bold",
      color: "#FFFFFF",
      margin: "0",
      fontFamily: "system-ui, -apple-system, sans-serif",
    },
    subtitle: {
      color: "rgba(238, 242, 255, 0.9)",
      fontSize: "14px",
      marginTop: "8px",
    },
    formContainer: {
      padding: "32px",
    },
    formGroup: {
      marginBottom: "24px",
    },
    label: {
      display: "block",
      color: "#374151",
      fontSize: "14px",
      fontWeight: "500",
      marginBottom: "8px",
      fontFamily: "system-ui, -apple-system, sans-serif",
    },
    input: {
      width: "100%",
      padding: "10px 12px",
      border: "1px solid #D1D5DB",
      borderRadius: "6px",
      fontSize: "16px",
      outline: "none",
      transition: "border-color 0.2s, box-shadow 0.2s",
      boxSizing: "border-box",
    },
    inputFocus: {
      borderColor: "#4F46E5",
      boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.2)",
    },
    forgotPassword: {
      fontSize: "12px",
      color: "#4F46E5",
      textDecoration: "none",
      float: "right",
      marginTop: "4px",
    },
    button: {
      width: "100%",
      padding: "12px",
      background: "linear-gradient(to right, #3B82F6, #4F46E5)",
      border: "none",
      borderRadius: "6px",
      color: "white",
      fontSize: "16px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "opacity 0.2s",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    buttonHover: {
      opacity: 0.9,
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    buttonDisabled: {
      opacity: 0.7,
      cursor: "not-allowed",
    },
    message: {
      padding: "12px",
      borderRadius: "6px",
      marginTop: "16px",
      textAlign: "center",
    },
    successMessage: {
      backgroundColor: "rgba(209, 250, 229, 0.8)",
      color: "#065F46",
    },
    errorMessage: {
      backgroundColor: "rgba(254, 226, 226, 0.8)",
      color: "#991B1B",
    },
    footer: {
      marginTop: "24px",
      textAlign: "center",
      fontSize: "14px",
      color: "#6B7280",
    },
    link: {
      color: "#4F46E5",
      textDecoration: "none",
      fontWeight: "500",
      marginLeft: "4px",
    },
    labelContainer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "8px",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Basho</h1>
          <p style={styles.subtitle}>Sign in to your account</p>
        </div>

        <div style={styles.formContainer}>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label htmlFor="username" style={styles.label}>
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                style={styles.input}
                placeholder="Enter your username"
                onFocus={(e) =>
                  (e.target.style.boxShadow = styles.inputFocus.boxShadow)
                }
                onBlur={(e) => (e.target.style.boxShadow = "none")}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <div style={styles.labelContainer}>
                <label htmlFor="password" style={styles.label}>
                  Password
                </label>
                <a href="#" style={styles.forgotPassword}>
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                style={styles.input}
                placeholder="Enter your password"
                onFocus={(e) =>
                  (e.target.style.boxShadow = styles.inputFocus.boxShadow)
                }
                onBlur={(e) => (e.target.style.boxShadow = "none")}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  ...styles.button,
                  ...(isSubmitting ? styles.buttonDisabled : {}),
                }}
                onMouseOver={(e) => {
                  if (!isSubmitting)
                    Object.assign(e.target.style, styles.buttonHover);
                }}
                onMouseOut={(e) => {
                  if (!isSubmitting) e.target.style.opacity = "1";
                }}
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </button>
            </div>

            {message && (
              <div
                style={{
                  ...styles.message,
                  ...(message.type === "success"
                    ? styles.successMessage
                    : styles.errorMessage),
                }}
              >
                {message.text}
              </div>
            )}
          </form>

          <div style={styles.footer}>
            <span>Don't have an account?</span>
            <a href="/signup" style={styles.link}>
              Create one
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
