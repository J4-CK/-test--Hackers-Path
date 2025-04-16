import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

export default function RiskContinued() {
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
              activity: 'Started Risk Continued lesson',
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
              activity: 'Completed Risk Continued lesson',
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
      title: "Advanced Risk Concepts",
      content: (
        <>
          <p className="lesson-text">Now that we understand the basics of risk, let's explore more advanced risk management concepts.</p>
          <p className="lesson-text">In this lesson, we'll cover risk metrics, risk frameworks, and risk governance.</p>
        </>
      ),
    },
    {
      title: "Quantitative vs. Qualitative Risk Assessment",
      content: (
        <>
          <p className="lesson-text">There are two main approaches to risk assessment:</p>
          <div className="lesson-text"><b>Quantitative:</b> Assigns monetary values and numerical probabilities to risks</div>
          <div className="lesson-text"><b>Qualitative:</b> Uses descriptive categories (high/medium/low) to evaluate risks</div>
          <p className="lesson-text">Many organizations use a hybrid approach, combining both methods.</p>
        </>
      ),
    },
    {
      title: "Risk Metrics",
      content: (
        <>
          <p className="lesson-text">Common risk metrics include:</p>
          <div className="lesson-text"><b>Annual Loss Expectancy (ALE) = Single Loss Expectancy (SLE) × Annual Rate of Occurrence (ARO)</b></div>
          <div className="lesson-text"><b>Risk Exposure = Probability × Impact</b></div>
          <div className="lesson-text"><b>Risk Priority Number (RPN) = Severity × Occurrence × Detection</b></div>
          <p className="lesson-text">These metrics help prioritize risks and allocate resources effectively.</p>
        </>
      ),
    },
    {
      title: "Risk Management Frameworks",
      content: (
        <>
          <p className="lesson-text">Several frameworks guide organizational risk management:</p>
          <div className="lesson-text"><b>NIST RMF:</b> The Risk Management Framework from the National Institute of Standards and Technology</div>
          <div className="lesson-text"><b>ISO 31000:</b> International standard for risk management principles and guidelines</div>
          <div className="lesson-text"><b>FAIR:</b> Factor Analysis of Information Risk - a model for understanding, analyzing and measuring information risk</div>
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
        <title>Risk Management Continued</title>
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
        <a href="/quiz/risk-continued-quiz" className="quiz-link">Take the Quiz</a>
        <a href="/" className="home-link">Return to Homepage</a>
      </div>
    </div>
  );
}

