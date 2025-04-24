import { useState, useEffect } from 'react';

export default function MobileNav({ username }) {
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Handle window clicks to close menu if clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      // If click is outside menu and not on hamburger button
      if (menuOpen && !e.target.closest('.mobile-menu') && 
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

  // Close menu on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (menuOpen) {
        setMenuOpen(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
    <>
      {/* Desktop Navigation */}
      <div className="desktop-nav">
        <nav className="roadmap">
          <a href="/leaderboard">Leaderboard</a>
          <a href="/lessons">Lessons</a>
          <a href="/quiz">Quizzes</a>
          <a href="/profile">
            {username ? `Profile (${username})` : 'Profile'}
          </a>
        </nav>
      </div>
      
      {/* Mobile Navigation Controls */}
      <div className="mobile-nav-controls">
        <a 
          href="/" 
          className="home-btn"
          aria-label="Go to homepage"
        >
          &#8962;
        </a>
        
        <button 
          className={`hamburger ${menuOpen ? 'active' : ''}`}
          onClick={toggleMenu} 
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          type="button"
        >
          {menuOpen ? (
            <span className="close-icon">&#10005;</span>
          ) : (
            <>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </>
          )}
        </button>
      </div>
      
      {/* Mobile Menu Overlay */}
      <div className={`menu-overlay ${menuOpen ? 'active' : ''}`} aria-hidden={!menuOpen}>
        <div className="mobile-menu">
          <a href="/leaderboard" onClick={handleNavLinkClick}>Leaderboard</a>
          <a href="/lessons" onClick={handleNavLinkClick}>Lessons</a>
          <a href="/quiz" onClick={handleNavLinkClick}>Quizzes</a>
          <a href="/profile" onClick={handleNavLinkClick}>
            {username ? `Profile (${username})` : 'Profile'}
          </a>
        </div>
      </div>

      <style jsx>{`
        /* Desktop Navigation */
        .desktop-nav {
          width: 100%;
          background: #531d73;
          padding: 0;
          margin: 0;
          display: block;
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
        
        /* Mobile Navigation Controls */
        .mobile-nav-controls {
          display: none;
          position: relative;
          width: 100%;
          padding: 10px 0;
          background: #531d73;
          z-index: 100;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          height: 60px;
        }
        
        .home-btn {
          position: absolute;
          left: 15px;
          top: 10px;
          background: #6a1b9a;
          color: white;
          border: none;
          font-size: 1.5rem;
          border-radius: 5px;
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          transition: background-color 0.2s;
          z-index: 1002; /* Ensure it's above other elements */
        }
        
        .home-btn:hover {
          background: #42155c;
        }
        
        /* Animated Hamburger Button */
        .hamburger {
          position: absolute;
          right: 15px;
          top: 10px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 40px;
          height: 40px;
          padding: 8px;
          background: #6a1b9a;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          transition: background-color 0.2s;
          z-index: 1002; /* Increased z-index to ensure visibility */
        }
        
        .hamburger:hover {
          background: #42155c;
        }
        
        .hamburger-line {
          display: block;
          width: 24px;
          height: 2px;
          margin: 2px 0;
          background-color: white;
          border-radius: 2px;
          transition: transform 0.3s, opacity 0.3s;
        }
        
        .hamburger.active {
          background: #42155c;
        }
        
        .close-icon {
          font-size: 18px;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }
        
        /* Mobile Menu Overlay */
        .menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 999;
          visibility: hidden;
          opacity: 0;
          transition: opacity 0.3s, visibility 0.3s;
          display: flex;
          justify-content: flex-end;
        }
        
        .menu-overlay.active {
          visibility: visible;
          opacity: 1;
        }
        
        .mobile-menu {
          width: 270px;
          height: 100%;
          background-color: #2a0e3b;
          padding: 60px 0 20px;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          transform: translateX(100%);
          transition: transform 0.3s ease-in-out;
          box-shadow: -2px 0 10px rgba(0, 0, 0, 0.3);
        }
        
        .menu-overlay.active .mobile-menu {
          transform: translateX(0);
        }
        
        .mobile-menu a {
          padding: 15px 25px;
          color: white;
          text-decoration: none;
          font-size: 18px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          transition: background-color 0.2s;
        }
        
        .mobile-menu a:hover {
          background-color: #42155c;
        }
        
        /* Media Queries */
        @media (max-width: 768px) {
          .desktop-nav {
            display: none;
          }
          
          .mobile-nav-controls {
            display: block;
          }
          
          /* Remove top margin from header since nav is now below header */
          header h1 {
            margin-top: 0 !important;
            padding-top: 0 !important;
          }
          
          /* Remove top padding from body since nav is no longer fixed */
          body {
            padding-top: 0;
          }
          
          /* Adjust page wrapper margin */
          #page-wrapper {
            margin-top: 0;
          }
        }
      `}</style>
    </>
  );
} 