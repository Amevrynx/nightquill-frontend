import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to log in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Left Panel — Form */}
      <motion.div
        style={styles.leftPanel}
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      >
        <div style={styles.formCard}>
          <h2 style={styles.title}>Welcome back, Scribe</h2>
          <p style={styles.subtitle}>The ink waits for your words.</p>

          {error && <div style={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.input}
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className="flicker-btn"
              style={styles.button}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              {loading ? 'Entering...' : 'Enter the Quill'}
            </motion.button>
          </form>

          <p style={styles.linkText}>
            New to this realm?{' '}
            <Link to="/register" style={styles.link}>
              Join the Night Quill
            </Link>
          </p>
        </div>
      </motion.div>

      {/* Right Panel — Quote */}
      <motion.div
        style={styles.rightPanel}
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
      >
        <blockquote style={styles.quote}>
          “There is nothing to writing.  
          All you do is sit down at a typewriter and bleed.”
        </blockquote>
        <p style={styles.quoteAuthor}>— Ernest Hemingway</p>
      </motion.div>
      <style>{`
        @keyframes candleGlow {
          0%, 100% { box-shadow: 0 0 8px rgba(107,78,46,0.3), 0 0 20px rgba(107,78,46,0.15); }
          50% { box-shadow: 0 0 12px rgba(107,78,46,0.5), 0 0 26px rgba(107,78,46,0.25); }
        }
        .flicker-btn {
          animation: candleGlow 3s ease-in-out infinite alternate;
        }
      `}</style>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    backgroundColor: '#f5f3ee',
    color: '#2b241c',
    fontFamily: "'Cormorant Garamond', serif",
    overflow: 'hidden',
  },
  leftPanel: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '3rem',
    borderRight: '1px solid rgba(68, 53, 39, 0.25)',
  },
  rightPanel: {
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    padding: '3rem',
    background: 'rgba(230, 224, 215, 0.65)',
  },
  quote: {
    fontSize: '1.9rem',
    textAlign: 'center' as const,
    lineHeight: 1.5,
    fontStyle: 'italic',
    color: '#3d2f23',
    maxWidth: '440px',
  },
  quoteAuthor: {
    marginTop: '1.5rem',
    fontSize: '1rem',
    color: '#6b4e2e',
  },
  formCard: {
    background: 'rgba(255,255,255,0.6)',
    border: '1px solid rgba(47, 37, 27, 0.15)',
    borderRadius: '16px',
    padding: '2.5rem 2rem',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 6px 18px rgba(47, 37, 27, 0.15)',
    backdropFilter: 'blur(8px)',
  },
  title: {
    textAlign: 'center' as const,
    fontSize: '1.9rem',
    fontWeight: 700,
    color: '#1e1a15',
    marginBottom: '0.5rem',
  },
  subtitle: {
    textAlign: 'center' as const,
    color: '#6b4e2e',
    marginBottom: '1.5rem',
    fontSize: '1rem',
  },
  error: {
    backgroundColor: 'rgba(255, 99, 71, 0.15)',
    color: '#b34a4a',
    padding: '0.75rem',
    borderRadius: '6px',
    marginBottom: '1rem',
    border: '1px solid rgba(255, 99, 71, 0.3)',
  },
  form: {
    display: 'grid',
    gap: '1.2rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  label: {
    marginBottom: '0.3rem',
    fontWeight: 600,
    color: '#3a2e23',
    fontSize: '1rem',
  },
  input: {
    padding: '0.7rem',
    border: '1px solid rgba(47, 37, 27, 0.3)',
    borderRadius: '6px',
    backgroundColor: 'rgba(255,255,255,0.55)',
    color: '#2b241c',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.3s ease',
  },
  button: {
    backgroundColor: '#6b4e2e',
    color: 'white',
    padding: '0.8rem',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '0.5rem',
    transition: 'background 0.3s ease',
  },
  linkText: {
    textAlign: 'center' as const,
    marginTop: '1rem',
    fontSize: '1rem',
  },
  link: {
    color: '#6b4e2e',
    textDecoration: 'none',
    borderBottom: '1px solid rgba(107, 78, 46, 0.3)',
  },
};

export default Login;
