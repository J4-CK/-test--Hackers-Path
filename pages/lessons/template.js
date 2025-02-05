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
      title: "Lesson Title - Section 1",
      content: (
        <>
          <p>Lesson introduction or explanation goes here.</p>
          <ul>
            <li><b>Key Concept 1:</b> Brief explanation.</li>
            <li><b>Key Concept 2:</b> Another explanation.</li>
          </ul>
        </>
      ),
    },
    {
      title: "Lesson Title - Section 2",
      content: (
        <>
          <h2>Subtopic Title</h2>
          <p>Details about this topic go here.</p>
          <ul>
            <li>Example bullet point.</li>
            <li>Another example.</li>
          </ul>
        </>
      ),
    },
  ];

  const nextSection = () => setCurrentSection((currentSection + 1) % sections.length);
  const prevSection = () => setCurrentSection((currentSection - 1 + sections.length) % sections.length);

  return (
    <div className="lesson-wrapper">
      <Head>
        <title>Lesson Template</title>
        <link rel="stylesheet" href="/styles/homepagestyle.css" />
      </Head>

      <header className="main-header">
        <h1>Hacker's Path</h1>
      </header>

      {/* Roadmap Navigation */}
      <div className="roadmap">
        <a href="/leaderboard">Leaderboard</a>
        <a href="/htmllessons/lessons.html">Lessons</a>
        <a href="/htmlquiz/quizzes.html">Quizzes</a>
        <a href="/profile">Profile</a>
      </div>

      {/* Main Content Layout */}
      <div className="lesson-layout">
        {/* Sidebar for Lesson Progress */}
        <div className="lesson-sidebar">
          <h3>Lesson Progress</h3>
          <ul>
            {sections.map((section, index) => (
              <li key={index} className={index === currentSection ? "active" : ""}>{section.title}</li>
            ))}
          </ul>
        </div>

        {/* Lesson Content */}
        <div className="lesson-content">
          <h2>{sections[currentSection].title}</h2>
          {sections[currentSection].content}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="lesson-navigation">
        <button onClick={prevSection} disabled={currentSection === 0}>Previous</button>
        <button onClick={nextSection} disabled={currentSection === sections.length - 1}>Next</button>
      </div>

      {/* Final Navigation */}
      <div className="final-navigation">
        <a href="/quizzes/example-quiz" className="quiz-link">Take the Quiz</a>
        <a href="/" className="home-link">Return to Homepage</a>
      </div>
    </div>
  );
}
