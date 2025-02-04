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
        <link rel="stylesheet" href="/styles/quizstyle.css" />
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

      <form onSubmit={handleSubmit}>
        <label>
          Question 1: What does CIA stand for?
          <input type="text" name="q1" value={answers.q1} onChange={handleChange} />
        </label>

        <label>
          Question 2: What type of attack affects Availability?
          <input type="text" name="q2" value={answers.q2} onChange={handleChange} />
        </label>

        <label>
          Question 3.1: Is integrity an important part of security?
          <input type="text" name="q3_1" value={answers.q3_1} onChange={handleChange} />
        </label>

        <label>
          Question 3.2: Is confidentiality important in cybersecurity?
          <input type="text" name="q3_2" value={answers.q3_2} onChange={handleChange} />
        </label>

        <label>
          Question 3.3: Should availability be maintained at all times?
          <input type="text" name="q3_3" value={answers.q3_3} onChange={handleChange} />
        </label>

        <button type="submit">Submit</button>
      </form>

      {score !== null && (
        <div className="feedback">
          <p>You scored {score} out of {Object.keys(correctAnswers).length}.</p>
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
      )}
    </div>
  );
}
