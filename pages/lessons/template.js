import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Loading from "../../components/Loading";

export default function LessonTemplate() {
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
              activity: 'Started Template lesson',
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
              activity: 'Completed Template lesson',
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

  // Define your lesson sections here. Add more as needed.
  const sections = [
    {
      title: "First Section Title",
      content: (
        <>
          <p className="lesson-text">Section 1 content goes here.</p>
          <div className="lesson-text">Add more content as needed.</div>
        </>
      ),
    },
    {
      title: "Second Section Title",
      content: (
        <>
          <p className="lesson-text">Section 2 content goes here.</p>
          <p className="lesson-text">You can add multiple paragraphs.</p>
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
          <title>Lesson Template</title>
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
        <title>Lesson Template</title>
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
        <a href="/quiz/template-quiz" className="quiz-link">Take the Quiz</a>
        <a href="/" className="home-link">Return to Homepage</a>
      </div>
    </div>
  );
}
