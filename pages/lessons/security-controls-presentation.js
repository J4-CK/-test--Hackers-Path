import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

export default function LessonTemplate() {
  const [currentSection, setCurrentSection] = useState(0);
  const router = useRouter();

  const sections = [
    {
      title: "Security Controls",
      content: (
        <>
          <p className="lesson-text">So how do we protect against risk? The answer to that question is that we use security controls.</p>
          <p className="lesson-text">Security controls consists of things we use and processes we follow to help protect against risk to the CIA triad.</p>
          <p className="lesson-text">Security controls consist of three categories:</p>
          <p className="lesson-text"><b>Physical Controls, Technical Controls, and Administrative Controls</b></p>
        </>
      ),
    },
    {
      title: "Physical Controls",
      content: (
        <>
          <p className="lesson-text">Physical Controls work to protect against risk by using physical devices.</p>
          <div className="lesson-text">Some examples of physical controls include badge readers, cameras, or even building design.</div>
          <div className="lesson-text">Physical controls usually work hand-in-hand with techinical controls to form an overall security system.</div>
        </>
      ),
    },
    {
      title: "Technical Controls",
      content: (
        <>
          <p className="lesson-text">Technical controls are security controls that are put in place by computer systems and networks. Another name for technical controls are logical controls.</p>
          <div className="lesson-text">Techincal controls work to provide automated protection against the misuse of data and applications.</div>
          <div className="lesson-text">Some example of a technical control would be a firewall or an access control list.</div>
        </>
      ),
    },
    {
      title: "Administrative Controls",
      content: (
        <>
          <p className="lesson-text">Administrative controls are security controls that are put in place by management. Administrative controls are also known as managerial controls.</p>
          <p className="lesson-text">Administrative controls work to protect the people within an organization and keep them safe against risk.</p>
          <div className="lesson-text">Some examples of administrative controls would be training, security guidelines, and security frameworks.</div>
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
        <title>Risk Basics Lesson</title>
        <link rel="stylesheet" href="/styles/homepagestyle.css" />
      </Head>

      <header>
        <h1><a href="/">Hacker's Path</a></h1>
      </header>

      <div className="roadmap">
        <a href="/leaderboard">Leaderboard</a>
        <a href="/lessons">Lessons</a>
        <a href="/quiz">Quizzes</a>
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
        <a href="/quizzes/risk-basics-quiz" className="quiz-link">Take the Quiz</a>
        <a href="/" className="home-link">Return to Homepage</a>
      </div>
    </div>
  );
}
