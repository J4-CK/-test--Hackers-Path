import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Loading from '../components/Loading';
import Footer from '../components/Footer';

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const currentYear = new Date().getFullYear();

  // Fetch session on load
  useEffect(() => {
    async function checkSession() {
      const res = await fetch('/api/auth/session');
      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
      } else {
        router.push('/login');
      }
    }
    checkSession();
  }, [router]);

  // Close menu on scroll
  useEffect(() => {
    const handleScroll = () => setMenuOpen(false);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle menu open/closed
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Close menu on link click
  const handleNavLinkClick = () => {
    setMenuOpen(false);
  };

  // Handle logout
  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  if (!user) {
    return (
      <div>
        <Head>
          <title>Hacker's Path</title>
          <link rel="icon" href="/favicon.ico" />
          <link rel="icon" type="image/png" href="/images/favicon.png" />
        </Head>
        <link rel="stylesheet" href="/styles/homepagestyle.css" />
        <Loading />
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>Hacker's Path</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" href="/images/favicon.png" />
      </Head>
      <link rel="stylesheet" href="/styles/homepagestyle.css" />

      <div id="page-wrapper">
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
          <div className="stats">
            <div className="box">
              <h3>Daily Points</h3>
              <p>{user.streak || 0}</p>
            </div>
            <div className="box">
              <h3>All-Time Points</h3>
              <p>{user.totalPoints || 0}</p>
            </div>
          </div>

          <div className="section">
            <h2>Lessons</h2>
            <div className="buttons">
              <a href="/lessons/strong-passwords-presentation">Strong Passwords</a>
              <a href="/lessons/CIA-triad-presentation">CIA Triad</a>
              <a href="/lessons/risk-basics-presentation">Risk Basics</a>
              <a href="/lessons/risk-continued">Risk Continued</a>
              <a href="/lessons/security-controls-presentation">Security Controls</a>
            </div>
          </div>

          <div className="section">
            <h2>Quizzes</h2>
            <div className="buttons">
              <a href="/quiz/CIA-Triad-Quiz">CIA Triad Quiz</a>
              <a href="/quiz/strong-passwords-quiz">Strong Passwords Quiz</a>
              <a href="/quiz/risk-basics-quiz">Risk Basics Quiz</a>
              <a href="/quiz/risk-continued-quiz">Risk Continued Quiz</a>
              <a href="/quiz/security-controls-quiz">Security Controls Quiz</a>
            </div>
          </div>

          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
