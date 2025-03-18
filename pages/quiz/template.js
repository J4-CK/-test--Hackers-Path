"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "../../config/supabaseClient";
import { useRouter } from "next/router";
import Head from "next/head";

export default function QuizTemplate() {
  // Basic quiz state
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [score, setScore] = useState(0);
  
  // Authentication state
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // TEMPLATE: Replace this with your actual quiz questions
  const questions = [
    {
      question: "Template Question 1?",
      options: ["Option 1", "Option 2", "Option 3", "Option 4"],
      correctAnswer: "Option 1",
    },
    {
      question: "Template Question 2?",
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctAnswer: "Option B",
    },
  ];

  // Authentication setup
  useEffect(() => {
    checkUser();
    
    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  // Check user session
  const checkUser = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error checking auth status:", error.message);
        return;
      }

      setUser(session?.user ?? null);
    } catch (error) {
      console.error("Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle answer selection
  const handleAnswer = (option) => {
    setSelectedOption(option);
    if (option === questions[questionIndex].correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  // Handle moving to next question
  const handleNextQuestion = () => {
    setSelectedOption("");
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((prev) => prev + 1);
    }
  };

  // Handle quiz submission
  const handleSubmitQuiz = async () => {
    if (!user) {
      handleLoginRedirect();
      return;
    }

    try {
      // TEMPLATE: Replace 'quiz_results' with your specific quiz table name if different
      const { error } = await supabase
        .from("quiz_results")
        .insert([{ 
          user_id: user.id, 
          score,
          // TEMPLATE: Add any additional fields you need to store
          quiz_type: "template", // Replace with your quiz type
          completed_at: new Date().toISOString()
        }]);
      
      if (error) {
        console.error("Database error:", error);
        if (error.message.includes('JWT')) {
          handleLoginRedirect();
        } else {
          alert("Error submitting quiz. Please try again.");
        }
      } else {
        alert("Quiz submitted successfully!");
        router.push("/dashboard"); // TEMPLATE: Replace with your desired redirect path
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("An error occurred while submitting your quiz.");
    }
  };

  // Handle login redirect
  const handleLoginRedirect = () => {
    // TEMPLATE: Replace with your actual quiz path
    const currentPath = "/quiz/template";
    router.push(`/login?returnUrl=${encodeURIComponent(currentPath)}`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading your quiz...</p>
      </div>
    );
  }

  // Main render
  return (
    <div>
      <Head>
        <title>Quiz Title</title>
        <link rel="stylesheet" href="/styles/homepagestyle.css" />
      </Head>

      <header>
        <h1><a href="/">Hacker's Path</a></h1>
      </header>

      {/* Roadmap Navigation */}
      <div className="roadmap">
        <a href="/leaderboard">Leaderboard</a>
        <a href="/htmllessons/lessons.html">Lessons</a>
        <a href="/htmlquiz/quizzes.html">Quizzes</a>
        <a href="/profile">Profile</a>
      </div>

      <div className="quiz-container">
        {!user ? (
          // Not logged in state
          <div className="text-center">
            <p className="mb-4">Please log in to take the quiz.</p>
            <button 
              onClick={handleLoginRedirect}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Log In
            </button>
          </div>
        ) : (
          // Quiz content
          <div>
            {/* TEMPLATE: Add your quiz title/description here */}
            <h1 className="text-2xl font-bold mb-6">Quiz Template</h1>
            
            {/* Question */}
            <h2 className="text-xl font-bold mb-4">{questions[questionIndex].question}</h2>
            
            {/* Options */}
            <ul className="space-y-2 mb-4">
              {questions[questionIndex].options.map((option) => (
                <li
                  key={option}
                  onClick={() => handleAnswer(option)}
                  className={`p-3 border rounded cursor-pointer ${
                    selectedOption === option
                      ? option === questions[questionIndex].correctAnswer
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {option}
                </li>
              ))}
            </ul>

            {/* Navigation/Submit Buttons */}
            {selectedOption && questionIndex < questions.length - 1 && (
              <button 
                onClick={handleNextQuestion}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
              >
                Next Question
              </button>
            )}
            {selectedOption && questionIndex === questions.length - 1 && (
              <button 
                onClick={handleSubmitQuiz}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Submit Quiz
              </button>
            )}

            {/* Score Display */}
            <p className="mt-4">Current Score: {score}</p>
            
            {/* TEMPLATE: Add any additional UI elements you need */}
          </div>
        )}
      </div>
    </div>
  );
}
