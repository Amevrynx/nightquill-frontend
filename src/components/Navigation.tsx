import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navigation: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={styles.nav as React.CSSProperties}>
      <div style={styles.glassContainer as React.CSSProperties}>
        <Link to="/" style={styles.logo as React.CSSProperties}>
          <span style={styles.logoAccent as React.CSSProperties}>Night</span> Quill
        </Link>

        <div style={styles.navLinks as React.CSSProperties}>
          <Link to="/" style={styles.link as React.CSSProperties}>Home</Link>

          {isAuthenticated ? (
            <>
              <Link to="/my-posts" style={styles.link as React.CSSProperties}>My Thoughts</Link>
              <Link to="/create-post" style={styles.link as React.CSSProperties}>My Quill</Link>
              <Link to="/profile" style={styles.username as React.CSSProperties}>
                <i>{user?.username}</i>
              </Link>
              <button
                onClick={handleLogout}
                style={styles.button as React.CSSProperties}
                onMouseEnter={(e) => {
                  const el = e.target as HTMLButtonElement;
                  el.style.backgroundColor = 'rgba(184, 155, 116, 0.25)';
                  el.style.color = '#2e2b26';
                }}
                onMouseLeave={(e) => {
                  const el = e.target as HTMLButtonElement;
                  el.style.backgroundColor = 'transparent';
                  el.style.color = '#2e2b26';
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link as React.CSSProperties}>Login</Link>
              <Link to="/register" style={styles.link as React.CSSProperties}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  nav: {
    position: 'fixed',
    top: '2rem',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '85%',
    zIndex: 999,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'auto',
  },
  glassContainer: {
    background: 'rgba(245, 243, 238, 0.6)',
    border: '1px solid rgba(107, 78, 46, 0.25)',
    borderRadius: '18px',
    boxShadow: '0 6px 25px rgba(47, 37, 27, 0.12)',
    padding: '1rem 2.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: '1200px',
    fontFamily: '"Playfair Display", serif',
    color: '#2e2b26',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    overflow: 'hidden',
  },
  logo: {
    color: '#2e2b26',
    fontSize: '1.9rem',
    fontWeight: 700,
    textDecoration: 'none',
    letterSpacing: '1px',
  },
  logoAccent: {
    color: '#6b4e2e',
    fontWeight: 900,
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.4rem',
  },
  link: {
    color: '#2e2b26',
    textDecoration: 'none',
    fontSize: '1.05rem',
    fontWeight: 500,
    padding: '0.4rem 0.8rem',
    borderRadius: '6px',
    transition: 'all 0.3s ease',
    backgroundColor: 'transparent',
  },
  username: {
    color: '#6b4e2e',
    fontSize: '1rem',
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: 'transparent',
    color: '#2e2b26',
    border: '1px solid rgba(107, 78, 46, 0.4)',
    padding: '0.45rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontFamily: '"Lora", serif',
    transition: 'all 0.3s ease',
  },
};

export default Navigation;
