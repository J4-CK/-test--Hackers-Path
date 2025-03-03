import { useState, useEffect } from "react";
import Head from "next/head";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function CIATriadQuiz() {
  const [answers, setAnswers] = useState({ q1: "", q2: "", q3_1: "", q3_2: "", q3_3: "" });
  const [correctAnswers, setCorrectAnswers] = useState(null);
  const [score, setScore] = useState(null);
  const [progress, setProgress] = useState(0);
  const [options, setOptions] = useState([]);
  
  useEffect(() => {
    async function fetchAnswers() {
      const { data, error } = await supabase
        .from("answers")
        .select("answers")
        .eq("lesson_name", "CIA Triad")
        .single();

      if (error) {
        console.error("Error fetching answers:", error);
      } else {
        setCorrectAnswers({
          q1: data.answers[0],
          q2: data.answers[1],
          q3_1: data.answers[2],
          q3_2: data.answers[3],
          q3_3: data.answers[4],
        });
      }
    }

    async function fetchOptions() {
      const { data, error } = await supabase
        .from("answers")
        .select("options")
        .eq("lesson_name", "CIA Triad")
        .single();

      if (error) {
        console.error("Error fetching options:", error);
      } else {
        setOptions(data.options);
      }
    }

    fetchAnswers();
    fetchOptions();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setAnswers((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!correctAnswers) return;

    let newScore = 0;
    const totalQuestions = Object.keys(correctAnswers).length;

    Object.entries(answers).forEach(([key, value]) => {
      if (correctAnswers[key]?.toLowerCase() === value.trim().toLowerCase()) {
        newScore++;
      }
    });

    setScore(newScore);
    setProgress((newScore / totalQuestions) * 100);
  };

  return (
    <div>
      <Head>
        <title>CIA Triad Quiz</title>
        <link rel="stylesheet" href="/styles/homepagestyle.css" />
      </Head>

      <header>
        <h1>CIA Triad Quiz</h1>
      </header>

      <div className="roadmap">
        <a href="/leaderboard">Leaderboard</a>
        <a href="/lessons">Lessons</a>
        <a href="/quizzes">Quizzes</a>
        <a href="/profile">Profile</a>
      </div>

      <div className="quiz-container">
        <h2>Test your knowledge of the CIA Triad</h2>
        <form onSubmit={handleSubmit} className="quiz-form">
          <div className="question">
            <p><b>1. What are the three components of the CIA Triad?</b></p>
            {options.length > 0 && options.q1?.map((option, index) => (
              <label key={index} className="radio-option">
                <input type="radio" name="q1" value={option} onChange={handleChange} /> {option}
              </label>
            ))}
          </div>

          <div className="question">
            <p><b>2. What is an attack against availability called?</b></p>
            <input type="text" name="q2" value={answers.q2} onChange={handleChange} className="text-input" />
          </div>

          <div className="question">
            <p><b>3. Match each aspect of the CIA triad to its definition:</b></p>
            <ul className="match-list">
              {["q3_1", "q3_2", "q3_3"].map((key, index) => (
                <li key={index}>
                  {key.replace("q3_", "")} <select name={key} onChange={handleChange} className="dropdown">
                    <option value="">Select</option>
                    {options[key]?.map((option, i) => (
                      <option key={i} value={option}>{option}</option>
                    ))}
                  </select>
                </li>
              ))}
            </ul>
          </div>

          <button type="submit" className="submit-btn">Submit</button>
        </form>

        {score !== null && (
          <div className="feedback">
            <p><b>You scored {score} out of {Object.keys(correctAnswers).length}.</b></p>
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
