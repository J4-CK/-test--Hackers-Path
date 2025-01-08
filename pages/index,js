import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  // Fetch session on load
  useEffect(() => {
    async function checkSession() {
      const res = await fetch('/api/auth/session');
      const data = await res.json();

      if (res.ok) {
        setUser(data.user); // Set user data
      } else {
        router.push('/login'); // Redirect to login if not authenticated
      }
    }
    checkSession();
  }, [router]);

  // Handle logout
  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login'); // Redirect to login after logout
  }

  return (
    <div>
      {/* Link to external CSS */}
      <link rel="stylesheet" href="/styles/homepagestyle.css" />
      <header>
        <h1><a href="/">Hacker's Path</a></h1>
      </header>

      {/* Roadmap Section */}
      <div className="roadmap">
        <a href="/leaderboard">Leaderboard</a>
        <a href="/lessons">Lessons</a>
        <a href="/quizzes">Quizzes</a>
        <a href="/profile">Profile</a>
      </div>

      {/* Main Content Container */}
      <div className="container">
        {/* Player Stats Section */}
        <div className="stats">
          <div className="box">
            <h3>Daily Points</h3>
            <p>0</p>
          </div>
          <div className="box">
            <h3>All-Time Points</h3>
            <p>0</p>
          </div>
        </div>

        {/* Lessons Section */}
        <div className="section">
          <h2>Lessons</h2>
          <div className="buttons">
            <a href="/xss-presentation">XSS Presentation</a>
            <a href="/cybersecurity-presentation">What is Cybersecurity?</a>
            <a href="/strong-passwords-presentation">Strong Passwords</a>
          </div>
        </div>

        {/* Quizzes Section */}
        <div className="section">
          <h2>Quizzes</h2>
          <div className="buttons">
            <a href="/xss-quiz">XSS Quiz</a>
            <a href="/cybersecurity-quiz">What is Cybersecurity? Quiz</a>
            <a href="/strong-passwords-quiz">Strong Passwords Quiz</a>
          </div>
        </div>

        {/* Logout Button */}
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
}
