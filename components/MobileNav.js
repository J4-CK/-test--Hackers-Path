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
          &#8962;
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
          display: none; /* Hide by default on desktop */
          justify-content: space-between;
          align-items: center;
          padding: 10px 15px;
          position: relative;
        }
        
        .home-btn {
          background: #6a1b9a;
          color: white;
          border: none;
          font-size: 1.8em;
          padding: 10px 15px;
          border-radius: 5px;
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 48px;
          min-height: 48px;
          box-sizing: border-box;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .home-btn:hover {
          background: #42155c;
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
          display: none;
          min-width: 48px;
          min-height: 48px;
          box-sizing: border-box;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .close-btn {
          background: #42155c;
        }
        
        .roadmap {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
          padding: 15px;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          box-sizing: border-box;
        }
        
        .roadmap a {
          flex: 1;
          min-width: 150px;
          max-width: 250px;
          padding: 10px 20px;
          text-decoration: none;
          color: #e0e0e0;
          background-color: #6a1b9a;
          border-radius: 5px;
          text-align: center;
          transition: all 0.3s ease;
        }
        
        .roadmap a:hover {
          background-color: #42155c;
          color: #ffffff;
        }
        
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        /* Mobile Styles */
        @media (max-width: 768px) {
          .button-container {
            display: flex; /* Show on mobile */
          }
          
          .hamburger {
            display: block;
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
            flex: 1;
            min-width: 100%;
            max-width: 100%;
            margin: 5px 0;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
} 