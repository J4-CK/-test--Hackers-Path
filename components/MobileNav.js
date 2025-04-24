import { useState, useEffect } from 'react';

export default function MobileNav() {
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
        <a href="/profile" onClick={handleNavLinkClick}>Profile</a>
      </nav>
    </div>
  );
} 