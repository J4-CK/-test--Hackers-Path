import { useEffect, useState } from 'react';
import { supabase } from '../config/supabaseClient';
import { useRouter } from 'next/router';
import Loading from '../components/Loading';

export default function Quizzes() {
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
    return (
      <div>
        <link rel="stylesheet" href="/styles/homepagestyle.css" />
        <Loading />
      </div>
    );
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
          <h2>Available Quizzes</h2>
          <div className="buttons">
            <a href="/quiz/CIA-Triad-Quiz">
              CIA Triad Quiz
              <p>Test your knowledge of the CIA Triad</p>
            </a>
            <a href="/quiz/strong-passwords-quiz">
              Strong Passwords Quiz
              <p>Test your knowledge of password security</p>
            </a>
            <a href="/quiz/risk-basics-quiz">
              Risk Basics Quiz
              <p>Test your understanding of security risk fundamentals</p>
            </a>
            <a href="/quiz/risk-continued-quiz">
              Risk Continued Quiz
              <p>Advanced risk management and assessment concepts</p>
            </a>
            <a href="/quiz/security-controls-quiz">
              Security Controls Quiz
              <p>Test your knowledge of different security controls</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 