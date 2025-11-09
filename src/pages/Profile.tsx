import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { authAPI, postsAPI } from "../services/api";

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchProfile();
    fetchUserStats();
  }, [isAuthenticated, navigate]);

  const fetchProfile = async () => {
    try {
      const response = await authAPI.getMe();
      setProfile(response.data.user);
    } catch (err: any) {
      Error("Failed to load profile");
    }
  };

  const fetchUserStats = async () => {
    try {
      const response = await postsAPI.getMyPosts();
      const posts = response.data;
      const published = posts.filter((p: any) => p.published);
      const drafts = posts.filter((p: any) => !p.published);
      const totalViews = posts.reduce(
        (sum: number, p: any) => sum + (p.views || 0),
        0
      );

      setStats({
        totalPosts: posts.length,
        publishedPosts: published.length,
        draftPosts: drafts.length,
        totalViews,
      });
    } catch {
      Error("Failed to load stats");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!isAuthenticated) return null;
  if (loading)
    return (
      <div style={styles.loaderContainer}>
        <p style={styles.loaderText}>Lighting your candle...</p>
      </div>
    );

  return (
    <div style={styles.outer}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.avatar}>
            {(profile?.username || user?.username || "U")[0].toUpperCase()}
          </div>
          <div>
            <h1 style={styles.username}>{profile?.username}</h1>
            <p style={styles.email}>{profile?.email}</p>
            {profile?.createdAt && (
              <p style={styles.joined}>
                Joined on{" "}
                {new Date(profile.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div style={styles.statsGrid}>
          <div style={styles.statBox}>
            <span style={styles.statNumber}>{stats?.totalPosts || 0}</span>
            <span style={styles.statLabel}>Posts</span>
          </div>
          <div style={styles.statBox}>
            <span style={styles.statNumber}>{stats?.publishedPosts || 0}</span>
            <span style={styles.statLabel}>Published</span>
          </div>
          <div style={styles.statBox}>
            <span style={styles.statNumber}>{stats?.draftPosts || 0}</span>
            <span style={styles.statLabel}>Drafts</span>
          </div>
          <div style={styles.statBox}>
            <span style={styles.statNumber}>{stats?.totalViews || 0}</span>
            <span style={styles.statLabel}>Views</span>
          </div>
        </div>

        {/* Actions */}
        <div style={styles.actions}>
          <Link to="/create-post" style={styles.buttonAccent}>
            ✒️ Write a Post
          </Link>
          <Link to="/my-posts" style={styles.buttonSoft}>
            📖 View My Works
          </Link>
          <button onClick={handleLogout} style={styles.buttonDanger}>
            🕯️ Log Out
          </button>
        </div>

        {/* Signature */}
        <div style={styles.signatureSection}>
          <p style={styles.signatureLine}>— {profile?.username || "Anonymous"}</p>
          <p style={styles.signatureNote}>“Ink never forgets.”</p>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  outer: {
    minHeight: "100vh",
    backgroundColor: "#f7f3e9",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "7rem 1rem 4rem",
    fontFamily: '"Lora", serif',
  },
  loaderContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "80vh",
    backgroundColor: "#f7f3e9",
  },
  loaderText: {
    color: "#6b4e2e",
    fontFamily: '"Playfair Display", serif',
    fontSize: "1.2rem",
  },
  card: {
    backgroundColor: "#fffefb",
    borderRadius: "16px",
    boxShadow: "0 12px 35px rgba(0,0,0,0.08)",
    border: "1px solid rgba(107,78,46,0.15)",
    padding: "3rem 2.5rem",
    width: "100%",
    maxWidth: "850px",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "1.5rem",
    marginBottom: "2.5rem",
    borderBottom: "1px solid rgba(107,78,46,0.15)",
    paddingBottom: "1.5rem",
  },
  avatar: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    backgroundColor: "#6b4e2e",
    color: "#fffefb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2rem",
    fontFamily: '"Playfair Display", serif',
  },
  username: {
    fontSize: "2rem",
    color: "#2e2b26",
    fontFamily: '"Playfair Display", serif',
    margin: 0,
  },
  email: {
    color: "#4a3b2a",
    fontSize: "1rem",
    margin: "0.3rem 0",
  },
  joined: {
    fontSize: "0.9rem",
    color: "#7a624b",
    fontStyle: "italic",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "1.2rem",
    margin: "2rem 0 3rem",
  },
  statBox: {
    backgroundColor: "rgba(107,78,46,0.08)",
    borderRadius: "10px",
    textAlign: "center",
    padding: "1.2rem",
  },
  statNumber: {
    display: "block",
    fontFamily: '"Playfair Display", serif',
    fontSize: "1.8rem",
    color: "#2e2b26",
  },
  statLabel: {
    fontSize: "0.95rem",
    color: "#6b4e2e",
    letterSpacing: "0.5px",
  },
  actions: {
    display: "flex",
    gap: "1rem",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: "2.5rem",
  },
  buttonAccent: {
    backgroundColor: "#b89b74",
    color: "#fffefb",
    padding: "0.8rem 1.8rem",
    borderRadius: "8px",
    textDecoration: "none",
    fontFamily: '"Playfair Display", serif',
    transition: "all 0.3s ease",
  },
  buttonSoft: {
    backgroundColor: "rgba(107,78,46,0.15)",
    color: "#2e2b26",
    padding: "0.8rem 1.8rem",
    borderRadius: "8px",
    textDecoration: "none",
    fontFamily: '"Playfair Display", serif',
    transition: "all 0.3s ease",
  },
  buttonDanger: {
    backgroundColor: "#8a1f11",
    color: "#fffefb",
    padding: "0.8rem 1.8rem",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontFamily: '"Playfair Display", serif',
    transition: "all 0.3s ease",
  },
  signatureSection: {
    textAlign: "center",
    borderTop: "1px solid rgba(107,78,46,0.15)",
    paddingTop: "2rem",
  },
  signatureLine: {
    fontFamily: '"Dancing Script", cursive',
    fontSize: "1.8rem",
    color: "#6b4e2e",
    margin: 0,
  },
  signatureNote: {
    fontSize: "1rem",
    fontStyle: "italic",
    color: "#7a624b",
    marginTop: "0.3rem",
  },
};

export default Profile;
