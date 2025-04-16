"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "../../config/supabaseClient";
import { useRouter } from "next/router";

export default function QuizPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
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

  const handleAnswerClick = (selectedAnswer) => {
    const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer;
    
    if (isCorrect) {
      setScore(score + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResults(false);
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
        redirectTo: `${window.location.origin}/quiz/CIA-Triad-Quiz`
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

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      {!user ? (
        <>
          <p>Please log in to take the quiz.</p>
          <button onClick={handleLogin}>Log In</button>
        </>
      ) : (
        <>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-around', 
            marginBottom: '20px',
            padding: '10px',
            backgroundColor: '#f0f0f0',
            borderRadius: '5px'
          }}>
            <a href="/leaderboard" style={{ marginRight: '15px' }}>Leaderboard</a>
            <a href="/lessons" style={{ marginRight: '15px' }}>Lessons</a>
            <a href="/quiz" style={{ marginRight: '15px' }}>Quizzes</a>
            <a href="/profile">Profile</a>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <p>Welcome, {user.email}!</p>
            <button onClick={handleLogout}>Log Out</button>
          </div>
          
          <div style={{ 
            backgroundColor: '#f9f9f9', 
            padding: '20px', 
            borderRadius: '8px', 
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
          }}>
            {showResults ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <h2>Quiz Complete!</h2>
                <p>Your score: {score} out of {questions.length}</p>
                <button onClick={resetQuiz} style={{ marginTop: '15px' }}>Retake Quiz</button>
              </div>
            ) : (
              <>
                <h2>CIA Triad Quiz</h2>
                <p>Question {currentQuestion + 1} of {questions.length}</p>
                <h3>{questions[currentQuestion].questionText}</h3>
                <div>
                  {questions[currentQuestion].options.map((option, index) => (
                    <div key={index} style={{ margin: '10px 0' }}>
                      <button
                        onClick={() => handleAnswerClick(option)}
                        style={{
                          width: '100%',
                          padding: '10px',
                          textAlign: 'left',
                          backgroundColor: '#e0e0e0',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        {option}
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}



