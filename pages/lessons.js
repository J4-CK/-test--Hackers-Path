import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Loading from '../components/Loading';
import Head from 'next/head';

export default function Lessons() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/auth/session');
        const data = await res.json();

        if (res.ok) {
          setUser(data.user);
        } else {
          console.error('Session error:', data.error);
          router.push('/login');
        }
      } catch (error) {
        console.error('Failed to check session:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }
    checkSession();
  }, [router]);

  // Close menu on scroll
  useEffect(() => {
    let scrollTimer;
    
    const handleScroll = () => {
      // Use a small delay to prevent closing menu immediately after opening on mobile
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        setMenuOpen(false);
      }, 150);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimer);
    };
  }, []);

  // Close menu on link click
  const handleNavLinkClick = () => {
    setMenuOpen(false);
  };
  
  // Toggle menu function
  const toggleMenu = (e) => {
    // Prevent event propagation to avoid triggering scroll events
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };

  if (loading) {
    return (
      <div>
        <Head>
          <title>Lessons - Hacker's Path</title>
        </Head>
        <link rel="stylesheet" href="/styles/homepagestyle.css" />
        <Loading />
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <Head>
          <title>Lessons - Hacker's Path</title>
        </Head>
        <link rel="stylesheet" href="/styles/homepagestyle.css" />
        <div className="container">
          <div className="section">
            <h2>Please log in to view lessons</h2>
            <button onClick={() => router.push('/login')} className="logout-btn">Log In</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>Lessons - Hacker's Path</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" href="/images/favicon.png" />
      </Head>
      <link rel="stylesheet" href="/styles/homepagestyle.css" />

      <header>
        <h1><a href="/">Hacker's Path</a></h1>
      </header>

      <div className="roadmap-wrapper">
        {!menuOpen ? (
          <button className="hamburger" onClick={toggleMenu}>
            ☰
          </button>
        ) : (
          <button className="hamburger close-btn" onClick={toggleMenu}>
            ×
          </button>
        )}
        <nav className={`roadmap ${menuOpen ? 'open' : ''}`}>
          <a href="/leaderboard" onClick={handleNavLinkClick}>Leaderboard</a>
          <a href="/lessons" onClick={handleNavLinkClick}>Lessons</a>
          <a href="/quiz" onClick={handleNavLinkClick}>Quizzes</a>
          <a href="/profile" onClick={handleNavLinkClick}>
            {user.username ? `Profile (${user.username})` : 'Profile'}
          </a>
        </nav>
      </div>

      <div className="container">
        <div className="section">
          <h2>Available Lessons</h2>
          <div className="buttons">
            <a href="/lessons/CIA-triad-presentation">
              CIA Triad
              <p>Learn about Confidentiality, Integrity, and Availability</p>
            </a>
            <a href="/lessons/strong-passwords-presentation">
              Strong Passwords
              <p>Understanding password security</p>
            </a>
            <a href="/lessons/risk-basics-presentation">
              Risk Basics
              <p>Introduction to risk management</p>
            </a>
            <a href="/lessons/risk-continued">
              Risk Continued
              <p>Advanced risk management concepts</p>
            </a>
            <a href="/lessons/security-controls-presentation">
              Security Controls
              <p>Learn about different security controls</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 