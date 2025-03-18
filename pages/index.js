import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

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
    return <div>Loading...</div>;
  }

  return (
    <div>
      <link rel="stylesheet" href="/styles/homepagestyle.css" />

      <header>
        <h1><a href="/">Hacker's Path</a></h1>
      </header>

      <div className="roadmap-wrapper">
        {!menuOpen ? (
          <button className="hamburger" onClick={() => setMenuOpen(true)}>
            ☰
          </button>
        ) : (
          <button className="hamburger close-btn" onClick={() => setMenuOpen(false)}>
            ×
          </button>
        )}
        <nav className={`roadmap ${menuOpen ? 'open' : ''}`}>
          <a href="/leaderboard" onClick={handleNavLinkClick}>Leaderboard</a>
          <a href="/htmllessons/lessons.html" onClick={handleNavLinkClick}>Lessons</a>
          <a href="/htmlquiz/quizzes.html" onClick={handleNavLinkClick}>Quizzes</a>
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
            <a href="/htmllessons/xss-presentation.html">XSS Presentation</a>
            <a href="/htmllessons/WhatisCybersecurity.html">What is Cybersecurity?</a>
            <a href="lessons/strong-passwords-presentation">Strong Passwords</a>
          </div>
        </div>

        <div className="section">
          <h2>Quizzes</h2>
          <div className="buttons">
            <a href="/quiz/CIA-Triad-Quiz">CIA Triad Quiz</a>
            <a href="/htmlquiz/xss-quiz.html">XSS Quiz</a>
            <a href="/htmlquiz/cybersecurity-quiz.html">What is Cybersecurity? Quiz</a>
            <a href="/htmlquiz/strong-passwords-quiz.html">Strong Passwords Quiz</a>
          </div>
        </div>

        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
}
