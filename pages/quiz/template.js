import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

export default function QuizTemplate() {
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  const correctAnswers = {};

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
        <h2>Quiz Title</h2>
        <form onSubmit={handleSubmit} className="quiz-form">
          <div className="question">
            <p><b>1. Multiple Choice Question?</b></p>
            <label className="radio-option"><input type="radio" name="q1" value="Option 1" onChange={handleChange} /> Option 1</label>
            <label className="radio-option"><input type="radio" name="q1" value="Option 2" onChange={handleChange} /> Option 2</label>
            <label className="radio-option"><input type="radio" name="q1" value="Option 3" onChange={handleChange} /> Option 3</label>
          </div>

          <div className="question">
            <p><b>2. Short Answer Question?</b></p>
            <input type="text" name="q2" onChange={handleChange} className="text-input" placeholder="Type your answer" />
          </div>

          <div className="question">
            <p><b>3. Match the following:</b></p>
            <ul className="match-list">
              <li>1. Term 1 <select name="q3_1" onChange={handleChange} className="dropdown">
                <option value="">Select</option>
                <option value="Definition 1">Definition 1</option>
                <option value="Definition 2">Definition 2</option>
                <option value="Definition 3">Definition 3</option>
              </select></li>
              <li>2. Term 2 <select name="q3_2" onChange={handleChange} className="dropdown">
                <option value="">Select</option>
                <option value="Definition 1">Definition 1</option>
                <option value="Definition 2">Definition 2</option>
                <option value="Definition 3">Definition 3</option>
              </select></li>
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

        {/* Return to Lesson Button */}
        <div className="final-navigation">
          <a href="/lessons/example-lesson">Return to Lesson</a>
        </div>
      </div>
    </div>
  );
}
