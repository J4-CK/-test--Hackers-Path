import { useEffect, useState } from 'react';
import Link from 'next/link';
import { HiBars3, HiXMark, HiHome } from 'react-icons/hi2';
import { IoLocationOutline } from 'react-icons/io5';

export default function MobileNav({ username }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    // Set current path on client side
    setCurrentPath(window.location.pathname);

    // Close menu on scroll
    const handleScroll = () => {
      if (menuOpen) setMenuOpen(false);
    };

    // Close menu when clicking outside of it
    const handleClickOutside = (e) => {
      const menu = document.querySelector('.mobile-menu');
      const hamburgerBtn = document.querySelector('.hamburger-btn');
      
      if (menuOpen && menu && !menu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      <div className="mobile-nav-controls">
        <div className="nav-left">
          <Link href="/" legacyBehavior>
            <a className="home-btn" aria-label="Home">
              <HiHome />
            </a>
          </Link>
          <Link href="/location" legacyBehavior>
            <a className="location-btn" aria-label="Location">
              <IoLocationOutline />
            </a>
          </Link>
        </div>
        
        <div className="site-title">Hacker's Path</div>
        
        <div className="nav-right">
          <button 
            className={`hamburger-btn ${menuOpen ? 'open' : ''}`} 
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <HiXMark /> : <HiBars3 />}
          </button>
        </div>
      </div>

      {/* Overlay that appears when menu is open */}
      <div 
        className={`menu-overlay ${menuOpen ? 'open' : ''}`} 
        onClick={() => setMenuOpen(false)}
      ></div>

      {/* Mobile menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <div className="menu-header">
          <div className="user-info">
            <div className="avatar">
              {username ? username.charAt(0).toUpperCase() : "U"}
            </div>
            <span className="username">{username || "User"}</span>
          </div>
        </div>
        <nav className="menu-nav">
          <h3>Main Menu</h3>
          <ul>
            <li className={currentPath === '/' ? 'active' : ''}>
              <Link href="/">
                <span>Home</span>
              </Link>
            </li>
          </ul>
          
          <h3>Lessons</h3>
          <ul>
            <li className={currentPath === '/lessons/strong-passwords-presentation' ? 'active' : ''}>
              <Link href="/lessons/strong-passwords-presentation">
                <span>Strong Passwords</span>
              </Link>
            </li>
            <li className={currentPath === '/lessons/CIA-triad-presentation' ? 'active' : ''}>
              <Link href="/lessons/CIA-triad-presentation">
                <span>CIA Triad</span>
              </Link>
            </li>
            <li className={currentPath === '/lessons/risk-basics-presentation' ? 'active' : ''}>
              <Link href="/lessons/risk-basics-presentation">
                <span>Risk Basics</span>
              </Link>
            </li>
            <li className={currentPath === '/lessons/risk-continued' ? 'active' : ''}>
              <Link href="/lessons/risk-continued">
                <span>Risk Continued</span>
              </Link>
            </li>
            <li className={currentPath === '/lessons/security-controls-presentation' ? 'active' : ''}>
              <Link href="/lessons/security-controls-presentation">
                <span>Security Controls</span>
              </Link>
            </li>
          </ul>
          
          <h3>Quizzes</h3>
          <ul>
            <li className={currentPath === '/quiz/CIA-Triad-Quiz' ? 'active' : ''}>
              <Link href="/quiz/CIA-Triad-Quiz">
                <span>CIA Triad Quiz</span>
              </Link>
            </li>
            <li className={currentPath === '/quiz/strong-passwords-quiz' ? 'active' : ''}>
              <Link href="/quiz/strong-passwords-quiz">
                <span>Strong Passwords Quiz</span>
              </Link>
            </li>
            <li className={currentPath === '/quiz/risk-basics-quiz' ? 'active' : ''}>
              <Link href="/quiz/risk-basics-quiz">
                <span>Risk Basics Quiz</span>
              </Link>
            </li>
            <li className={currentPath === '/quiz/risk-continued-quiz' ? 'active' : ''}>
              <Link href="/quiz/risk-continued-quiz">
                <span>Risk Continued Quiz</span>
              </Link>
            </li>
            <li className={currentPath === '/quiz/security-controls-quiz' ? 'active' : ''}>
              <Link href="/quiz/security-controls-quiz">
                <span>Security Controls Quiz</span>
              </Link>
            </li>
          </ul>
          
          <div className="menu-footer">
            <form action="/api/auth/logout" method="POST">
              <button type="submit" className="logout-btn">Logout</button>
            </form>
          </div>
        </nav>
      </div>

      {/* Global styles for the mobile navigation */}
      <style jsx>{`
        /* Navigation bar fixed at the top */
        .mobile-nav-controls {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 60px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #1a1a2e;
          color: white;
          padding: 0 15px;
          z-index: 1000;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
        }
        
        .nav-left, .nav-right {
          display: flex;
          align-items: center;
          min-width: 40px; /* Ensure consistent spacing */
        }
        
        .site-title {
          font-size: 20px;
          font-weight: bold;
          color: #8c30c2;
          text-shadow: 0 0 5px rgba(140, 48, 194, 0.3);
          flex: 1;
          text-align: center;
        }
        
        .home-btn, .location-btn {
          background: none;
          border: none;
          font-size: 24px;
          color: white;
          cursor: pointer;
          padding: 5px;
          margin-right: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.3s ease;
        }
        
        .home-btn:hover, .location-btn:hover {
          color: #8c30c2;
        }
        
        .hamburger-btn {
          background: none;
          border: none;
          font-size: 28px;
          color: white;
          cursor: pointer;
          padding: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s ease, color 0.3s ease;
        }
        
        .hamburger-btn:hover {
          color: #8c30c2;
        }
        
        .hamburger-btn.open {
          transform: rotate(90deg);
          color: #8c30c2;
        }
        
        /* Menu overlay */
        .menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.7);
          z-index: 1001;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s ease, visibility 0.3s ease;
        }
        
        .menu-overlay.open {
          opacity: 1;
          visibility: visible;
        }
        
        /* Mobile menu */
        .mobile-menu {
          position: fixed;
          top: 0;
          right: -280px;
          width: 280px;
          height: 100%;
          background-color: #0f0f1a;
          z-index: 1002;
          overflow-y: auto;
          transition: right 0.3s ease;
          box-shadow: -2px 0 10px rgba(0, 0, 0, 0.5);
          display: flex;
          flex-direction: column;
        }
        
        .mobile-menu.open {
          right: 0;
        }
        
        .menu-header {
          padding: 20px;
          background-color: #1a1a2e;
          border-bottom: 1px solid #292945;
        }
        
        .user-info {
          display: flex;
          align-items: center;
        }
        
        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #8c30c2;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          margin-right: 10px;
        }
        
        .username {
          color: white;
          font-weight: 500;
        }
        
        .menu-nav {
          padding: 15px;
          flex: 1;
        }
        
        .menu-nav h3 {
          color: #8c30c2;
          margin: 15px 0 10px;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .menu-nav ul {
          list-style: none;
          padding: 0;
          margin: 0 0 20px;
        }
        
        .menu-nav li {
          margin-bottom: 2px;
          border-radius: 4px;
          transition: background-color 0.3s ease;
        }
        
        .menu-nav li.active {
          background-color: rgba(140, 48, 194, 0.2);
        }
        
        .menu-nav li a {
          padding: 10px 15px;
          color: #e0e0e0;
          text-decoration: none;
          display: block;
          border-radius: 4px;
          transition: background-color 0.3s ease;
        }
        
        .menu-nav li a:hover {
          background-color: rgba(255, 255, 255, 0.05);
        }
        
        .menu-footer {
          padding: 15px;
          border-top: 1px solid #292945;
          margin-top: auto;
        }
        
        .logout-btn {
          width: 100%;
          padding: 10px;
          background-color: #8c30c2;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.3s ease;
        }
        
        .logout-btn:hover {
          background-color: #7628a0;
        }
        
        /* Add top padding to the body to prevent content from going behind fixed header */
        :global(body) {
          padding-top: 60px;
        }
        
        /* Ensure the page wrapper stays visible */
        :global(#page-wrapper) {
          position: relative;
          z-index: 1;
        }
        
        /* Add top margin to the header to push it below the navbar */
        :global(header) {
          margin-top: 5px;
          display: none; /* Hide the duplicate header since we have the title in the navbar */
        }
        
        /* Mobile adjustments */
        @media (max-width: 480px) {
          .site-title {
            font-size: 18px;
          }
          
          .home-btn, .location-btn {
            font-size: 22px;
          }
          
          .hamburger-btn {
            font-size: 26px;
          }
        }
      `}</style>
    </>
  );
} 