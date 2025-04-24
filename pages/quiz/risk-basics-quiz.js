import { useEffect, useState } from "react";
import { useRouter } from "next/router";
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
      questionText: 'What is the definition of risk in cybersecurity?',
      options: ['Any threat to a system', 'The potential for loss or damage when a threat exploits a vulnerability', 'The likelihood of a vulnerability being exploited', 'A software weakness'],
      correctAnswer: 'The potential for loss or damage when a threat exploits a vulnerability',
    },
    {
      questionText: 'What are the three components of the risk equation?',
      options: ['Asset, Threat, Vulnerability', 'Threat, Vulnerability, Consequence', 'Money, Time, Resources', 'Hardware, Software, Network'],
      correctAnswer: 'Threat, Vulnerability, Consequence',
    },
    {
      questionText: 'What is a vulnerability?',
      options: ['A potential attack', 'An attacker with malicious intent', 'A weakness that can be exploited', 'A security control'],
      correctAnswer: 'A weakness that can be exploited',
    },
    {
      questionText: 'Which of the following is a threat?',
      options: ['Outdated software', 'A phishing email', 'Unpatched server', 'Weak password policy'],
      correctAnswer: 'A phishing email',
    },
    {
      questionText: 'What is risk assessment?',
      options: ['Implementing security controls', 'The process of managing risks', 'The process of identifying and analyzing potential risks', 'Testing security controls'],
      correctAnswer: 'The process of identifying and analyzing potential risks',
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
          quiz_name: 'Risk Basics Quiz', 
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
        redirectTo: `${window.location.origin}/quiz/risk-basics-quiz`
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
        <title>Risk Basics Quiz - Hacker's Path</title>
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
              <h2>Risk Basics Quiz</h2>
              
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