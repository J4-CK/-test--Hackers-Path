import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Loading from '../components/Loading';
import Head from 'next/head';
import MobileNav from '../components/MobileNav';

export default function Quizzes() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/auth/session');
        const data = await res.json();

        if (res.ok) {
          setUser(data.user);
        } else {
          console.error('Session error:', data.error);
          router.push('/login');
        }
      } catch (error) {
        console.error('Failed to check session:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }
    checkSession();
  }, [router]);

  if (loading) {
    return (
      <div>
        <Head>
          <title>Quizzes - Hacker's Path</title>
        </Head>
        <link rel="stylesheet" href="/styles/homepagestyle.css" />
        <Loading />
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <Head>
          <title>Quizzes - Hacker's Path</title>
        </Head>
        <link rel="stylesheet" href="/styles/homepagestyle.css" />
        <div className="container">
          <div className="section">
            <h2>Please log in to view quizzes</h2>
            <button onClick={() => router.push('/login')} className="logout-btn">Log In</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>Quizzes - Hacker's Path</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" href="/images/favicon.png" />
      </Head>
      <link rel="stylesheet" href="/styles/homepagestyle.css" />

      <header>
        <h1><a href="/">Hacker's Path</a></h1>
      </header>

      <MobileNav username={user.username} />

      <div className="container">
        <div className="section">
          <h2>Available Quizzes</h2>
          <div className="buttons">
            <a href="/quiz/CIA-Triad-Quiz">
              CIA Triad Quiz
              <p>Test your knowledge of the CIA Triad</p>
            </a>
            <a href="/quiz/strong-passwords-quiz">
              Strong Passwords Quiz
              <p>Test your knowledge of password security</p>
            </a>
            <a href="/quiz/risk-basics-quiz">
              Risk Basics Quiz
              <p>Test your understanding of security risk fundamentals</p>
            </a>
            <a href="/quiz/risk-continued-quiz">
              Risk Continued Quiz
              <p>Advanced risk management and assessment concepts</p>
            </a>
            <a href="/quiz/security-controls-quiz">
              Security Controls Quiz
              <p>Test your knowledge of different security controls</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 