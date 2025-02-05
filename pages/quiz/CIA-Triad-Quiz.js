import { useState } from "react";
import Head from "next/head";

export default function CIATriadQuiz() {
  const [answers, setAnswers] = useState({ q1: "", q2: "", q3_1: "", q3_2: "", q3_3: "" });
  const [score, setScore] = useState(null);
  const [progress, setProgress] = useState(0);

  const correctAnswers = {
    q1: "correct",
    q2: "denial of service",
    q3_1: "correct",
    q3_2: "correct",
    q3_3: "correct",
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setAnswers((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
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
        <form onSubmit={handleSubmit}>
          <div className="question">
            <p>1. What are the three components of the CIA Triad?</p>
            <label><input type="radio" name="q1" value="Confidentiality, Integrity, Availability" onChange={handleChange} /> Confidentiality, Integrity, Availability</label>
            <label><input type="radio" name="q1" value="Confidentiality, Integrity, Accuracy" onChange={handleChange} /> Confidentiality, Integrity, Accuracy</label>
            <label><input type="radio" name="q1" value="Comfortability, Integrity, Availability" onChange={handleChange} /> Comfortability, Integrity, Availability</label>
          </div>

          <div className="question">
            <p>2. What is an attack against availability called?</p>
            <input type="text" name="q2" value={answers.q2} onChange={handleChange} />
          </div>

          <div className="question">
            <p>3. Match each aspect of the CIA triad to its definition:</p>
            <ul>
              <li>1. Confidentiality <select name="q3_1" onChange={handleChange}><option value="">Select</option><option value="correct">Correct</option></select></li>
              <li>2. Integrity <select name="q3_2" onChange={handleChange}><option value="">Select</option><option value="correct">Correct</option></select></li>
              <li>3. Availability <select name="q3_3" onChange={handleChange}><option value="">Select</option><option value="correct">Correct</option></select></li>
            </ul>
          </div>

          <button type="submit" className="submit-btn">Submit</button>
        </form>

        {score !== null && (
          <div className="feedback">
            <p>You scored {score} out of {Object.keys(correctAnswers).length}.</p>
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          </div>
        )}
      </div>
    </div>
  );
}
