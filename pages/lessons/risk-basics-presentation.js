import { useState } from 'react';
import Head from 'next/head';

export default function RiskBasicsLesson() {
  const [currentSection, setCurrentSection] = useState(0);

  const sections = [
    {
      title: "What is Risk?",
      content: (
        <>
          <h2>What is Risk?</h2>
          <p>Risk is simply the possibility of something bad happening. Every decision you make has risk involved. </p>
          <p>For example, think about riding a bike. You can move much faster, travel farther, and sometimes use the road. However, the chance of injury is higher compared to walking.</p>
          <p><b>Risk tolerance</b> is the amount of risk someone is willing to take. Each person has a different level of risk tolerance.</p>

          <h2>Risk Terminology</h2>
          <p>Here are some terms that are related to risk:</p>
          <ul>
            <li><b>Asset:</b> Something you want to protect. For example, your phone would be considered an asset.</li>
            <li><b>Vulnerability:</b> A weakness in protection. An example of a vulnerability is a weak password for your phone.</li>
            <li><b>Threat:</b> Someone or something trying to exploit a vulnerability. For example, if someone knows you have a weak password, they could try to access your phone. This person or action is the threat.</li>
          </ul>

          <h2>Risk Assessment</h2>
          <p>There are two main factors when it comes to calculating risk:</p>
          <ol>
            <li>How severe the bad outcome is.</li>
            <li>How likely it is that something bad will happen.</li>
          </ol>

          <h3>Risk Assessment Example</h3>
          <p>Imagine you are not doing well in a class and are considering cheating on a test. This could help you get a high score to boost your grade. However, the severity of the risk is that if you are caught, your test score becomes a zero and you might face punishment from the school. The likelihood of the risk can change, but let's assume your teacher is known for catching cheaters.</p>
          <p>Let’s assess this risk:</p>
          <ul>
            <li><b>Severity:</b> A zero on the test and potential punishment from the school.</li>
            <li><b>Likelihood:</b> High, especially because your teacher is known for catching cheaters.</li>
          </ul>
          <p>Given the high likelihood and severe consequences, this risk would likely not be worth taking.</p>
        </>
      ),
    },
  ];

  const nextSection = () => setCurrentSection((currentSection + 1) % sections.length);
  const prevSection = () =>
    setCurrentSection((currentSection - 1 + sections.length) % sections.length);

  return (
    <div>
      <Head>
        <title>RiskBasicsLesson</title>
        <link rel="stylesheet" href="/styles/lessonstyle.css" />
      </Head>

      <header>
        <h1>Introduction to Risk</h1>
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
        <a href="/lessons/cia-triad-quiz">Take the Quiz</a>
        <a href="/">Return to Homepage</a>
      </div>
    </div>
  );
}
