"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "../../config/supabaseClient";
import { useRouter } from "next/router";

export default function Quiz() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [score, setScore] = useState(0);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const questions = [
    {
      question: "What is the capital of France?",
      options: ["Paris", "London", "Berlin", "Madrid"],
      correctAnswer: "Paris",
    },
    {
      question: "What is the capital of Japan?",
      options: ["Beijing", "Seoul", "Tokyo", "Bangkok"],
      correctAnswer: "Tokyo",
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

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

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

  const handleAnswer = (option) => {
    setSelectedOption(option);
    if (option === questions[questionIndex].correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption("");
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((prev) => prev + 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!user) {
      handleLoginRedirect();
      return;
    }

    try {
      const { error } = await supabase
        .from("quiz_results")
        .insert([{ 
          user_id: user.id, 
          score,
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
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("An error occurred while submitting your quiz.");
    }
  };

  const handleLoginRedirect = () => {
    const currentPath = "/quiz/CIA-Triad-Quiz";
    router.push(`/login?returnUrl=${encodeURIComponent(currentPath)}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading your quiz...</p>
      </div>
    );
  }

  return (
    <div className="quiz-container p-4">
      {!user ? (
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
        <div>
          <h2 className="text-xl font-bold mb-4">{questions[questionIndex].question}</h2>
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
          <p className="mt-4">Current Score: {score}</p>
        </div>
      )}
    </div>
  );
}
