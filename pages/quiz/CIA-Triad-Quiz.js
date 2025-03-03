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
  const [answerOptions, setAnswerOptions] = useState({ q3_1: [], q3_2: [], q3_3: [] });
  const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

  useEffect(() => {
    async function fetchCorrectAnswers() {
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

    fetchCorrectAnswers();

    setAnswerOptions = ({
      q3_1: shuffleArray(["Protecting Sensitive Data from Unauthorized Access", "Hiding Data from Everybody", "Making and Keeping Agreements"]),
      q3_2: shuffleArray(["Keeping People Honest", "Data Remains Accurate and the Same", "Keeping Data Whole and Undivided"]),
      q3_3: shuffleArray(["Systems and Data are Accessible to Everybody at All Times", "The Freedom to Do Any Action", "Systems and Data are Accessible When Needed By Authorized People"])
    });
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
            <label className="radio-option">
              <input type="radio" name="q1" value="Confidentiality, Integrity, Availability" onChange={handleChange} /> Confidentiality, Integrity, Availability
            </label>
            <label className="radio-option">
              <input type="radio" name="q1" value="Confidentiality, Integrity, Accuracy" onChange={handleChange} /> Confidentiality, Integrity, Accuracy
            </label>
            <label className="radio-option">
              <input type="radio" name="q1" value="Comfortability, Integrity, Availability" onChange={handleChange} /> Comfortability, Integrity, Availability
            </label>
          </div>

          <div className="question">
            <p><b>2. What is an attack against availability called?</b></p>
            <input type="text" name="q2" value={answers.q2} onChange={handleChange} className="text-input" />
          </div>

          <div className="question">
            <p><b>3. Match each aspect of the CIA triad to its definition:</b></p>
            <ul className="match-list">
              <li>
                1. Confidentiality
                <select name="q3_1" onChange={handleChange} className="dropdown">
                  <option value="">Select</option>
                  {answerOptions.q3_1.map((option, i) => (
                    <option key={i} value={option}>{option}</option>
                  ))}
                </select>
              </li>
              <li>
                2. Integrity
                <select name="q3_2" onChange={handleChange} className="dropdown">
                  <option value="">Select</option>
                  {answerOptions.q3_2.map((option, i) => (
                    <option key={i} value={option}>{option}</option>
                  ))}
                </select>
              </li>
              <li>
                3. Availability
                <select name="q3_3" onChange={handleChange} className="dropdown">
                  <option value="">Select</option>
                  {answerOptions.q3_3.map((option, i) => (
                    <option key={i} value={option}>{option}</option>
                  ))}
                </select>
              </li>
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
