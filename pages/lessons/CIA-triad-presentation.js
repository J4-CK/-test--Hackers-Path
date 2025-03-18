import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

export default function LessonTemplate() {
  const [currentSection, setCurrentSection] = useState(0);
  const router = useRouter();

  const sections = [
    {
      title: "Introduction to the CIA Triad",
      content: (
        <>
          <p className="lesson-text">The CIA Triad is a fundamental model in cybersecurity, representing three key principles:</p>
          <div className="lesson-text"><b>Confidentiality:</b> Ensuring sensitive information is accessible only to authorized users.</div>
          <div className="lesson-text"><b>Integrity:</b> Maintaining the accuracy and trustworthiness of data.</div>
          <div className="lesson-text"><b>Availability:</b> Guaranteeing reliable access to information when needed.</div>
        </>
      ),
    },
    {
      title: "Confidentiality",
      content: (
        <>
          <p className="lesson-text">Confidentiality focuses on protecting sensitive data from unauthorized access. Key practices include:</p>
          <div className="lesson-text">- Using strong encryption to secure data.</div>
          <div className="lesson-text">- Implementing access controls and authentication.</div>
          <div className="lesson-text">- Regularly training employees on data privacy policies.</div>
        </>
      ),
    },
    {
      title: "Integrity",
      content: (
        <>
          <p className="lesson-text">Integrity ensures that data remains accurate and unaltered. This is achieved by:</p>
          <div className="lesson-text">- Implementing checksums and hash functions to detect data tampering.</div>
          <div className="lesson-text">- Using version control to track changes.</div>
          <div className="lesson-text">- Monitoring systems for unauthorized modifications.</div>
        </>
      ),
    },
    {
      title: "Availability",
      content: (
        <>
          <p className="lesson-text">Availability ensures that systems and data are accessible when needed. Techniques to ensure availability include:</p>
          <div className="lesson-text">- Using backups and disaster recovery plans.</div>
          <div className="lesson-text">- Implementing redundancy in critical systems.</div>
          <div className="lesson-text">- Protecting against Denial-of-Service (DoS) attacks.</div>
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
        <title>CIA Triad Lesson</title>
        <link rel="stylesheet" href="/styles/homepagestyle.css" />
      </Head>

      <header>
        <h1><a href="/">Hacker's Path</a></h1>
      </header>

      <div className="roadmap">
        <a href="/leaderboard">Leaderboard</a>
        <a href="/htmllessons/lessons.html">Lessons</a>
        <a href="/htmlquiz/quizzes.html">Quizzes</a>
        <a href="/profile">Profile</a>
      </div>

      <div className="lesson-container">
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

        <div className="lesson-content">
          <h2 className="lesson-text">{sections[currentSection].title}</h2>
          {sections[currentSection].content}
        </div>
      </div>

      <div className="lesson-navigation centered-navigation">
        <button onClick={prevSection} disabled={currentSection === 0}>Previous</button>
        <button onClick={nextSection} disabled={currentSection === sections.length - 1}>Next</button>
      </div>

      <div className="final-navigation centered-navigation">
        <a href="/quizzes/cia-triad-quiz" className="quiz-link">Take the Quiz</a>
        <a href="/" className="home-link">Return to Homepage</a>
      </div>
    </div>
  );
}
