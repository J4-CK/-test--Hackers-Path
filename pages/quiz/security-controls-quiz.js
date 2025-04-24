import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../config/supabaseClient";
import Head from 'next/head';
import Loading from '../../components/Loading';

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
      questionText: 'What are security controls?',
      options: [
        'Software programs that detect viruses', 
        'Safeguards implemented to protect confidentiality, integrity, and availability of information', 
        'Locked doors and security guards', 
        'Policies written by management'
      ],
      correctAnswer: 'Safeguards implemented to protect confidentiality, integrity, and availability of information',
    },
    {
      questionText: 'Which of the following is an example of a preventive control?',
      options: [
        'Security camera', 
        'Intrusion detection system', 
        'Firewall', 
        'Backup system'
      ],
      correctAnswer: 'Firewall',
    },
    {
      questionText: 'What is the primary purpose of detective controls?',
      options: [
        'To prevent security incidents from occurring', 
        'To identify and record that a security breach has occurred', 
        'To recover from a security incident', 
        'To reduce the impact of security incidents'
      ],
      correctAnswer: 'To identify and record that a security breach has occurred',
    },
    {
      questionText: 'Which of the following is a technical control?',
      options: [
        'Security awareness training', 
        'Background checks', 
        'Physical barriers', 
        'Encryption'
      ],
      correctAnswer: 'Encryption',
    },
    {
      questionText: 'According to the Defense in Depth strategy, what is the best approach to security?',
      options: [
        'Implementing a single strong security control', 
        'Using multiple layers of different security controls', 
        'Focusing primarily on administrative controls', 
        'Relying on users to follow security policies'
      ],
      correctAnswer: 'Using multiple layers of different security controls',
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
          quiz_name: 'Security Controls Quiz', 
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
          setAuthChecked(true);
          return;
        }

        if (session) {
          setUser(session.user);
        }
        
        setAuthChecked(true);
      } catch (error) {
        console.error("Error:", error.message);
        setAuthChecked(true);
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
      }
      setLoading(false);
      setAuthChecked(true);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ 
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/quiz/security-controls-quiz`
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
        <title>Security Controls Quiz - Hacker's Path</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" href="/images/favicon.png" />
      </Head>
      <link rel="stylesheet" href="/styles/homepagestyle.css" />

      <header>
        <h1><a href="/">Hacker's Path</a></h1>
      </header>

      <div className="roadmap-wrapper">
        {!menuOpen ? (
          <button className="hamburger" onClick={() => setMenuOpen(true)}>
            ☰
          </button>
        ) : (
          <button className="hamburger close-btn" onClick={() => setMenuOpen(false)}>
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

      <div className="container">
        {!user && authChecked ? (
          <div className="section">
            <h2>Please log in to take the quiz</h2>
            <button onClick={handleLogin} className="logout-btn">Log In</button>
          </div>
        ) : (
          <>
            <div className="section">
              <h2>Security Controls Quiz</h2>
              
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