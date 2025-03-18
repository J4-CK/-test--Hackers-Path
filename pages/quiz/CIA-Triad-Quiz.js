"use client";

import React, { useEffect, useState } from "react";
import supabase from "../../config/supabaseClient";
import { useRouter } from "next/navigation";

export default function Quiz() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [score, setScore] = useState(0);
  const [user, setUser] = useState(null);
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

  // Updated: Get session + setup listener
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: sessionData, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error getting session:", error);
        return;
      }

      if (sessionData.session && sessionData.session.user) {
        setUser(sessionData.session.user);
        console.log("User authenticated:", sessionData.session.user.id);
      } else {
        console.log("No authenticated user found");
      }
    };

    getCurrentUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session && session.user) {
        setUser(session.user);
        console.log("User signed in via listener:", session.user.id);
      } else {
        setUser(null);
        console.log("User signed out via listener");
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleAnswer = (option: string) => {
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
      alert("Please log in to submit your score.");
      return;
    }
    try {
      const { error } = await supabase
        .from("quiz_results")
        .insert([{ user_id: user.id, score }]);

      if (error) {
        console.error("Error inserting data:", error);
      } else {
        alert("Quiz submitted!");
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Error submitting quiz:", err);
    }
  };

  return (
    <div className="quiz-container">
      {!user ? (
        <div>
          <p>Please log in to take the quiz.</p>
        </div>
      ) : (
        <div>
          <h2>{questions[questionIndex].question}</h2>
          <ul>
            {questions[questionIndex].options.map((option) => (
              <li
                key={option}
                onClick={() => handleAnswer(option)}
                style={{
                  backgroundColor:
                    selectedOption === option
                      ? option === questions[questionIndex].correctAnswer
                        ? "green"
                        : "red"
                      : "",
                  cursor: "pointer",
                }}
              >
                {option}
              </li>
            ))}
          </ul>
          {selectedOption && questionIndex < questions.length - 1 && (
            <button onClick={handleNextQuestion}>Next</button>
          )}
          {selectedOption && questionIndex === questions.length - 1 && (
            <button onClick={handleSubmitQuiz}>Submit Quiz</button>
          )}
          <p>Current Score: {score}</p>
        </div>
      )}
    </div>
  );
}
