import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const NotFound: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  return (
    <div style={styles.outer}>
      {/* Candle glow ambience */}
      <div style={styles.candleGlow}></div>

      <div style={styles.card}>
        <h1 style={styles.code}>404</h1>
        <p style={styles.line}>A page lost between the margins...</p>

        <p style={styles.message}>
          The ink has faded, the parchment torn —  
          <span style={styles.accent}>"{location.pathname}"</span> seems to be missing from our story.
        </p>

        <div style={styles.actions}>
          <Link to="/" style={styles.buttonHome}>
            🕯️ Return Home
          </Link>

          {isAuthenticated ? (
            <Link to="/create-post" style={styles.buttonWrite}>
              ✒️ Write Something New
            </Link>
          ) : (
            <Link to="/login" style={styles.buttonWrite}>
              ✉️ Sign In
            </Link>
          )}
        </div>

        <div style={styles.quoteBox}>
          <p style={styles.quote}>
            “We are such stuff as dreams are made on; and our little life is rounded with a sleep.”
          </p>
          <p style={styles.quoteAuthor}>— William Shakespeare</p>
        </div>
      </div>

      <style>{`
        @keyframes candleFlicker {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.8; }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(25px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .fadeInUp {
          animation: fadeInUp 1.2s ease forwards;
        }
      `}</style>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  outer: {
    minHeight: "100vh",
    backgroundColor: "#f7f3e9",
    padding: "8rem 1rem 4rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: '"Lora", serif',
    position: "relative",
  },
  candleGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background:
      "radial-gradient(circle at 50% 80%, rgba(107,78,46,0.15), transparent 70%)",
    animation: "candleFlicker 6s ease-in-out infinite",
    zIndex: 0,
  },
  card: {
    backgroundColor: "#fffefb",
    borderRadius: "16px",
    boxShadow: "0 12px 35px rgba(0,0,0,0.1)",
    border: "1px solid rgba(107,78,46,0.2)",
    padding: "3rem 2.5rem",
    maxWidth: "700px",
    width: "100%",
    position: "relative",
    zIndex: 2,
    textAlign: "center",
    animation: "fadeInUp 1.2s ease forwards",
  },
  code: {
    fontFamily: '"Playfair Display", serif',
    fontSize: "6rem",
    color: "#6b4e2e",
    margin: "0 0 1rem 0",
  },
  line: {
    fontSize: "1.3rem",
    color: "#3b2b19",
    fontStyle: "italic",
    marginBottom: "1rem",
  },
  message: {
    color: "#4a3b2a",
    fontSize: "1.1rem",
    marginBottom: "2rem",
    lineHeight: "1.6",
  },
  accent: {
    color: "#b89b74",
    fontWeight: 600,
    fontStyle: "italic",
  },
  actions: {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
    flexWrap: "wrap",
    marginBottom: "2.5rem",
  },
  buttonHome: {
    backgroundColor: "#6b4e2e",
    color: "#fffefb",
    padding: "0.8rem 1.8rem",
    borderRadius: "8px",
    textDecoration: "none",
    fontFamily: '"Playfair Display", serif',
    fontSize: "1rem",
    transition: "all 0.3s ease",
  },
  buttonWrite: {
    backgroundColor: "#b89b74",
    color: "#fffefb",
    padding: "0.8rem 1.8rem",
    borderRadius: "8px",
    textDecoration: "none",
    fontFamily: '"Playfair Display", serif',
    fontSize: "1rem",
    transition: "all 0.3s ease",
  },
  quoteBox: {
    borderTop: "1px solid rgba(107,78,46,0.2)",
    marginTop: "2rem",
    paddingTop: "1.5rem",
  },
  quote: {
    fontSize: "1.1rem",
    fontStyle: "italic",
    color: "#3b2b19",
    marginBottom: "0.6rem",
  },
  quoteAuthor: {
    fontSize: "0.95rem",
    color: "#6b4e2e",
  },
};

export default NotFound;
