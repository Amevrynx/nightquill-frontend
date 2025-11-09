import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { postsAPI } from "../services/api";

interface Post {
  _id: string;
  title: string;
  content: string;
  summary?: string;
  tags: string[];
  published: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
}

const MyPosts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchPosts();
  }, [isAuthenticated, navigate]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getMyPosts();
      setPosts(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await postsAPI.deletePost(postId);
      setPosts(posts.filter((post) => post._id !== postId));
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete post");
    } finally {
    }
  };

  const handleTogglePublish = async (postId: string, currentStatus: boolean) => {
    try {
      const response = await postsAPI.updatePost(postId, {
        published: !currentStatus,
      });
      setPosts(
        posts.map((post) =>
          post._id === postId
            ? { ...post, published: response.data.published }
            : post
        )
      );
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update post status");
    } finally {
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (!isAuthenticated) return null;
  if (loading)
    return (
      <div style={styles.loadingContainer}>
        <p style={styles.loading}>Gathering your thoughts...</p>
      </div>
    );

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>My Thoughts</h1>
        <button onClick={() => navigate("/create-post")} style={styles.createButton}>
          ✒️ Write Something New
        </button>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {posts.length === 0 ? (
        <div style={styles.emptyState}>
          <h3>No imagination yet?</h3>
          <p>Write something your heart whispers...</p>
          <button onClick={() => navigate("/create-post")} style={styles.createButton}>
            Begin Your First Tale
          </button>
        </div>
      ) : (
        <div style={styles.grid}>
          {posts.map((post, index) => (
            <div
              key={post._id}
              className="fadeInCard"
              style={{
                ...styles.card,
                animationDelay: `${index * 0.15}s`,
              }}
            >
              <div style={styles.cardHeader}>
                <h3 style={styles.postTitle}>{post.title}</h3>
                <span
                  style={{
                    ...styles.status,
                    ...(post.published ? styles.published : styles.draft),
                  }}
                >
                  {post.published ? "Published" : "Draft"}
                </span>
              </div>

              {post.summary && <p style={styles.summary}>{post.summary}</p>}

              <p style={styles.content}>
                {post.content.length > 150
                  ? post.content.substring(0, 150) + "..."
                  : post.content}
              </p>

              {post.tags.length > 0 && (
                <div style={styles.tags}>
                  {post.tags.map((tag, i) => (
                    <span key={i} style={styles.tag}>
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div style={styles.meta}>
                <small>
                  {formatDate(post.createdAt)} • {post.views} views
                </small>
              </div>

              <div style={styles.actions}>
                <button onClick={() => navigate(`/post/${post._id}`)} style={styles.viewButton}>
                  View
                </button>
                <button onClick={() => navigate(`/edit-post/${post._id}`)} style={styles.editButton}>
                  Edit
                </button>
                <button
                  onClick={() => handleTogglePublish(post._id, post.published)}
                  style={post.published ? styles.unpublishButton : styles.publishButton}
                >
                  {post.published ? "Unpublish" : "Publish"}
                </button>
                <button onClick={() => handleDelete(post._id)} style={styles.deleteButton}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes fadeInCard {
          0% { opacity: 0; transform: translateY(25px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .fadeInCard {
          animation: fadeInCard 0.8s ease forwards;
        }
      `}</style>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    background: "radial-gradient(circle at 50% 80%, #f9f6f0 0%, #f3efe7 100%)",
    minHeight: "100vh",
    padding: "8rem 2rem 4rem",
    fontFamily: '"Lora", serif',
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2.5rem",
  },
  title: {
    fontFamily: '"Playfair Display", serif',
    fontSize: "2.5rem",
    color: "#2e2b26",
    borderBottom: "2px solid rgba(107,78,46,0.3)",
    paddingBottom: "0.5rem",
  },
  createButton: {
    backgroundColor: "#b89b74",
    color: "#fffefb",
    border: "none",
    padding: "0.9rem 1.6rem",
    borderRadius: "8px",
    cursor: "pointer",
    fontFamily: '"Playfair Display", serif',
    fontSize: "1rem",
    boxShadow: "0 4px 10px rgba(107,78,46,0.25)",
    transition: "all 0.3s ease",
  },
  error: {
    backgroundColor: "rgba(219,50,20,0.1)",
    color: "#8a1f11",
    padding: "1rem",
    borderRadius: "6px",
    border: "1px solid rgba(219,50,20,0.3)",
    textAlign: "center",
    marginBottom: "1rem",
  },
  emptyState: {
    textAlign: "center",
    backgroundColor: "#fffefb",
    padding: "3rem",
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    fontFamily: '"Playfair Display", serif',
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(370px, 1fr))",
    gap: "2rem",
  },
  card: {
    backgroundColor: "#fffefb",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    padding: "2rem",
    border: "1px solid rgba(107,78,46,0.15)",
    transition: "all 0.3s ease",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  postTitle: {
    fontFamily: '"Playfair Display", serif',
    color: "#2e2b26",
    fontSize: "1.4rem",
    margin: 0,
  },
  status: {
    padding: "0.3rem 0.8rem",
    borderRadius: "12px",
    fontSize: "0.85rem",
    textTransform: "uppercase",
    fontWeight: 600,
  },
  published: { backgroundColor: "#dce6d4", color: "#3e5a40" },
  draft: { backgroundColor: "#f5e3d3", color: "#7a5034" },
  summary: {
    color: "#4a3b2a",
    fontStyle: "italic",
    marginBottom: "0.8rem",
  },
  content: {
    color: "#3b2b19",
    marginBottom: "1rem",
    lineHeight: "1.6",
  },
  tags: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
    marginBottom: "1rem",
  },
  tag: {
    backgroundColor: "rgba(107,78,46,0.1)",
    color: "#3b2b19",
    padding: "0.3rem 0.8rem",
    borderRadius: "8px",
    fontSize: "0.85rem",
  },
  meta: {
    borderTop: "1px solid rgba(107,78,46,0.2)",
    paddingTop: "0.5rem",
    color: "#6b4e2e",
    fontSize: "0.9rem",
  },
  actions: {
    display: "flex",
    gap: "0.6rem",
    flexWrap: "wrap",
    marginTop: "1rem",
  },
  viewButton: {
    backgroundColor: "#6b4e2e",
    color: "#fffefb",
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "6px",
    fontFamily: '"Lora", serif',
    cursor: "pointer",
  },
  editButton: {
    backgroundColor: "#b89b74",
    color: "#fffefb",
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "6px",
    fontFamily: '"Lora", serif',
    cursor: "pointer",
  },
  publishButton: {
    backgroundColor: "#3e5a40",
    color: "#fffefb",
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "6px",
    fontFamily: '"Lora", serif',
    cursor: "pointer",
  },
  unpublishButton: {
    backgroundColor: "#dcb653",
    color: "#3b2b19",
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "6px",
    fontFamily: '"Lora", serif',
    cursor: "pointer",
  },
  deleteButton: {
    backgroundColor: "#8a1f11",
    color: "#fffefb",
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "6px",
    fontFamily: '"Lora", serif',
    cursor: "pointer",
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "80vh",
  },
  loading: {
    fontFamily: '"Playfair Display", serif',
    fontSize: "1.3rem",
    color: "#3b2b19",
  },
};

export default MyPosts;
