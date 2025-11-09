import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { postsAPI } from "../services/api";

const EditPost: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const [tags, setTags] = useState("");
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const fetchPost = useCallback(async () => {
    if (!id) return;

    try {
      setFetchLoading(true);
      const response = await postsAPI.getPost(id);
      const post = response.data;

      setTitle(post.title);
      setContent(post.content);
      setSummary(post.summary || "");
      setTags(post.tags.join(", "));
      setPublished(post.published);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch post");
    } finally {
      setFetchLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!id) {
      navigate("/my-posts");
      return;
    }

    fetchPost();
  }, [isAuthenticated, navigate, id, fetchPost]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await postsAPI.updatePost(id!, {
        title,
        content,
        summary,
        tags,
        published,
      });
      navigate("/my-posts");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update post");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure? This can’t be undone.")) return;

    try {
      setLoading(true);
      await postsAPI.deletePost(id!);
      navigate("/my-posts");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete post");
      setLoading(false);
    }
  };

  if (!isAuthenticated) return null;
  if (fetchLoading)
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Preparing your desk...</div>
      </div>
    );

  return (
    <div style={styles.outer}>
      <div style={styles.candleGlow}></div>

      <div style={styles.formContainer}>
        <div style={styles.header}>
          <h2 style={styles.title}>Edit Your Tale</h2>
          <button
            onClick={handleDelete}
            style={styles.deleteButton}
            disabled={loading}
          >
            Delete Post
          </button>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={styles.input}
              placeholder="Ink your title here..."
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Summary</label>
            <input
              type="text"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              style={styles.input}
              placeholder="A whisper of your tale..."
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Tags</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              style={styles.input}
              placeholder="Separate tags with commas"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Your Story</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={14}
              style={styles.textarea}
              placeholder="Let your words flow..."
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
              Publish this tale
            </label>
          </div>

          <div style={styles.buttonGroup}>
            <button
              type="button"
              onClick={() => navigate("/my-posts")}
              style={styles.cancelButton}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={styles.submitButton}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  outer: {
    backgroundColor: "#f7f3e9",
    minHeight: "100vh",
    padding: "6rem 2rem 4rem",
    position: "relative",
    fontFamily: '"Lora", serif',
  },
  candleGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background:
      "radial-gradient(circle at 50% 80%, rgba(107,78,46,0.15), transparent 70%)",
    animation: "candleLight 5s ease-in-out infinite",
    zIndex: 0,
  },
  container: { textAlign: "center" },
  formContainer: {
    backgroundColor: "#fffefb",
    maxWidth: "850px",
    margin: "0 auto",
    padding: "2.5rem",
    borderRadius: "14px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    position: "relative",
    zIndex: 2,
    border: "1px solid rgba(107,78,46,0.15)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
  },
  title: {
    fontFamily: '"Playfair Display", serif',
    fontSize: "2rem",
    color: "#2e2b26",
    letterSpacing: "0.5px",
  },
  deleteButton: {
    backgroundColor: "#8a1f11",
    color: "#fffefb",
    border: "none",
    borderRadius: "6px",
    padding: "0.7rem 1.3rem",
    fontFamily: '"Playfair Display", serif',
    cursor: "pointer",
  },
  error: {
    backgroundColor: "rgba(219,50,20,0.1)",
    color: "#8a1f11",
    padding: "1rem",
    borderRadius: "6px",
    marginBottom: "1rem",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.3rem",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    color: "#3b2b19",
    fontWeight: 600,
    marginBottom: "0.4rem",
    fontFamily: '"Playfair Display", serif',
  },
  input: {
    padding: "0.8rem",
    border: "1px solid rgba(107,78,46,0.3)",
    borderRadius: "8px",
    backgroundColor: "rgba(255,255,255,0.8)",
    transition: "all 0.3s ease",
    fontFamily: '"Lora", serif',
  },
  textarea: {
    padding: "0.8rem",
    border: "1px solid rgba(107,78,46,0.3)",
    borderRadius: "8px",
    backgroundColor: "rgba(255,255,255,0.8)",
    resize: "vertical",
    transition: "all 0.3s ease",
    fontFamily: '"Lora", serif',
  },
  checkboxGroup: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  checkboxLabel: {
    fontFamily: '"Lora", serif',
    color: "#3b2b19",
  },
  checkbox: {
    width: "18px",
    height: "18px",
    accentColor: "#6b4e2e",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "1rem",
    marginTop: "1.5rem",
  },
  cancelButton: {
    backgroundColor: "#6b4e2e",
    color: "#fffefb",
    border: "none",
    borderRadius: "6px",
    padding: "0.75rem 1.5rem",
    cursor: "pointer",
    fontFamily: '"Playfair Display", serif',
  },
  submitButton: {
    backgroundColor: "#b89b74",
    color: "#fffefb",
    border: "none",
    borderRadius: "6px",
    padding: "0.75rem 1.5rem",
    cursor: "pointer",
    fontFamily: '"Playfair Display", serif',
  },
  loading: {
    textAlign: "center",
    padding: "2rem",
    color: "#6b4e2e",
    fontSize: "1.2rem",
  },
};

export default EditPost;
