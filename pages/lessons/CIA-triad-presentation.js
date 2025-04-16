import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Loading from '../../components/Loading';

export default function CIATriadPresentation() {
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
              activity: 'Started CIA Triad lesson',
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
              activity: 'Completed CIA Triad lesson',
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
      title: "Introduction to the CIA Triad",
      content: (
        <>
          <p className="lesson-text">The CIA Triad is a fundamental model in cybersecurity, representing three key principles:</p>
          <div className="lesson-text"><b>Confidentiality:</b> Ensuring sensitive information is accessible only to authorized users.</div>
          <div className="lesson-text"><b>Integrity:</b> Maintaining the accuracy and trustworthiness of data.</div>
          <div className="lesson-text"><b>Availability:</b> Guaranteeing reliable access to information when needed.</div>
        </>
      ),
    },
    {
      title: "Confidentiality",
      content: (
        <>
          <p className="lesson-text">Confidentiality focuses on protecting sensitive data from unauthorized access. Key practices include:</p>
          <div className="lesson-text">- Using strong encryption to secure data.</div>
          <div className="lesson-text">- Implementing access controls and authentication.</div>
          <div className="lesson-text">- Regularly training employees on data privacy policies.</div>
        </>
      ),
    },
    {
      title: "Integrity",
      content: (
        <>
          <p className="lesson-text">Integrity ensures that data remains accurate and unaltered. This is achieved by:</p>
          <div className="lesson-text">- Implementing checksums and hash functions to detect data tampering.</div>
          <div className="lesson-text">- Using version control to track changes.</div>
          <div className="lesson-text">- Monitoring systems for unauthorized modifications.</div>
        </>
      ),
    },
    {
      title: "Availability",
      content: (
        <>
          <p className="lesson-text">Availability ensures that systems and data are accessible when needed. Techniques to ensure availability include:</p>
          <div className="lesson-text">- Using backups and disaster recovery plans.</div>
          <div className="lesson-text">- Implementing redundancy in critical systems.</div>
          <div className="lesson-text">- Protecting against Denial-of-Service (DoS) attacks.</div>
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
    return (
      <div>
        <Head>
          <title>CIA Triad Lesson</title>
          <link rel="stylesheet" href="/styles/homepagestyle.css" />
          <link rel="stylesheet" href="/styles/lessonstyle.css" />
        </Head>
        <Loading />
      </div>
    );
  }

  return (
    <div className="lesson-wrapper">
      <Head>
        <title>CIA Triad Lesson</title>
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
        <a href="/quiz/CIA-Triad-Quiz" className="quiz-link">Take the Quiz</a>
        <a href="/" className="home-link">Return to Homepage</a>
      </div>
    </div>
  );
}
