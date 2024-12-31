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

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login'); // Redirect to login after logout
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Hacker's Path</title>
        <style>
          {`
            /* General Body Styles */
            body {
              font-family: Arial, sans-serif;
              height: 100vh;
              margin: 0;
              padding: 0;
              text-align: center;
              color: #e0e0e0;
              background: linear-gradient(to bottom, #121212, #1a1a2e);
              background-repeat: no-repeat;
              background-attachment: fixed;
              background-size: cover;
            }

            /* Header */
            header {
              background-color: #1a1a2e;
              color: #b39ddb;
              padding: 20px;
              text-align: center;
              box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.5);
            }
            header h1 {
              margin: 0;
              font-size: 2.5em;
            }

            /* Roadmap navigation */
            .roadmap {
              display: flex;
              justify-content: space-around;
              background-color: #6a1b9a;
              color: white;
              padding: 10px 0;
            }
            .roadmap a {
              text-decoration: none;
              color: white;
              font-size: 1.1em;
              padding: 10px 15px;
              border-radius: 5px;
              transition: background-color 0.3s ease;
            }
            .roadmap a:hover {
              background-color: #4a148c;
            }

            /* Container */
            .container {
              margin: 20px auto;
              padding: 20px;
              max-width: 900px;
              background-color: #1e1e30;
              border-radius: 10px;
              box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
              position: relative;
              overflow: hidden;
            }
            .pikachu-bg {
              position: absolute;
              top: -50px;
              right: -50px;
              width: 300px;
              opacity: 0.2;
              z-index: -1;
            }

            /* Stats Section */
            .stats {
              display: flex;
              justify-content: space-between;
              margin: 20px 0;
            }
            .stats .box {
              background-color: #2b2b42;
              border: 2px solid #9575cd;
              border-radius: 10px;
              padding: 20px;
              text-align: center;
              font-size: 1.2em;
              color: #e0e0e0;
              flex: 1;
            }

            /* Section Headings */
            .section h2 {
              color: #b39ddb;
              font-size: 2em;
              border-bottom: 2px solid #b39ddb;
              padding-bottom: 10px;
              margin-bottom: 15px;
            }

            /* Buttons */
            .buttons a {
              padding: 15px;
              background-color: #6a1b9a;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              font-size: 1.1em;
              transition: background-color 0.3s ease;
              text-align: center;
            }
            .buttons a:hover {
              background-color: #4a148c;
            }

            /* Logout Button */
            .logout-btn {
              margin: 20px 0;
              padding: 10px 20px;
              background-color: #d32f2f;
              color: white;
              border: none;
              border-radius: 5px;
              cursor: pointer;
            }
            .logout-btn:hover {
              background-color: #b71c1c;
            }
          `}
        </style>
      </head>
      <body>
        <header>
          <h1>Hacker's Path</h1>
        </header>

        {/* Roadmap Section */}
        <div className="roadmap">
          <a href="/">Home</a>
          <a href="/lessons">Lessons</a>
          <a href="/quizzes">Quizzes</a>
          <a href="/profile">Profile</a>
        </div>

        {/* Main Content Container */}
        <div className="container">
          <img src="/pikachu.png" className="pikachu-bg" alt="Background" />

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
      </body>
    </html>
  );
}
