import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function StrongPasswordsPresentation() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [user, setUser] = useState(null);
  const [lessonStarted, setLessonStarted] = useState(false);
  const [lessonCompleted, setLessonCompleted] = useState(false);

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

  // Track lesson start
  useEffect(() => {
    if (user && !lessonStarted) {
      const trackStart = async () => {
        try {
          await fetch('/api/activity/track', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              activity: 'Started Strong Passwords lesson',
              userId: user.id
            }),
          });
          setLessonStarted(true);
        } catch (error) {
          console.error('Failed to track lesson start:', error);
        }
      };
      trackStart();
    }
  }, [user, lessonStarted]);

  // Track lesson completion
  useEffect(() => {
    if (user && currentSlide === sections.length - 1 && !lessonCompleted) {
      const trackCompletion = async () => {
        try {
          await fetch('/api/activity/track', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              activity: 'Completed Strong Passwords lesson',
              userId: user.id
            }),
          });
          setLessonCompleted(true);
        } catch (error) {
          console.error('Failed to track lesson completion:', error);
        }
      };
      trackCompletion();
    }
  }, [user, currentSlide, lessonCompleted]);

  const sections = [
    {
      title: "What is a Strong Password?",
      img: "https://via.placeholder.com/800x300/0072ff/ffffff?text=Strong+Passwords",
      content: "A strong password is long, unique, and combines letters, numbers, and symbols. It makes it harder for hackers to guess or crack.",
    },
    {
      title: "Examples of Weak Passwords",
      content: (
        <ul>
          <li><b>123456:</b> Common and easily guessed.</li>
          <li><b>password:</b> Too simple and widely used.</li>
          <li><b>qwerty:</b> Based on keyboard patterns.</li>
        </ul>
      ),
    },
    {
      title: "Tips for Creating Strong Passwords",
      content: (
        <ul>
          <li>Use at least 12 characters.</li>
          <li>Include uppercase and lowercase letters, numbers, and symbols.</li>
          <li>Avoid personal information like names or birthdays.</li>
        </ul>
      ),
    },
    {
      title: "Password Managers",
      content: (
        <>
          <p>Using a password manager can help you create and store strong, unique passwords for each account.</p>
          <ul>
            <li>Automates password generation and storage.</li>
            <li>Eliminates the need to remember multiple passwords.</li>
            <li>Improves overall account security.</li>
          </ul>
        </>
      ),
    },
    {
      title: "Multi-Factor Authentication (MFA)",
      content: (
        <>
          <p>Pairing strong passwords with MFA adds an extra layer of security to your accounts.</p>
          <ul>
            <li>Requires an additional verification step, like a code or biometric scan.</li>
            <li>Even if your password is compromised, your account remains protected.</li>
            <li>Recommended for all sensitive accounts (e.g., banking, email).</li>
          </ul>
        </>
      ),
    },
    {
      title: "Common Attacks on Passwords",
      content: (
        <ul>
          <li><b>Brute Force:</b> Automated guessing of passwords.</li>
          <li><b>Phishing:</b> Tricking users into revealing passwords via fake sites or emails.</li>
          <li><b>Keylogging:</b> Tracking what you type to steal passwords.</li>
        </ul>
      ),
    },
  ];

  const nextSection = () => setCurrentSlide((currentSlide + 1) % sections.length);
  const prevSection = () => setCurrentSlide((currentSlide - 1 + sections.length) % sections.length);
  const goToSection = (index) => setCurrentSlide(index);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="lesson-wrapper">
      <Head>
        <title>Strong Passwords Lesson</title>
        <link rel="stylesheet" href="/styles/homepagestyle.css" />
      </Head>

      <header>
        <h1><a href="/">Hacker's Path</a></h1>
      </header>

      <div className="roadmap">
        <a href="/leaderboard">Leaderboard</a>
        <a href="/lessons">Lessons</a>
        <a href="/quiz">Quizzes</a>
        <a href="/profile">Profile</a>
      </div>

      <div className="lesson-container">
        <div className="lesson-sidebar">
          <h3>Lesson Progress</h3>
          <ul>
            {sections.map((section, index) => (
              <li key={index} className={index === currentSlide ? "active" : ""} onClick={() => goToSection(index)}>
                {section.title}
              </li>
            ))}
          </ul>
        </div>

        <div className="lesson-content">
          <h2 className="lesson-text">{sections[currentSlide].title}</h2>
          {sections[currentSlide].img && (
            <img src={sections[currentSlide].img} alt={sections[currentSlide].title} />
          )}
          <div>{sections[currentSlide].content}</div>
        </div>
      </div>

      <div className="lesson-navigation centered-navigation">
        <button onClick={prevSection} disabled={currentSlide === 0}>Previous</button>
        <button onClick={nextSection} disabled={currentSlide === sections.length - 1}>Next</button>
      </div>

      <div className="final-navigation centered-navigation">
        <a href="/quiz/strong-passwords-quiz" className="quiz-link">Take the Quiz</a>
        <a href="/" className="home-link">Return to Homepage</a>
      </div>
    </div>
  );
}
