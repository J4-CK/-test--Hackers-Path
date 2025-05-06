import { useEffect, useState } from 'react';
import Link from 'next/link';
import { HiBars3, HiXMark, HiHome } from 'react-icons/hi2';

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
            <Link href="/profile">
              <div className="avatar-container">
                <div className="avatar-wrapper">
                  <div className="avatar">
                    {username ? username.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="user-details">
                    <span className="username">{username || "User"}</span>
                    <span className="view-profile">View Profile</span>
                  </div>
                </div>
              </div>
            </Link>
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
            <li className={currentPath === '/profile' ? 'active' : ''}>
              <Link href="/profile">
                <span>Profile</span>
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
          height: 64px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #1a1a2e;
          color: white;
          padding: 0 16px;
          z-index: 1000;
          box-shadow: 0 2px 15px rgba(0, 0, 0, 0.6);
        }
        
        .nav-left, .nav-right {
          display: flex;
          align-items: center;
          min-width: 40px; /* Ensure consistent spacing */
        }
        
        .site-title {
          font-size: 22px;
          font-weight: bold;
          color: #a742c6;
          text-shadow: 0 0 8px rgba(140, 48, 194, 0.4);
          flex: 1;
          text-align: center;
          letter-spacing: 0.5px;
        }
        
        .home-btn {
          background: none;
          border: none;
          font-size: 24px;
          color: white;
          cursor: pointer;
          padding: 8px;
          margin-right: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          border-radius: 50%;
        }
        
        .home-btn:hover {
          color: #a742c6;
          background-color: rgba(255, 255, 255, 0.05);
          transform: translateY(-2px);
        }
        
        .hamburger-btn {
          background: none;
          border: none;
          font-size: 28px;
          color: white;
          cursor: pointer;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          border-radius: 50%;
          position: relative;
        }
        
        .hamburger-btn:hover {
          color: #a742c6;
          background-color: rgba(255, 255, 255, 0.05);
        }
        
        .hamburger-btn.open {
          transform: rotate(90deg);
          color: #a742c6;
          background-color: rgba(140, 48, 194, 0.15);
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
          right: -300px;
          width: 300px;
          height: 100%;
          background-color: #0f0f1a;
          z-index: 1002;
          overflow-y: auto;
          transition: right 0.4s cubic-bezier(0.19, 1, 0.22, 1);
          box-shadow: -4px 0 20px rgba(0, 0, 0, 0.7);
          display: flex;
          flex-direction: column;
          color: #e0e0e0;
        }
        
        .mobile-menu.open {
          right: 0;
        }
        
        .menu-header {
          padding: 24px 20px;
          background-color: #1a1a2e;
          border-bottom: 1px solid #292945;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }
        
        .user-info {
          display: flex;
          align-items: center;
        }
        
        .avatar {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          background: linear-gradient(135deg, #a742c6 0%, #8030c2 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          margin-right: 12px;
          box-shadow: 0 2px 8px rgba(140, 48, 194, 0.4);
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
          font-size: 18px;
          flex-shrink: 0;
        }
        
        .avatar-container {
          display: flex;
          flex-direction: column;
          cursor: pointer;
          position: relative;
          padding: 5px;
          border-radius: 10px;
          transition: all 0.3s ease;
          width: 100%;
        }
        
        .avatar-container:hover {
          background-color: rgba(255, 255, 255, 0.05);
        }
        
        .avatar-wrapper {
          display: flex;
          align-items: center;
        }
        
        .avatar-container .avatar {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          background: linear-gradient(135deg, #a742c6 0%, #8030c2 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          margin-right: 12px;
          box-shadow: 0 2px 8px rgba(140, 48, 194, 0.4);
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
          font-size: 18px;
          flex-shrink: 0;
        }
        
        .user-details {
          display: flex;
          flex-direction: column;
        }
        
        .username {
          color: white;
          font-weight: 600;
          font-size: 16px;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }
        
        .avatar-container .username {
          color: white;
          font-weight: 600;
          font-size: 16px;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }
        
        .view-profile {
          font-size: 12px;
          color: #a742c6;
          opacity: 0.8;
          transition: all 0.3s ease;
        }
        
        .avatar-container:hover .view-profile {
          opacity: 1;
          text-decoration: underline;
        }
        
        .menu-nav {
          padding: 15px;
          flex: 1;
        }
        
        .menu-nav h3 {
          color: #a742c6;
          margin: 20px 0 12px;
          font-size: 15px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          font-weight: 700;
          text-shadow: 0 0 10px rgba(140, 48, 194, 0.4);
          padding-left: 5px;
          display: flex;
          align-items: center;
        }
        
        .menu-nav h3:after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, rgba(140, 48, 194, 0.4), transparent);
          margin-left: 10px;
        }
        
        .menu-nav ul {
          list-style: none;
          padding: 0;
          margin: 0 0 25px;
        }
        
        .menu-nav li {
          margin-bottom: 8px;
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        
        .menu-nav li.active {
          background-color: rgba(140, 48, 194, 0.15);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          transform: translateX(3px);
        }
        
        .menu-nav li.active a {
          color: #fff;
          font-weight: 600;
          background-color: rgba(255, 255, 255, 0.07);
          border-color: rgba(140, 48, 194, 0.3);
        }
        
        .menu-nav li a {
          padding: 12px 16px;
          color: #e0e0e0;
          text-decoration: none;
          display: block;
          display: flex;
          align-items: center;
          border-radius: 8px;
          transition: all 0.3s ease;
          font-size: 15px;
          position: relative;
          overflow: hidden;
          background-color: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(140, 48, 194, 0.1);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .menu-nav li a span {
          position: relative;
          z-index: 2;
        }
        
        .menu-nav li a:before {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          height: 2px;
          width: 0;
          background: linear-gradient(90deg, #a742c6, #8030c2);
          transition: width 0.3s ease;
          z-index: 1;
        }
        
        .menu-nav li a:hover {
          background-color: rgba(255, 255, 255, 0.07);
          transform: translateX(3px);
          color: #fff;
          border-color: rgba(140, 48, 194, 0.3);
        }
        
        .menu-nav li a:hover:before {
          width: 100%;
        }
        
        .menu-footer {
          padding: 20px;
          border-top: 1px solid #292945;
          margin-top: auto;
          background-color: #1a1a2e;
        }
        
        .logout-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #a742c6 0%, #8030c2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
          font-size: 16px;
          letter-spacing: 0.5px;
          box-shadow: 0 4px 12px rgba(140, 48, 194, 0.3);
          position: relative;
          overflow: hidden;
        }
        
        .logout-btn:after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, 
            rgba(255, 255, 255, 0) 0%, 
            rgba(255, 255, 255, 0.2) 50%, 
            rgba(255, 255, 255, 0) 100%);
          transition: left 0.7s ease;
        }
        
        .logout-btn:hover {
          background: linear-gradient(135deg, #b347d6 0%, #9035d7 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(140, 48, 194, 0.4);
        }
        
        .logout-btn:hover:after {
          left: 100%;
        }
        
        .logout-btn:active {
          transform: translateY(1px);
          box-shadow: 0 2px 8px rgba(140, 48, 194, 0.3);
        }
        
        /* Add top padding to the body to prevent content from going behind fixed header */
        :global(body) {
          padding-top: 70px; /* Increased from 60px to 70px for more space */
        }
        
        /* Ensure the page wrapper stays visible */
        :global(#page-wrapper) {
          position: relative;
          z-index: 1;
          padding-top: 10px; /* Added padding to the page wrapper */
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
          
          .home-btn {
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