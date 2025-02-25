import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

export default function LessonTemplate() {
  const [currentSection, setCurrentSection] = useState(0);
  const router = useRouter();

  // Define lesson sections here.
  // Duplicate and modify the objects inside the sections array to add more content.
  const sections = [
    {
      title: "Risk Continued",
      content: (
        <>
          <p className="lesson-text">Now that we understand what risk consists of how do we address it?</p>
          <div className="lesson-text"><b>Risk Identification:</b> How do we identify risk?</div>
          <div className="lesson-text"><b>Risk Assessment:</b> How do we quantify risk?</div>
          <div className="lesson-text"><b>Risk Treatment:</b> How do we treat risk?</div>
        </>
      ),
    },
    {
      title: "Risk Identification",
      content: (
        <>
          <h2 className="lesson-text">We talked previously about assets, threats, and vulnerabilities. These are all aspects involved in Risk Identification./h2>
          <div className="lesson-text">Risk Identification isn't just done one time. It's a continuous process of finding, understanding, and preparing for risk.</div>
          <p className="lesson-text">Some important things to remember:</p>
          <div className="lesson-text">Another example.</div>
        </>
      ),
    },
  ];

  const nextSection = () => setCurrentSection((currentSection + 1) % sections.length);
  const prevSection = () => setCurrentSection((currentSection - 1 + sections.length) % sections.length);
  const goToSection = (index) => setCurrentSection(index);

  return (
    <div className="lesson-wrapper">
      <Head>
        <title>Lesson Template</title>
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

      {/* Main Lesson Content in a Larger Box */}
      <div className="lesson-container">
        {/* Sidebar for Lesson Progress */}
        <div className="lesson-sidebar">
          <h3>Lesson Progress</h3>
          <ul>
            {sections.map((section, index) => (
              <li key={index} className={index === currentSection ? "active" : ""} onClick={() => goToSection(index)}>
                {section.title}
              </li>
            ))}
          </ul>
        </div>

        {/* Lesson Content */}
        <div className="lesson-content">
          <h2 className="lesson-text">{sections[currentSection].title}</h2>
          {sections[currentSection].content}
        </div>
      </div>

      {/* Centered Navigation Buttons */}
      <div className="lesson-navigation centered-navigation">
        <button onClick={prevSection} disabled={currentSection === 0}>Previous</button>
        <button onClick={nextSection} disabled={currentSection === sections.length - 1}>Next</button>
      </div>

      {/* Centered Final Navigation */}
      <div className="final-navigation centered-navigation">
        <a href="/quizzes/example-quiz" className="quiz-link">Take the Quiz</a>
        <a href="/" className="home-link">Return to Homepage</a>
      </div>
    </div>
  );
}
