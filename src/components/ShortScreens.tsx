import React, { useEffect, useState } from "react";

interface ShortScreensProps {
  children: React.ReactNode;
}

const ShortScreens: React.FC<ShortScreensProps> = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.parchment}>
          <div style={styles.inkReveal}>
            <h1 style={styles.title}>Night Quill</h1>
            <p style={styles.message}>
              ✒️ Our tales don’t quite fit on tiny scrolls.  
              Visit us again from a wider canvas — a tablet or desktop —  
              to see the ink flow as it should.
            </p>
            <div style={styles.signature}>— The Quillkeeper 🕯️</div>
          </div>
        </div>

        <style>{`
          @keyframes inkReveal {
            0% {
              clip-path: inset(0 100% 0 0);
              opacity: 0;
            }
            60% {
              opacity: 0.7;
            }
            100% {
              clip-path: inset(0 0 0 0);
              opacity: 1;
            }
          }

          @keyframes subtleSmudge {
            0%, 100% {
              filter: blur(0.8px);
              opacity: 0.95;
            }
            50% {
              filter: blur(1.4px);
              opacity: 1;
            }
          }
        `}</style>
      </div>
    );
  }

  return <>{children}</>;
};

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    minHeight: "100vh",
    background: "radial-gradient(circle at center, #f5f3ee, #ebe5da 80%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
    fontFamily: '"Playfair Display", serif',
  },
  parchment: {
    background: "linear-gradient(145deg, #faf8f2, #f1ece4)",
    border: "1px solid rgba(107, 78, 46, 0.2)",
    boxShadow: "0 15px 40px rgba(0, 0, 0, 0.12)",
    borderRadius: "18px",
    padding: "3.2rem 2.5rem",
    maxWidth: "420px",
    textAlign: "center",
    animation: "subtleSmudge 8s ease-in-out infinite",
    position: "relative",
  },
  inkReveal: {
    animation: "inkReveal 1.8s ease forwards",
  },
  title: {
    fontSize: "2.3rem",
    color: "#2e2b26",
    letterSpacing: "1.5px",
    marginBottom: "1.5rem",
  },
  message: {
    color: "#3b2b19",
    fontSize: "1.05rem",
    lineHeight: "1.8",
    fontFamily: '"Lora", serif',
    marginBottom: "2rem",
  },
  signature: {
    fontFamily: '"Homemade Apple", cursive',
    fontSize: "1rem",
    color: "#6b4e2e",
    opacity: 0.9,
  },
};

export default ShortScreens;
