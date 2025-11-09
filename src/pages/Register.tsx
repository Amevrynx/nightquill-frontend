import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      await register(username, email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Left Panel — Quote Section */}
      <motion.div
        style={styles.leftPanel}
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      >
        <blockquote style={styles.quote}>
          “Fill your paper with the breathings of your heart.”
        </blockquote>
        <p style={styles.quoteAuthor}>— William Shakespeare</p>
      </motion.div>

      {/* Right Panel — Form */}
      <motion.div
        style={styles.rightPanel}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.3, ease: 'easeInOut' }}
      >
        <div style={styles.formCard}>
          <h2 style={styles.title}>Join the Night Quill</h2>

          {error && <div style={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength={3}
                maxLength={20}
                style={styles.input}
              />
            </div>

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
                minLength={6}
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                style={styles.input}
              />
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              style={styles.button}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              {isLoading ? 'Joining...' : 'Join'}
            </motion.button>
          </form>

          <p style={styles.linkText}>
            Already a scribe?{' '}
            <Link to="/login" style={styles.link}>
              Enter here
            </Link>
          </p>
        </div>
      </motion.div>
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
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    padding: '3rem',
    background: 'rgba(230, 224, 215, 0.6)',
    borderRight: '1px solid rgba(68, 53, 39, 0.2)',
  },
  quote: {
    fontSize: '1.9rem',
    textAlign: 'center' as const,
    lineHeight: 1.5,
    fontStyle: 'italic',
    color: '#3d2f23',
    maxWidth: '420px',
  },
  quoteAuthor: {
    marginTop: '1.5rem',
    fontSize: '1rem',
    color: '#6b4e2e',
  },
  rightPanel: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '3rem',
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
    fontSize: '1.8rem',
    fontWeight: 700,
    color: '#1e1a15',
    marginBottom: '1.5rem',
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
    gap: '1rem',
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
    backgroundColor: 'rgba(255,255,255,0.5)',
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

export default Register;
