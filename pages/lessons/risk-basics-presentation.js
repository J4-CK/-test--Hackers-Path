import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

export default function RiskBasicsPresentation() {
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
              activity: 'Started Risk Basics lesson',
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
              activity: 'Completed Risk Basics lesson',
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
      title: "Risk Basics",
      content: (
        <>
          <p className="lesson-text">Understanding risk is key to effective cybersecurity.</p>
          <p className="lesson-text">Risk is defined as the potential for loss, damage, or destruction of assets or data as a result of a threat exploiting a vulnerability.</p>
          <p className="lesson-text">In this lesson, we'll explore the fundamentals of risk and how to assess it.</p>
        </>
      ),
    },
    {
      title: "Risk Components",
      content: (
        <>
          <p className="lesson-text">Risk consists of three primary components:</p>
          <div className="lesson-text"><b>Asset:</b> Something of value that needs protection (data, systems, etc.)</div>
          <div className="lesson-text"><b>Threat:</b> A potential cause of an unwanted incident</div>
          <div className="lesson-text"><b>Vulnerability:</b> A weakness that can be exploited by a threat</div>
        </>
      ),
    },
    {
      title: "Risk Assessment",
      content: (
        <>
          <p className="lesson-text">Risk assessment involves:</p>
          <div className="lesson-text">1. Identifying valuable assets</div>
          <div className="lesson-text">2. Determining potential threats</div>
          <div className="lesson-text">3. Identifying vulnerabilities</div>
          <div className="lesson-text">4. Assessing the likelihood and impact of exploitation</div>
        </>
      ),
    },
    {
      title: "Risk Management",
      content: (
        <>
          <p className="lesson-text">After assessing risks, organizations can manage them through:</p>
          <div className="lesson-text"><b>Risk Avoidance:</b> Eliminating the risk entirely</div>
          <div className="lesson-text"><b>Risk Mitigation:</b> Reducing the likelihood or impact</div>
          <div className="lesson-text"><b>Risk Transfer:</b> Shifting the risk to another party (e.g., insurance)</div>
          <div className="lesson-text"><b>Risk Acceptance:</b> Acknowledging and accepting the risk</div>
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
        <title>Risk Basics Lesson</title>
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
        <a href="/quiz/risk-basics-quiz" className="quiz-link">Take the Quiz</a>
        <a href="/" className="home-link">Return to Homepage</a>
      </div>
    </div>
  );
}
