import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { postsAPI } from '../services/api';
import { motion } from 'framer-motion';

interface Post {
  _id: string;
  title: string;
  content: string;
  summary?: string;
  author: { username: string } | null;
  tags: string[];
  views: number;
  createdAt: string;
}

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const gridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getPosts();
      setPosts(response.data.posts);
      setFilteredPosts(response.data.posts);
      setError('');
    } catch {
      setError('Failed to fetch tales from the quill...');
    } finally {
      setLoading(false);
    }
  };

  // live filtering as user types
  useEffect(() => {
    const query = searchTerm.toLowerCase();
    const filtered = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.summary?.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query)
    );
    setFilteredPosts(filtered);
  }, [searchTerm, posts]);

  // scroll reveal
  useEffect(() => {
    if (!gridRef.current) return;
    const cards = Array.from(gridRef.current.querySelectorAll('.reveal'));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            el.classList.add('show');
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.15 }
    );
    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, [filteredPosts]);

  const truncate = (text: string, len = 160) =>
    text.length > len ? text.slice(0, len) + '...' : text;

  if (loading)
    return <div style={styles.loading}>Ink drying on fresh parchment...</div>;

  return (
    <div style={styles.container}>
      {/* Header */}
      <motion.header
        style={styles.header}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 style={styles.title}>Tales of the Night Quill</h1>

        <div style={styles.searchForm as React.CSSProperties}>
          <input
            type="text"
            placeholder="Seek within the quill’s tales..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      </motion.header>

      {/* Error */}
      {error && <div style={styles.error}>{error}</div>}

      {/* Posts */}
      {filteredPosts.length === 0 ? (
        <div style={styles.noPosts}>
          {searchTerm
            ? 'No inked words found under that moonlight.'
            : 'No stories have been written yet.'}
        </div>
      ) : (
        <motion.div
          ref={gridRef}
          layout
          style={styles.postsGrid}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.7 }}
        >
          {filteredPosts.map((post, idx) => (
            <article
              key={post._id}
              className="reveal ink-card"
              style={{
                ...styles.postCard,
                ['--d' as any]: `${idx * 60}ms`,
              }}
            >
              <h2 style={styles.postTitle}>
                <Link to={`/post/${post._id}`} style={styles.postLink}>
                  {post.title}
                </Link>
              </h2>

              <p style={styles.meta}>
                ✒️ {post.author?.username || 'Unknown Scribe'} •{' '}
                {new Date(post.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>

              <p style={styles.summary}>
                {truncate(post.summary || post.content)}
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

              <div style={styles.footerRow}>
                <Link to={`/post/${post._id}`} style={styles.readMore}>
                  Read more →
                </Link>
                <span style={styles.views}>{post.views} reads</span>
              </div>
            </article>
          ))}
        </motion.div>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    width: '100%',
    padding: '7.25rem 3rem 3rem',
    position: 'relative',
    zIndex: 2,
    backgroundColor: '#f5f3ee', // ✨ flat parchment tone
    fontFamily: "'Cormorant Garamond', serif",
  },
  header: {
    maxWidth: '1300px',
    margin: '0 auto 2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid rgba(47, 37, 27, 0.25)',
    paddingBottom: '1rem',
  },
  title: {
    fontSize: '2.4rem',
    color: '#1c1813',
    fontWeight: 700,
    letterSpacing: '1px',
    textTransform: 'uppercase',
    margin: 0,
  },
  searchForm: {
    display: 'flex',
    alignItems: 'center',
  },
  searchInput: {
    padding: '0.6rem 1rem',
    border: '1px solid rgba(47, 37, 27, 0.35)',
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: '8px',
    fontFamily: "'Lora', serif",
    color: '#2b241c',
    width: '280px',
    outline: 'none',
  },
  postsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '2.2rem',
    maxWidth: '1300px',
    margin: '0 auto',
  },
  postCard: {
    background: 'rgba(255,255,255,0.7)',
    borderRadius: '12px',
    padding: '1.8rem',
    border: '1px solid rgba(47,37,27,0.15)',
    boxShadow: '0 6px 18px rgba(20, 15, 10, 0.1)',
    transition: 'transform 0.35s ease, boxShadow 0.35s ease',
  },
  postTitle: {
    fontSize: '1.6rem',
    marginBottom: '0.5rem',
  },
  postLink: {
    color: '#1e1a15',
    textDecoration: 'none',
    transition: 'color 0.25s ease',
  },
  meta: {
    fontSize: '0.95rem',
    color: '#5c4a36',
    marginBottom: '1rem',
  },
  summary: {
    color: '#2a2015',
    lineHeight: 1.6,
    marginBottom: '1rem',
    fontSize: '1.05rem',
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '0.5rem',
    marginBottom: '1rem',
  },
  tag: {
    fontSize: '0.85rem',
    color: '#6b4e2e',
    backgroundColor: 'rgba(107,78,46,0.08)',
    borderRadius: '6px',
    padding: '0.25rem 0.6rem',
  },
  footerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.95rem',
    color: '#3d3225',
  },
  readMore: {
    textDecoration: 'none',
    color: '#2e2b26',
    fontWeight: 600,
  },
  views: {
    color: '#6b4e2e',
    fontStyle: 'italic',
  },
  loading: {
    textAlign: 'center' as const,
    paddingTop: '4rem',
    color: '#5a4b3a',
    fontFamily: "'Lora', serif",
    fontSize: '1.2rem',
  },
  error: {
    textAlign: 'center' as const,
    color: '#a33',
    padding: '1rem',
    backgroundColor: 'rgba(255, 200, 200, 0.2)',
    borderRadius: '8px',
    maxWidth: '800px',
    margin: '0.5rem auto 1.5rem',
  },
  noPosts: {
    textAlign: 'center' as const,
    color: '#4b3a28',
    fontSize: '1.1rem',
    fontStyle: 'italic',
    marginTop: '2rem',
  },
};

export default Home;
