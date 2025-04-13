import { useEffect, useState } from 'react';
import { supabase } from '../config/supabaseClient';
import { useRouter } from 'next/router';

export default function Lessons() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

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