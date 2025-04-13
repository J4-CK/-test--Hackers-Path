import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function StrongPasswordsPresentation() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

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

  const nextSlide = () => setCurrentSlide((currentSlide + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((currentSlide - 1 + slides.length) % slides.length);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Head>
        <title>Strong Passwords - Presentation</title>
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
