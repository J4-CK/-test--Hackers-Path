"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../config/supabaseClient";
import Head from 'next/head';
import Loading from '../../components/Loading';
import MobileNav from '../../components/MobileNav';

export default function QuizPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();

  // Quiz questions
  const questions = [
    {
      questionText: 'What does the "C" in CIA Triad stand for?',
      options: ['Control', 'Confidentiality', 'Clarity', 'Certification'],
      correctAnswer: 'Confidentiality',
    },
    {
      questionText: 'What does the "I" in CIA Triad stand for?',
      options: ['Intelligence', 'Internet', 'Integrity', 'Identification'],
      correctAnswer: 'Integrity',
    },
    {
      questionText: 'What does the "A" in CIA Triad stand for?',
      options: ['Authentication', 'Authorization', 'Auditing', 'Availability'],
      correctAnswer: 'Availability',
    },
    {
      questionText: 'Which of the following is NOT part of the CIA Triad?',
      options: ['Confidentiality', 'Integrity', 'Availability', 'Authentication'],
      correctAnswer: 'Authentication',
    },
    {
      questionText: 'Which component of the CIA Triad is concerned with preventing unauthorized access to information?',
      options: ['Confidentiality', 'Integrity', 'Availability', 'None of the above'],
      correctAnswer: 'Confidentiality',
    },
  ];

  // Fetch session on load
  useEffect(() => {
    async function checkSession() {
      try {
        setLoading(true);
        const res = await fetch('/api/auth/session');
        const data = await res.json();

        if (res.ok && data.user) {
          setUser(data.user);
        } else {
          console.error('Session error:', data.error);
          // Don't immediately redirect, just set user to null
        }
      } catch (error) {
        console.error('Failed to check session:', error);
        // Don't immediately redirect, just set user to null
      } finally {
        setLoading(false);
        setAuthChecked(true); // Mark auth as checked regardless of result
      }
    }
    checkSession();
  }, []);

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

  const handleAnswerClick = async (selectedAnswer) => {
    const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer;
    
    if (isCorrect) {
      setScore(score + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
      await saveScore(score + (isCorrect ? 1 : 0));
    }
  };

  const saveScore = async (finalScore) => {
    if (!user) return;
    
    try {
      const response = await fetch('/api/quiz/save-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quizName: 'CIA Triad Quiz',
          score: finalScore,
          maxScore: questions.length
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        console.error('Error saving score:', data.error);
      }
    } catch (error) {
      console.error('Failed to save score:', error);
    }
  };

  const handleLogin = () => {
    router.push('/login?returnUrl=' + encodeURIComponent('/quiz/CIA-Triad-Quiz'));
  };

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST'
      });
      if (res.ok) {
        setUser(null);
        router.push('/login');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResults(false);
  };

  if (loading) {
    return (
      <div>
        <Head>
          <title>CIA Triad Quiz</title>
          <link rel="stylesheet" href="/styles/homepagestyle.css" />
        </Head>
        <Loading />
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>CIA Triad Quiz - Hacker's Path</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" href="/images/favicon.png" />
      </Head>
      <link rel="stylesheet" href="/styles/homepagestyle.css" />

      <header>
        <h1><a href="/">Hacker's Path</a></h1>
      </header>

      <MobileNav username={user?.username} />

      <div className="container">
        {!user && authChecked ? (
          <div className="section">
            <h2>Please log in to take the quiz</h2>
            <button onClick={handleLogin} className="logout-btn">Log In</button>
          </div>
        ) : (
          <>
            <div className="section">
              <h2>CIA Triad Quiz</h2>
              
              {showResults ? (
                <div className="quiz-container">
                  <h3>Quiz Complete!</h3>
                  <p>Your score: {score} out of {questions.length}</p>
                  <button onClick={resetQuiz} className="logout-btn">Retake Quiz</button>
                </div>
              ) : (
                <div className="quiz-container">
                  <div className="question">
                    <p>Question {currentQuestion + 1} of {questions.length}</p>
                    <h3>{questions[currentQuestion].questionText}</h3>
                  </div>
                  
                  <div className="buttons">
                    {questions[currentQuestion].options.map((option, index) => (
                      <a 
                        key={index}
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          handleAnswerClick(option);
                        }}
                      >
                        {option}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        )}
      </div>

      <div className="secret-flag" 
          onClick={(e) => e.currentTarget.classList.toggle('revealed')}
          title="You found something! Click to reveal...">
        CTF Flag 1: H4CK3RS
      </div>

      <style jsx>{`
        /* Existing styles... */
        
        /* Secret flag styling */
        .secret-flag {
          position: fixed;
          bottom: 20px;
          right: 20px;
          color: #a742c6;
          background-color: #f5f5f5;
          font-size: 12px;
          cursor: pointer;
          padding: 8px;
          border-radius: 5px;
          border: 1px dashed #a742c6;
          transition: all 0.3s ease;
          z-index: 100;
          opacity: 0.4;
        }
        
        .secret-flag:hover {
          opacity: 0.8;
          background-color: #f0f0f0;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .secret-flag.revealed {
          color: #fff;
          background-color: #a742c6;
          font-size: 16px;
          padding: 10px 15px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
          opacity: 1;
          border: none;
        }
      `}</style>
    </div>
  );
} 
