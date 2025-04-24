"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "../../config/supabaseClient";
import { useRouter } from "next/router";
import Head from "next/head";
import MobileNav from "../../components/MobileNav";
import Loading from '../../components/Loading';

export default function QuizTemplate() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  // Quiz questions
  const questions = [
    {
      questionText: 'Sample Question 1?',
      options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
      correctAnswer: 'Option 2',
    },
    // Add more questions as needed
  ];

  const handleAnswerClick = (selectedAnswer) => {
    const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer;
    
    if (isCorrect) {
      setScore(score + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
      saveScore(score + (isCorrect ? 1 : 0));
    }
  };

  const saveScore = async (finalScore) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('quiz_scores')
        .insert([{ 
          user_id: user.id, 
          quiz_name: 'Template Quiz', 
          score: finalScore,
          max_score: questions.length 
        }]);
      
      if (error) console.error('Error saving score:', error);
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

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

  useEffect(() => {
    const checkUser = async () => {
      try {
        setLoading(true);
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Error fetching session:", error.message);
          router.push('/login');
          return;
        }

        if (!session) {
          router.push('/login');
          return;
        }

        setUser(session.user);
      } catch (error) {
        console.error("Error:", error.message);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Listen for authentication changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
      } else {
        setUser(null);
        router.push('/login');
      }
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [router]);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ 
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/quiz/template`
      }
    });
    if (error) {
      console.error("Login Error:", error.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/login');
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResults(false);
  };

  if (loading) return <Loading />;

  return (
    <div>
      <Head>
        <title>Template Quiz - Hacker's Path</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" href="/images/favicon.png" />
      </Head>
      <link rel="stylesheet" href="/styles/homepagestyle.css" />

      <header>
        <h1><a href="/">Hacker's Path</a></h1>
      </header>

      <MobileNav username={user?.username} />

      <div className="container">
        {!user ? (
          <div className="section">
            <h2>Please log in to take the quiz</h2>
            <button onClick={handleLogin} className="logout-btn">Log In</button>
          </div>
        ) : (
          <>
            <div className="section">
              <h2>Template Quiz</h2>
              
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
    </div>
  );
}
