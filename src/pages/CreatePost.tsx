import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { postsAPI } from "../services/api";

const CreatePost: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const [tags, setTags] = useState("");
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await postsAPI.createPost({
        title,
        content,
        summary: summary || undefined,
        tags: tags || undefined,
        published,
      });
      navigate("/my-posts");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Quote Panel */}
        <div style={styles.leftPanel}>
          <blockquote style={styles.quote}>
            “A quill dipped in chaos  
            births the stories the moon whispers.”
          </blockquote>
        </div>

        {/* Form Panel */}
        <div style={styles.formPanel}>
          <h2 style={styles.title}>Hold Your Quill ✒️</h2>
          {error && <div style={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.dualRow}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  style={styles.input}
                  placeholder="A tale begins..."
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Tags</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  style={styles.input}
                  placeholder="night, ink, muse"
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Summary</label>
              <input
                type="text"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                maxLength={200}
                style={styles.input}
                placeholder="Whisper your summary..."
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Your Words *</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={12}
                style={styles.textarea}
                placeholder="Pour your thoughts on the parchment..."
              />
            </div>

            <div style={styles.checkboxGroup}>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  style={styles.checkbox}
                />
                Publish immediately
              </label>
              <small style={styles.helperText}>
                Unchecked = your quill rests, a draft kept safe
              </small>
            </div>

            <div style={styles.buttonGroup}>
              <button
                type="button"
                onClick={() => navigate("/my-posts")}
                style={styles.cancelButton}
              >
                Discard
              </button>
              <button
                type="submit"
                disabled={loading}
                style={styles.submitButton}
              >
                {loading
                  ? "Writing..."
                  : published
                  ? "Publish ✨"
                  : "Save as Draft"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes fieldGlow {
          0%, 100% { box-shadow: 0 0 0 rgba(107,78,46,0); }
          50% { box-shadow: 0 0 10px rgba(107,78,46,0.35); }
        }
        input:focus, textarea:focus {
          outline: none !important;
          animation: fieldGlow 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background:
      "radial-gradient(circle at bottom center, #f8f6f1 0%, #f3efe7 100%)",
    padding: "8rem 1rem 3rem",
    fontFamily: '"Lora", serif',
  },
  container: {
    display: "grid",
    gridTemplateColumns: "1fr 1.5fr",
    width: "90%",
    maxWidth: "1200px",
    borderRadius: "18px",
    overflow: "hidden",
    boxShadow: "0 15px 40px rgba(0,0,0,0.1)",
    backgroundColor: "rgba(255,255,255,0.95)",
    border: "1px solid rgba(107,78,46,0.2)",
  },
  leftPanel: {
    background: "linear-gradient(to bottom right, #f8f6f1, #f2ede4)",
    display: "flex",
    alignItems: "center",
    padding: "3rem",
  },
  quote: {
    fontSize: "1.5rem",
    fontStyle: "italic",
    color: "#3b2b19",
    textAlign: "center" as const,
    lineHeight: "1.6",
    fontFamily: '"Playfair Display", serif',
    borderLeft: "3px solid rgba(107,78,46,0.4)",
    paddingLeft: "1.5rem",
  },
  formPanel: {
    padding: "3rem 4rem",
  },
  title: {
    fontSize: "2.3rem",
    color: "#2e2b26",
    textAlign: "center" as const,
    marginBottom: "2rem",
    fontFamily: '"Playfair Display", serif',
  },
  error: {
    backgroundColor: "rgba(219, 50, 20, 0.1)",
    color: "#8a1f11",
    padding: "0.9rem",
    borderRadius: "6px",
    border: "1px solid rgba(219, 50, 20, 0.3)",
    textAlign: "center" as const,
    marginBottom: "1.2rem",
  },
  dualRow: {
    display: "flex",
    gap: "1.5rem",
  },
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "1.5rem",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column" as const,
    flex: 1,
  },
  label: {
    marginBottom: "0.5rem",
    color: "#3b2b19",
    fontWeight: 600,
    fontFamily: '"Playfair Display", serif',
  },
  input: {
    padding: "0.8rem 1rem",
    borderRadius: "8px",
    border: "1px solid rgba(107,78,46,0.3)",
    backgroundColor: "rgba(255,255,255,0.95)",
    color: "#2e2b26",
    fontFamily: '"Lora", serif',
    fontSize: "1rem",
    transition: "all 0.3s ease",
  },
  textarea: {
    padding: "1rem",
    borderRadius: "8px",
    border: "1px solid rgba(107,78,46,0.3)",
    backgroundColor: "rgba(255,255,255,0.95)",
    color: "#2e2b26",
    fontFamily: '"Lora", serif',
    fontSize: "1.05rem",
    resize: "vertical" as const,
    lineHeight: "1.6",
  },
  checkboxGroup: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.5rem",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    color: "#3b2b19",
    cursor: "pointer",
  },
  checkbox: {
    width: "18px",
    height: "18px",
    accentColor: "#b89b74",
  },
  helperText: {
    color: "#6b4e2e",
    fontSize: "0.9rem",
    fontStyle: "italic",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "1rem",
    marginTop: "2rem",
  },
  cancelButton: {
    backgroundColor: "rgba(107,78,46,0.15)",
    color: "#2e2b26",
    padding: "0.8rem 1.8rem",
    border: "1px solid rgba(107,78,46,0.3)",
    borderRadius: "8px",
    fontFamily: '"Playfair Display", serif',
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  submitButton: {
    backgroundColor: "#b89b74",
    color: "#fffefb",
    padding: "0.8rem 2rem",
    border: "none",
    borderRadius: "8px",
    fontFamily: '"Playfair Display", serif',
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
};

export default CreatePost;
