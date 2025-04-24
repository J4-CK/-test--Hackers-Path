import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Loading from '../components/Loading';
import Footer from '../components/Footer';
import MobileNav from '../components/MobileNav';
import CTFValidator from '../components/CTFValidator';

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const currentYear = new Date().getFullYear();

  // Fetch session on load
  useEffect(() => {
    async function checkSession() {
      const res = await fetch('/api/auth/session');
      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
      } else {
        router.push('/login');
      }
    }
    checkSession();
  }, [router]);

  // Handle logout
  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  if (!user) {
    return (
      <div>
        <Head>
          <title>Hacker's Path</title>
          <link rel="icon" href="/favicon.ico" />
          <link rel="icon" type="image/png" href="/images/favicon.png" />
        </Head>
        <link rel="stylesheet" href="/styles/homepagestyle.css" />
        <Loading />
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>Hacker's Path</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" href="/images/favicon.png" />
      </Head>
      <link rel="stylesheet" href="/styles/homepagestyle.css" />

      <div id="page-wrapper">
        <MobileNav username={user.username} />

        {/* Hidden flag 2 - small invisible button that reveals flag when clicked */}
        <div className="hidden-flag-container">
          <button 
            className="hidden-flag" 
            title="Robots are watching..."
            onClick={(e) => {
              e.currentTarget.textContent = "CTF Flag 2: L0V3";
              e.currentTarget.classList.add('revealed');
            }}
          >
            🤖
          </button>
        </div>

        <div className="container">
          <div className="stats">
            <div className="box">
              <h3>Daily Points</h3>
              <p>{user.streak || 0}</p>
            </div>
            <div className="box">
              <h3>Login Streak</h3>
              <p>1</p>
            </div>
          </div>
          
          <div className="section">
            <h2>Lessons</h2>
            <div className="buttons">
              <a href="/lessons/strong-passwords-presentation">Strong Passwords</a>
              <a href="/lessons/CIA-triad-presentation">CIA Triad</a>
              <a href="/lessons/risk-basics-presentation">Risk Basics</a>
              <a href="/lessons/risk-continued">Risk Continued</a>
              <a href="/lessons/security-controls-presentation">Security Controls</a>
            </div>
          </div>

          <div className="section">
            <h2>Quizzes</h2>
            <div className="buttons">
              <a href="/quiz/CIA-Triad-Quiz">CIA Triad Quiz</a>
              <a href="/quiz/strong-passwords-quiz">Strong Passwords Quiz</a>
              <a href="/quiz/risk-basics-quiz">Risk Basics Quiz</a>
              <a href="/quiz/risk-continued-quiz">Risk Continued Quiz</a>
              <a href="/quiz/security-controls-quiz">Security Controls Quiz</a>
            </div>
          </div>
          
          {/* CTF Challenge Section */}
          <div className="section">
            <h2>Security Challenge</h2>
            <p>Test your cybersecurity skills with our Capture The Flag challenge!</p>
            <CTFValidator />
          </div>

          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      <Footer />

      <style jsx>{`
        .hidden-flag-container {
          position: absolute;
          top: 65px;
          right: 10px;
          z-index: 10;
        }
        
        .hidden-flag {
          background: transparent;
          border: none;
          color: transparent;
          font-size: 5px;
          cursor: pointer;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          border-radius: 50%;
          position: relative;
          overflow: hidden;
        }
        
        .hidden-flag:before {
          content: '🤖';
          position: absolute;
          opacity: 0.05;
          font-size: 20px;
        }
        
        .hidden-flag:hover:before {
          opacity: 0.2;
        }
        
        .hidden-flag.revealed {
          background-color: #a742c6;
          color: white;
          padding: 10px 15px;
          font-size: 16px;
          width: auto;
          height: auto;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }
        
        .hidden-flag.revealed:before {
          display: none;
        }
      `}</style>
    </div>
  );
}
