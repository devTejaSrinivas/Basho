import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
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

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setMessage({
        type: "error",
        text: "Passwords do not match!",
      });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setMessage({
        type: "success",
        text: "Account created successfully! Redirecting to login...",
      });

      // Redirect to sign-in after successful signup
      setTimeout(() => {
        navigate("/signin");
      }, 1500);
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
      maxWidth: "500px",
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
      marginBottom: "20px",
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
    row: {
      display: "flex",
      gap: "16px",
    },
    column: {
      flex: "1",
      width: "100%",
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
    passwordRequirements: {
      fontSize: "12px",
      color: "#6B7280",
      marginTop: "6px",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Basho</h1>
          <p style={styles.subtitle}>Create your account</p>
        </div>

        <div style={styles.formContainer}>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label htmlFor="fullName" style={styles.label}>
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                style={styles.input}
                placeholder="Enter your full name"
                onFocus={(e) =>
                  (e.target.style.boxShadow = styles.inputFocus.boxShadow)
                }
                onBlur={(e) => (e.target.style.boxShadow = "none")}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="email" style={styles.label}>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={styles.input}
                placeholder="Enter your email address"
                onFocus={(e) =>
                  (e.target.style.boxShadow = styles.inputFocus.boxShadow)
                }
                onBlur={(e) => (e.target.style.boxShadow = "none")}
                required
              />
            </div>

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
                placeholder="Choose a username"
                onFocus={(e) =>
                  (e.target.style.boxShadow = styles.inputFocus.boxShadow)
                }
                onBlur={(e) => (e.target.style.boxShadow = "none")}
                required
              />
            </div>

            <div style={styles.row}>
              <div style={{ ...styles.column, ...styles.formGroup }}>
                <label htmlFor="password" style={styles.label}>
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Create a password"
                  onFocus={(e) =>
                    (e.target.style.boxShadow = styles.inputFocus.boxShadow)
                  }
                  onBlur={(e) => (e.target.style.boxShadow = "none")}
                  required
                />
                <p style={styles.passwordRequirements}>
                  Min. 8 characters with at least 1 number
                </p>
              </div>

              <div style={{ ...styles.column, ...styles.formGroup }}>
                <label htmlFor="confirmPassword" style={styles.label}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Confirm your password"
                  onFocus={(e) =>
                    (e.target.style.boxShadow = styles.inputFocus.boxShadow)
                  }
                  onBlur={(e) => (e.target.style.boxShadow = "none")}
                  required
                />
              </div>
            </div>

            <div style={{ ...styles.formGroup, marginTop: "24px" }}>
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
                {isSubmitting ? "Creating Account..." : "Create Account"}
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
            <span>Already have an account?</span>
            <a href="/signin" style={styles.link}>
              Sign in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
