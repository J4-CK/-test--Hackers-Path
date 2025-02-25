import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

export default function LessonTemplate() {
  const [currentSection, setCurrentSection] = useState(0);
  const router = useRouter();

  // Define lesson sections here.
  // Duplicate and modify the objects inside the sections array to add more content.
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
          <p className="lesson-text">Lesson introduction or explanation goes here.</p>
          <div className="lesson-text"><b>Key Concept 1:</b> Brief explanation.</div>
          <div className="lesson-text"><b>Key Concept 2:</b> Another explanation.</div>
        </>
      ),
    },
    {
      title: "Lesson Title - Section 2",
      content: (
        <>
          <h2 className="lesson-text">Subtopic Title</h2>
          <p className="lesson-text">Details about this topic go here.</p>
          <div className="lesson-text">Example bullet point.</div>
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
