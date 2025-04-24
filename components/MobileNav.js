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
    <div className="roadmap-wrapper">
      <div className="button-container">
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
      </div>
      
      <nav className={`roadmap ${menuOpen ? 'open' : ''}`}>
        <a href="/leaderboard" onClick={handleNavLinkClick}>Leaderboard</a>
        <a href="/lessons" onClick={handleNavLinkClick}>Lessons</a>
        <a href="/quiz" onClick={handleNavLinkClick}>Quizzes</a>
        <a href="/profile" onClick={handleNavLinkClick}>
          {username ? `Profile (${username})` : 'Profile'}
        </a>
      </nav>

      <style jsx>{`
        .roadmap-wrapper {
          width: 100%;
          background: #531d73;
          margin: 0;
          padding: 0;
        }
        
        .button-container {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px;
          position: relative;
        }
        
        .home-btn {
          position: absolute;
          left: 15px;
          background-color: #5cb85c;
          color: white;
          border: none;
          padding: 8px 15px;
          border-radius: 4px;
          font-weight: bold;
          text-decoration: none;
          font-size: 14px;
        }
        
        .hamburger {
          background: #6a1b9a;
          color: white;
          border: none;
          font-size: 1.8em;
          padding: 10px 15px;
          cursor: pointer;
          border-radius: 5px;
          z-index: 1000;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
          user-select: none;
        }
        
        .close-btn {
          background: #42155c;
        }
        
        .roadmap {
          display: none;
          flex-direction: column;
          width: 100%;
          background-color: #333;
          padding: 0;
          margin: 0;
        }
        
        .roadmap.open {
          display: flex;
          animation: slideDown 0.3s ease-in-out;
        }
        
        .roadmap a {
          color: white;
          text-decoration: none;
          font-size: 18px;
          padding: 15px;
          transition: background-color 0.2s;
          text-align: center;
        }
        
        .roadmap a:hover {
          background-color: #444;
        }
        
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @media (max-width: 768px) {
          .hamburger {
            display: block;
          }
        }
      `}</style>
    </div>
  );
} 