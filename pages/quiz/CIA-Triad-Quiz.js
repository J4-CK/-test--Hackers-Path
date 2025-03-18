"use client";
import React, { useEffect, useState } from "react";
import supabase from "../../config/supabaseClient";
import { useRouter } from "next/navigation";

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

  // Robust authentication check
  useEffect(() => {
    // Immediately check for an existing session when component mounts
    const checkInitialSession = async () => {
      try {
        setLoading(true);
        
        // Get current session and user in one go
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log("Initial session found:", session.user.id);
          setUser(session.user);
        } else {
          console.log("No initial session found");
          setUser(null);
        }
      } catch (err) {
        console.error("Error checking initial session:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    // Run the initial check
    checkInitialSession();

    // Set up listener for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event);
      
      if (event === 'SIGNED_IN' && session) {
        console.log("User signed in:", session.user.id);
        setUser(session.user);
        setLoading(false);
      } 
      else if (event === 'SIGNED_OUT') {
        console.log("User signed out");
        setUser(null);
        setLoading(false);
      }
      else if (session) {
        console.log("Session exists:", session.user.id);
        setUser(session.user);
        setLoading(false);
      }
    });

    // Cleanup
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

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
    try {
      // Fresh auth check before submission
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.error("No active session for submission");
        alert("Your session has expired. Please log in again.");
        router.push("/login");
        return;
      }

      const userId = session.user.id;
      console.log("Submitting quiz for user:", userId);
      
      const { error } = await supabase
        .from("quiz_results")
        .insert([{ user_id: userId, score }]);
      
      if (error) {
        console.error("Database error on submission:", error);
        alert("Error submitting quiz. Please try again.");
      } else {
        console.log("Quiz submitted successfully");
        alert("Quiz submitted!");
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Exception during quiz submission:", err);
      alert("An error occurred. Please try again.");
    }
  };

  // Handle navigation to login page
  const goToLogin = () => {
    router.push("/login");
  };

  // Show loading state
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
            onClick={goToLogin}
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
