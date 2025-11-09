import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { postsAPI } from "../services/api";

interface Post {
  _id: string;
  title: string;
  content: string;
  summary?: string;
  author: { _id: string; username: string } | null;
  tags: string[];
  published: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
}

const ViewPost: React.FC = () => {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const fetchPost = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await postsAPI.getPost(id);
      setPost(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load post");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!id) {
      navigate("/");
      return;
    }
    fetchPost();
  }, [id, navigate, fetchPost]);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatContent = (content: string) =>
    content.split("\n").map((paragraph, index) =>
      paragraph.trim() ? (
        <p key={index} style={styles.paragraph}>
          {paragraph}
        </p>
      ) : null
    );

  const isAuthor = user && post?.author && user.id === post.author._id;

  if (loading)
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loading}>Unfolding the parchment...</div>
      </div>
    );

  if (error || !post)
    return (
      <div style={styles.container}>
        <div style={styles.errorBox}>
          <h2 style={styles.errorTitle}>Post Not Found</h2>
          <p style={styles.errorText}>
            {error || "The post you seek seems to have faded into the ink..."}
          </p>
          <Link to="/" style={styles.backButton}>
            ← Return to Desk
          </Link>
        </div>
      </div>
    );

  if (!post.published && !isAuthor)
    return (
      <div style={styles.container}>
        <div style={styles.errorBox}>
          <h2 style={styles.errorTitle}>Post Not Available</h2>
          <p style={styles.errorText}>This post isn’t published yet.</p>
          <Link to="/" style={styles.backButton}>
            ← Back to Home
          </Link>
        </div>
      </div>
    );

  return (
    <div style={styles.outer}>
      <div style={styles.inkGlow}></div>
      <article style={styles.article}>
        {/* Top bar */}
        <div style={styles.topBar}>
          <Link to="/" style={styles.backLink}>
            ← Return to All Tales
          </Link>
          {isAuthor && (
            <Link to={`/edit-post/${post._id}`} style={styles.editButton}>
              Edit Post
            </Link>
          )}
        </div>

        {/* Header */}
        <header style={styles.header}>
          <h1 style={styles.title}>{post.title}</h1>
          <div style={styles.meta}>
            <span>
              By <strong>{post.author?.username || "Unknown Scribe"}</strong>
            </span>
            <span style={styles.dot}>•</span>
            <span>{formatDate(post.createdAt)}</span>
            {post.updatedAt !== post.createdAt && (
              <>
                <span style={styles.dot}>•</span>
                <span>Updated {formatDate(post.updatedAt)}</span>
              </>
            )}
            <span style={styles.dot}>•</span>
            <span>{post.views} readers</span>
          </div>

          {post.summary && (
            <blockquote style={styles.summary}>
              <em>“{post.summary}”</em>
            </blockquote>
          )}

          {post.tags.length > 0 && (
            <div style={styles.tags}>
              {post.tags.map((tag, i) => (
                <span key={i} style={styles.tag}>
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Content */}
        <section style={styles.content}>{formatContent(post.content)}</section>

        {/* Footer */}
        <footer style={styles.footer}>
          <div style={styles.footerMeta}>
            Penned by <b>{post.author?.username}</b> on{" "}
            {formatDate(post.createdAt)} — {post.views} readers
          </div>
          <Link to="/" style={styles.footerLink}>
            ← Return to Home
          </Link>
        </footer>
      </article>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes glowPulse {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.3; }
        }

        article:hover {
          transform: translateY(-6px);
          transition: all 0.5s ease;
          box-shadow: 0 20px 50px rgba(0,0,0,0.15);
        }
      `}</style>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  outer: {
    backgroundColor: "#f7f3e9",
    minHeight: "100vh",
    padding: "5.5rem 1rem 3rem",
    display: "flex",
    justifyContent: "center",
    position: "relative",
    fontFamily: '"Lora", serif',
  },
  inkGlow: {
    position: "absolute",
    top: 0,
    left: "50%",
    width: "90%",
    height: "100%",
    transform: "translateX(-50%)",
    background:
      "radial-gradient(circle at center, rgba(107,78,46,0.08) 0%, transparent 70%)",
    pointerEvents: "none",
    animation: "glowPulse 6s ease-in-out infinite",
  },
  article: {
    backgroundColor: "#fffefb",
    borderRadius: "18px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
    maxWidth: "850px",
    width: "100%",
    padding: "3rem 3rem 2rem",
    border: "1px solid rgba(107,78,46,0.15)",
    animation: "fadeIn 1s ease forwards",
    position: "relative",
    marginTop: "2rem",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
  },
  backLink: {
    color: "#7a5837",
    textDecoration: "none",
    fontSize: "1rem",
    fontFamily: '"Playfair Display", serif',
  },
  editButton: {
    backgroundColor: "rgba(184,155,116,0.3)",
    border: "1px solid rgba(107,78,46,0.3)",
    color: "#2e2b26",
    padding: "0.4rem 1rem",
    borderRadius: "6px",
    fontFamily: '"Playfair Display", serif',
    fontSize: "0.9rem",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  header: {
    borderBottom: "1px solid rgba(107,78,46,0.2)",
    marginBottom: "1.5rem",
    paddingBottom: "1rem",
  },
  title: {
    fontFamily: '"Playfair Display", serif',
    fontSize: "2.7rem",
    color: "#2e2b26",
    marginBottom: "0.8rem",
    textAlign: "center" as const,
  },
  meta: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "0.6rem",
    fontSize: "0.95rem",
    color: "#5b3a1c",
    opacity: 0.9,
  },
  dot: {
    color: "#b89b74",
  },
  summary: {
    marginTop: "1.5rem",
    padding: "1rem 1.5rem",
    backgroundColor: "rgba(184,155,116,0.08)",
    borderLeft: "3px solid rgba(107,78,46,0.4)",
    borderRadius: "6px",
    color: "#3b2b19",
    fontSize: "1.1rem",
    lineHeight: "1.6",
    textAlign: "center" as const,
  },
  tags: {
    marginTop: "1.2rem",
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "0.7rem",
  },
  tag: {
    backgroundColor: "rgba(184,155,116,0.2)",
    color: "#5b3a1c",
    borderRadius: "14px",
    padding: "0.35rem 0.9rem",
    fontSize: "0.9rem",
    fontWeight: 500,
    transition: "all 0.3s ease",
  },
  content: {
    fontSize: "1.1rem",
    color: "#2e2b26",
    lineHeight: "1.8",
    marginTop: "2rem",
  },
  paragraph: {
    marginBottom: "1.4rem",
    textAlign: "justify" as const,
  },
  footer: {
    borderTop: "1px solid rgba(107,78,46,0.2)",
    paddingTop: "1rem",
    fontSize: "0.95rem",
    color: "#5b3a1c",
    marginTop: "2rem",
    textAlign: "center" as const,
  },
  footerMeta: {
    marginBottom: "0.6rem",
  },
  footerLink: {
    color: "#b89b74",
    textDecoration: "none",
    fontFamily: '"Playfair Display", serif',
    transition: "color 0.3s ease",
  },
  loadingContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f7f3e9",
  },
  loading: {
    fontFamily: '"Playfair Display", serif',
    fontSize: "1.3rem",
    color: "#6b4e2e",
  },
  errorBox: {
    backgroundColor: "#fffefb",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    padding: "2rem",
    maxWidth: "600px",
    margin: "8rem auto",
    textAlign: "center" as const,
  },
  errorTitle: {
    fontFamily: '"Playfair Display", serif',
    color: "#2e2b26",
    fontSize: "1.8rem",
    marginBottom: "0.8rem",
  },
  errorText: {
    color: "#5b3a1c",
    marginBottom: "1.5rem",
  },
  backButton: {
    display: "inline-block",
    padding: "0.6rem 1.4rem",
    backgroundColor: "rgba(184,155,116,0.3)",
    borderRadius: "6px",
    color: "#2e2b26",
    textDecoration: "none",
    fontFamily: '"Playfair Display", serif',
    fontSize: "0.95rem",
  },
};

export default ViewPost;
