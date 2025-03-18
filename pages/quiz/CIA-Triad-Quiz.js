"use client";
import React, { useEffect, useState } from "react";
import { supabase, SUPABASE_URL } from "../../config/supabaseClient";
import { useRouter } from "next/navigation";

export default function Quiz() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [score, setScore] = useState(0);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiToken, setApiToken] = useState(null);
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

  // Authentication and API token setup
  useEffect(() => {
    const setupAuthentication = async () => {
      try {
        setLoading(true);
        
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          setLoading(false);
          return;
        }
        
        if (!session) {
          console.log("No session found");
          setLoading(false);
          return;
        }
        
        // Session exists, set user
        console.log("Session found, user ID:", session.user.id);
        setUser(session.user);
        
        // Get and store API token
        const token = session.access_token;
        setApiToken(token);
        
        // Set auth headers for future API requests
        supabase.supabaseUrl = SUPABASE_URL;
        supabase.supabaseKey = token;
        
        console.log("API authentication setup complete");
      } catch (err) {
        console.error("Authentication setup error:", err);
      } finally {
        setLoading(false);
      }
    };

    setupAuthentication();

    // Set up auth listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      
      if (session) {
        console.log("New session established");
        setUser(session.user);
        
        // Update API token when auth state changes
        setApiToken(session.access_token);
        
        // Update auth headers
        supabase.supabaseUrl = SUPABASE_URL;
        supabase.supabaseKey = session.access_token;
      } else {
        console.log("Session ended");
        setUser(null);
        setApiToken(null);
      }
    });

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
    if (!user || !apiToken) {
      alert("Please log in to submit your score.");
      router.push("/login");
      return;
    }

    try {
      // Create a new client with the current token to ensure fresh authentication
      const authClient = supabase.auth.setSession(apiToken);
      
      console.log("Submitting quiz with authenticated client");
      
      const { error } = await supabase
        .from("quiz_results")
        .insert([{ 
          user_id: user.id, 
          score,
          completed_at: new Date().toISOString()
        }]);
      
      if (error) {
        console.error("Database error:", error);
        
        // Check if it's an authentication error
        if (error.code === 'PGRST301' || error.message.includes('JWT')) {
          alert("Your session has expired. Please log in again.");
          router.push("/login");
        } else {
          alert("Error submitting quiz. Please try again.");
        }
      } else {
        console.log("Quiz submitted successfully");
        alert("Quiz submitted!");
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
