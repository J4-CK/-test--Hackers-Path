import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

export default function LessonTemplate() {
  const [currentSection, setCurrentSection] = useState(0);
  const router = useRouter();

  const sections = [
    {
      title: "What is Risk?",
      content: (
        <>
          <p className="lesson-text">Risk is simply the possibility of something bad happening. Every decision you make has risk involved.</p>
          <p className="lesson-text">For example, think about riding a bike. You can move much faster, travel farther, and sometimes use the road. However, the chance of injury is higher compared to walking.</p>
          <p className="lesson-text"><b>Risk tolerance</b> is the amount of risk someone is willing to take. Each person has a different level of risk tolerance.</p>
        </>
      ),
    },
    {
      title: "Risk Terminology",
      content: (
        <>
          <p className="lesson-text">Here are some terms that are related to risk:</p>
          <div className="lesson-text"><b>Asset:</b> Something you want to protect. For example, your phone would be considered an asset.</div>
          <div className="lesson-text"><b>Vulnerability:</b> A weakness in protection. An example of a vulnerability is a weak password for your phone.</div>
          <div className="lesson-text"><b>Threat:</b> Someone or something trying to exploit a vulnerability. For example, if someone knows you have a weak password, they could try to access your phone. This person or action is the threat.</div>
        </>
      ),
    },
    {
      title: "Risk Assessment",
      content: (
        <>
          <p className="lesson-text">There are two main factors when it comes to calculating risk:</p>
          <div className="lesson-text">1. How severe the bad outcome is.</div>
          <div className="lesson-text">2. How likely it is that something bad will happen.</div>
        </>
      ),
    },
    {
      title: "Risk Assessment Example",
      content: (
        <>
          <p className="lesson-text">Imagine you are not doing well in a class and are considering cheating on a test. This could help you get a high score to boost your grade. However, the severity of the risk is that if you are caught, your test score becomes a zero and you might face punishment from the school. The likelihood of the risk can change, but let's assume your teacher is known for catching cheaters.</p>
          <p className="lesson-text">Let's assess this risk:</p>
          <div className="lesson-text"><b>Severity:</b> A zero on the test and potential punishment from the school.</div>
          <div className="lesson-text"><b>Likelihood:</b> High, especially because your teacher is known for catching cheaters.</div>
          <p className="lesson-text">Given the high likelihood and severe consequences, this risk would likely not be worth taking.</p>
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
