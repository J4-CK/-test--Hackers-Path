import { useState, useEffect } from 'react';

export default function MobileNav({ username }) {
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Handle window clicks to close menu if clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      // If click is outside menu and not on hamburger button
      if (menuOpen && !e.target.closest('.roadmap') && 
          !e.target.classList.contains('hamburger')) {
        setMenuOpen(false);
      }
    }
    
    // Only add listener when menu is open
    if (menuOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [menuOpen]);

  // Close menu on link click
  const handleNavLinkClick = () => {
    setMenuOpen(false);
  };
  
  // Toggle menu without triggering other events
  const toggleMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="navigation-wrapper">
      <a 
        href="/" 
        className="home-btn"
        aria-label="Go to homepage"
      >
        Home
      </a>
      
      <button 
        className={`hamburger ${menuOpen ? 'close-btn' : ''}`}
        onClick={toggleMenu} 
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        type="button"
      >
        {menuOpen ? '×' : '☰'}
      </button>
      
      <nav className={`roadmap ${menuOpen ? 'open' : ''}`}>
        <a href="/leaderboard" onClick={handleNavLinkClick}>Leaderboard</a>
        <a href="/lessons" onClick={handleNavLinkClick}>Lessons</a>
        <a href="/quiz" onClick={handleNavLinkClick}>Quizzes</a>
        <a href="/profile" onClick={handleNavLinkClick}>
          {username ? `Profile (${username})` : 'Profile'}
        </a>
      </nav>

      <style jsx>{`
        .navigation-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          display: flex;
          justify-content: space-between;
          padding: 10px 15px;
          z-index: 1000;
        }

        .home-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #5cb85c;
          color: white;
          border: none;
          width: 60px;
          height: 40px;
          border-radius: 4px;
          font-weight: bold;
          text-decoration: none;
          font-size: 14px;
        }

        .hamburger {
          background-color: #007bff;
          color: white;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 4px;
          font-size: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          margin-left: auto;
        }

        .close-btn {
          background-color: #dc3545;
        }

        .roadmap {
          position: fixed;
          top: 60px;
          right: -250px;
          width: 250px;
          height: 100vh;
          background-color: #333;
          padding: 20px;
          transition: right 0.3s ease;
          z-index: 999;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .roadmap.open {
          right: 0;
        }

        .roadmap a {
          color: white;
          text-decoration: none;
          font-size: 18px;
          padding: 10px;
          border-radius: 4px;
          transition: background-color 0.2s;
        }

        .roadmap a:hover {
          background-color: #444;
        }
      `}</style>
    </div>
  );
} 