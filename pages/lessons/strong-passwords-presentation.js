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
      content: (
        <>
          <p className="lesson-text">A strong password is designed to resist various types of password attacks:</p>
          <div className="lesson-text">- Uses a combination of letters, numbers, and symbols</div>
          <div className="lesson-text">- Has sufficient length (at least 12 characters)</div>
          <div className="lesson-text">- Is unique and not used across multiple accounts</div>
          <div className="lesson-text">- Avoids common words, phrases, or personal information</div>
        </>
      ),
    },
    {
      title: "Examples of Weak Passwords",
      content: (
        <>
          <p className="lesson-text">The following passwords are considered weak and should be avoided:</p>
          <div className="lesson-text"><b>123456:</b> Too simple and commonly used in data breaches</div>
          <div className="lesson-text"><b>password:</b> One of the first passwords attackers will try</div>
          <div className="lesson-text"><b>qwerty:</b> Based on keyboard patterns that are easy to guess</div>
          <div className="lesson-text"><b>birthdays/names:</b> Personal information that might be publicly available</div>
        </>
      ),
    },
    {
      title: "Tips for Creating Strong Passwords",
      content: (
        <>
          <p className="lesson-text">Follow these guidelines to create strong, secure passwords:</p>
          <div className="lesson-text">- Use at least 12 characters; longer is generally better</div>
          <div className="lesson-text">- Include uppercase and lowercase letters, numbers, and symbols</div>
          <div className="lesson-text">- Consider using a passphrase (a sequence of random words)</div>
          <div className="lesson-text">- Avoid using the same password for multiple accounts</div>
        </>
      ),
    },
    {
      title: "Password Managers",
      content: (
        <>
          <p className="lesson-text">Password managers help overcome the challenge of remembering multiple complex passwords:</p>
          <div className="lesson-text">- Securely store all your passwords in an encrypted vault</div>
          <div className="lesson-text">- Generate strong, unique passwords for each account</div>
          <div className="lesson-text">- Auto-fill credentials on websites and apps</div>
          <div className="lesson-text">- Sync passwords across all your devices</div>
        </>
      ),
    },
    {
      title: "Multi-Factor Authentication (MFA)",
      content: (
        <>
          <p className="lesson-text">MFA adds an extra layer of security beyond just passwords:</p>
          <div className="lesson-text">- Requires something you know (password) and something you have (phone/token)</div>
          <div className="lesson-text">- Protects your account even if your password is compromised</div>
          <div className="lesson-text">- Common forms include SMS codes, authenticator apps, and security keys</div>
          <div className="lesson-text">- Should be enabled on all important accounts (email, banking, social media)</div>
        </>
      ),
    },
    {
      title: "Common Password Attacks",
      content: (
        <>
          <p className="lesson-text">Understanding how passwords are attacked helps you better protect them:</p>
          <div className="lesson-text"><b>Brute Force:</b> Systematically trying all possible password combinations</div>
          <div className="lesson-text"><b>Dictionary Attack:</b> Trying common words and variations</div>
          <div className="lesson-text"><b>Credential Stuffing:</b> Using leaked passwords from one site to access others</div>
          <div className="lesson-text"><b>Phishing:</b> Tricking users into revealing passwords through fake websites or emails</div>
        </>
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
          {sections[currentSlide].content}
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
