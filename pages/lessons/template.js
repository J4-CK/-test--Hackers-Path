import { useState } from 'react';
import Head from 'next/head';

export default function LessonTemplate() {
  const [currentSection, setCurrentSection] = useState(0);

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
    // Add more sections as needed
  ];

  const nextSection = () => setCurrentSection((currentSection + 1) % sections.length);
  const prevSection = () => setCurrentSection((currentSection - 1 + sections.length) % sections.length);

  return (
    <div>
      <Head>
        <title>Lesson Template</title>
        <link rel="stylesheet" href="/styles/lessonstyle.css" />
      </Head>

      <header>
        <h1>Lesson Title</h1>
      </header>

      {/* Roadmap Navigation */}
      <div className="roadmap">
        <a href="/leaderboard">Leaderboard</a>
        <a href="/lessons">Lessons</a>
        <a href="/quizzes">Quizzes</a>
        <a href="/profile">Profile</a>
      </div>

      {/* Main Lesson Section */}
      <div className="slide">
        <h2>{sections[currentSection].title}</h2>
        {sections[currentSection].content}
      </div>

      {/* Navigation Buttons */}
      <div className="navigation">
        <button onClick={prevSection}>Previous</button>
        <button onClick={nextSection}>Next</button>
      </div>

      {/* Final Navigation */}
      <div className="final-navigation">
        <a href="/lessons/example-quiz">Take the Quiz</a>
        <a href="/">Return to Homepage</a>
      </div>
    </div>
  );
}
