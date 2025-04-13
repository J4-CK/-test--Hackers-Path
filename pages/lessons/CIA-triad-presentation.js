import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function CIATriadPresentation() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
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
    if (user && currentSlide === slides.length - 1 && !lessonCompleted) {
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

  // Close menu on scroll
  useEffect(() => {
    const handleScroll = () => setMenuOpen(false);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on link click
  const handleNavLinkClick = () => {
    setMenuOpen(false);
  };

  // Handle logout
  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  const slides = [
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

  const nextSlide = () => setCurrentSlide((currentSlide + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((currentSlide - 1 + slides.length) % slides.length);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Head>
        <title>CIA Triad - Presentation</title>
        <link rel="stylesheet" href="/styles/lessonstyle.css" />
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

      {/* Progress Indicator */}
      <div className="progress-bar" style={{
        width: '80%',
        margin: '20px auto',
        backgroundColor: '#f0f0f0',
        borderRadius: '10px',
        padding: '3px'
      }}>
        <div style={{
          width: `${((currentSlide + 1) / slides.length) * 100}%`,
          height: '20px',
          backgroundColor: '#4CAF50',
          borderRadius: '8px',
          transition: 'width 0.3s ease-in-out'
        }}></div>
        <div style={{ textAlign: 'center', marginTop: '5px' }}>
          Slide {currentSlide + 1} of {slides.length}
        </div>
      </div>

      {/* Slide Display */}
      <div className="slide active">
        <h2>{slides[currentSlide].title}</h2>
        {slides[currentSlide].img && (
          <img src={slides[currentSlide].img} alt={slides[currentSlide].title} />
        )}
        <div>{slides[currentSlide].content}</div>
      </div>

      {/* Navigation Buttons */}
      <div className="navigation">
        <button onClick={prevSlide}>Previous</button>
        <button onClick={nextSlide}>Next</button>
      </div>

      {/* Final Navigation */}
      <div className="final-navigation">
        <a href="/quiz/CIA-Triad-Quiz">Take the Quiz</a>
        <a href="/">Return to Homepage</a>
      </div>

      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
    </div>
  );
}
