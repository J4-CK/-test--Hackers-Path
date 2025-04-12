import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Navigation({ user }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

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

  return (
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
        <a href="/lessons" onClick={handleNavLinkClick}>Lessons</a>
        <a href="/quiz" onClick={handleNavLinkClick}>Quizzes</a>
        <a href="/profile" onClick={handleNavLinkClick}>
          {user?.username ? `Profile (${user.username})` : 'Profile'}
        </a>
      </nav>
    </div>
  );
} 