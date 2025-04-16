import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function StrongPasswordsPresentation() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [user, setUser] = useState(null);
  const [lessonStarted, setLessonStarted] = useState(false);
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

  // Close menu on scroll
  useEffect(() => {
    const handleScroll = () => setMenuOpen(false);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      title: "Introduction to Password Security",
      content: (
        <>
          <p className="lesson-text">Passwords are the first line of defense for your accounts and information.</p>
          <p className="lesson-text">According to security research, weak or stolen passwords are responsible for 81% of hacking-related breaches.</p>
          <p className="lesson-text">In this lesson, we'll explore what makes a strong password and how to protect your accounts.</p>
        </>
      ),
    },
    {
      title: "What Makes a Password Weak?",
      content: (
        <>
          <p className="lesson-text">There are several common password mistakes to avoid:</p>
          <div className="lesson-text">- Using common passwords like "password" or "123456"</div>
          <div className="lesson-text">- Using personal information like your name or birthday</div>
          <div className="lesson-text">- Using short passwords with fewer than 8 characters</div>
          <div className="lesson-text">- Using only lowercase letters</div>
          <div className="lesson-text">- Using the same password for multiple accounts</div>
        </>
      ),
    },
    {
      title: "Creating Strong Passwords",
      content: (
        <>
          <p className="lesson-text">A strong password should include:</p>
          <div className="lesson-text">- At least 12 characters in length (longer is better)</div>
          <div className="lesson-text">- A mix of uppercase and lowercase letters</div>
          <div className="lesson-text">- Numbers and special characters</div>
          <div className="lesson-text">- No obvious personal information</div>
          <div className="lesson-text">- Unique passwords for each service</div>
        </>
      ),
    },
    {
      title: "Password Management Best Practices",
      content: (
        <>
          <p className="lesson-text">Managing many strong passwords can be challenging. Here are some best practices:</p>
          <div className="lesson-text">- Use a password manager to securely store your passwords</div>
          <div className="lesson-text">- Enable two-factor authentication (2FA) whenever possible</div>
          <div className="lesson-text">- Change passwords periodically, especially after a breach</div>
          <div className="lesson-text">- Consider using passphrase sentences that are easier to remember but hard to guess</div>
          <div className="lesson-text">- Never share your passwords with others</div>
        </>
      ),
    },
  ];

  const nextSection = () => setCurrentSlide((currentSlide + 1) % sections.length);
  const prevSection = () => setCurrentSlide((currentSlide - 1 + sections.length) % sections.length);
  const goToSection = (index) => setCurrentSlide(index);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  // Close menu when nav link is clicked
  const handleNavLinkClick = () => {
    setMenuOpen(false);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="lesson-wrapper">
      <Head>
        <title>Strong Passwords Lesson</title>
        <link rel="stylesheet" href="/styles/homepagestyle.css" />
        <link rel="stylesheet" href="/styles/lessonstyle.css" />
      </Head>

      <header>
        <h1><a href="/">Hacker's Path</a></h1>
      </header>

      <div className="roadmap-wrapper">
        {!menuOpen ? (
          <button className="hamburger" onClick={toggleMenu}>
            ☰
          </button>
        ) : (
          <button className="hamburger close-btn" onClick={toggleMenu}>
            ×
          </button>
        )}
        <nav className={`roadmap ${menuOpen ? 'open' : ''}`}>
          <a href="/leaderboard" onClick={handleNavLinkClick}>Leaderboard</a>
          <a href="/lessons" onClick={handleNavLinkClick}>Lessons</a>
          <a href="/quiz" onClick={handleNavLinkClick}>Quizzes</a>
          <a href="/profile" onClick={handleNavLinkClick}>Profile</a>
        </nav>
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
