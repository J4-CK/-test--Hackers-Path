import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../config/supabaseClient";

export default function QuizPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const router = useRouter();

  // CIA Triad Quiz Questions
  const questions = [
    {
      questionText: 'What does the "C" in CIA Triad stand for?',
      answerOptions: [
        { answerText: 'Control', isCorrect: false },
        { answerText: 'Confidentiality', isCorrect: true },
        { answerText: 'Clarity', isCorrect: false },
        { answerText: 'Certification', isCorrect: false },
      ],
    },
    {
      questionText: 'What does the "I" in CIA Triad stand for?',
      answerOptions: [
        { answerText: 'Intelligence', isCorrect: false },
        { answerText: 'Internet', isCorrect: false },
        { answerText: 'Integrity', isCorrect: true },
        { answerText: 'Identification', isCorrect: false },
      ],
    },
    {
      questionText: 'What does the "A" in CIA Triad stand for?',
      answerOptions: [
        { answerText: 'Authentication', isCorrect: false },
        { answerText: 'Authorization', isCorrect: false },
        { answerText: 'Auditing', isCorrect: false },
        { answerText: 'Availability', isCorrect: true },
      ],
    },
    {
      questionText: 'Which of the following is NOT part of the CIA Triad?',
      answerOptions: [
        { answerText: 'Confidentiality', isCorrect: false },
        { answerText: 'Integrity', isCorrect: false },
        { answerText: 'Availability', isCorrect: false },
        { answerText: 'Authentication', isCorrect: true },
      ],
    },
    {
      questionText: 'Which component of the CIA Triad is concerned with preventing unauthorized access to information?',
      answerOptions: [
        { answerText: 'Confidentiality', isCorrect: true },
        { answerText: 'Integrity', isCorrect: false },
        { answerText: 'Availability', isCorrect: false },
        { answerText: 'None of the above', isCorrect: false },
      ],
    },
  ];

  const handleAnswerClick = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
      // Save score to database (you would implement this)
      saveScore(score + (isCorrect ? 1 : 0));
    }
  };

  const saveScore = async (finalScore) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('quiz_scores')
        .insert([
          { 
            user_id: user.id, 
            quiz_name: 'CIA Triad Quiz', 
            score: finalScore,
            max_score: questions.length 
          }
        ]);
      
      if (error) console.error('Error saving score:', error);
    } catch (error) {
      console.error('Error:', error.message);
    }
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

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="quiz-container">
      <style jsx>{`
        .quiz-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          font-family: Arial, sans-serif;
        }
        .navigation {
          display: flex;
          justify-content: space-around;
          margin-bottom: 20px;
          background-color: #f0f0f0;
          padding: 10px;
          border-radius: 5px;
        }
        .navigation a {
          text-decoration: none;
          color: #333;
          font-weight: bold;
          padding: 5px 10px;
        }
        .navigation a:hover {
          background-color: #ddd;
          border-radius: 3px;
        }
        .user-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        button {
          background-color: #4CAF50;
          color: white;
          border: none;
          padding: 10px 15px;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          font-size: 16px;
          margin: 4px 2px;
          cursor: pointer;
          border-radius: 4px;
        }
        button:hover {
          background-color: #45a049;
        }
        .quiz-section {
          background-color: #f9f9f9;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .question {
          font-size: 18px;
          margin-bottom: 20px;
        }
        .answer-options {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
        }
        .answer-button {
          background-color: #008CBA;
          color: white;
          border: none;
          padding: 10px;
          text-align: left;
          border-radius: 4px;
        }
        .answer-button:hover {
          background-color: #007B9E;
        }
        .score-section {
          text-align: center;
          padding: 20px;
        }
      `}</style>

      {!user ? (
        <div className="login-section">
          <p>Please log in to take the quiz.</p>
          <button onClick={handleLogin}>Log In</button>
        </div>
      ) : (
        <>
          <div className="navigation">
            <a href="/leaderboard">Leaderboard</a>
            <a href="/lessons">Lessons</a>
            <a href="/quiz">Quizzes</a>
            <a href="/profile">Profile</a>
          </div>
          
          <div className="user-info">
            <p>Welcome, {user.email}!</p>
            <button onClick={handleLogout}>Log Out</button>
          </div>
          
          <div className="quiz-section">
            {showScore ? (
              <div className="score-section">
                <h2>Quiz Completed!</h2>
                <p>You scored {score} out of {questions.length}</p>
                <button onClick={resetQuiz}>Retake Quiz</button>
              </div>
            ) : (
              <>
                <div className="question">
                  <h2>CIA Triad Quiz</h2>
                  <p>Question {currentQuestion + 1}/{questions.length}</p>
                  <h3>{questions[currentQuestion].questionText}</h3>
                </div>
                <div className="answer-options">
                  {questions[currentQuestion].answerOptions.map((answerOption, index) => (
                    <button
                      className="answer-button"
                      key={index}
                      onClick={() => handleAnswerClick(answerOption.isCorrect)}
                    >
                      {answerOption.answerText}
                    </button>
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



