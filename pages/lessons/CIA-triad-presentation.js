import { useState } from 'react';
import Head from 'next/head';

export default function CIATriadLesson() {
  const [currentSection, setCurrentSection] = useState(0);

  const sections = [
    {
      title: "Introduction to the CIA Triad?",
      content: (
          <>
            <h2>Introduction to the CIA Triad</h2>
            <p>The CIA Triad is a fundamental model in cybersecurity, representing three key principles:</p>
            <ul>
              <li><b>Confidentiality:</b> Ensuring sensitive information is accessible only to authorized users.</li>
              <li><b>Integrity:</b> Maintaining the accuracy and trustworthiness of data.</li>
              <li><b>Availability:</b> Guaranteeing reliable access to information when needed.</li>
            </ul>

            <h2>Confidentiality</h2>
            <p>Confidentiality focuses on protecting sensitive data from unauthorized access. Key practices include:</p>
            <ul>
              <li>Using strong encryption to secure data.</li>
              <li>Implementing access controls and authentication.</li>
              <li>Regularly training employees on data privacy policies.</li>
            </ul>

            <h2>Integrity</h2>
            <p>Integrity ensures that data remains accurate and unaltered. This is achieved by:</p>
            <ul>
              <li>Implementing checksums and hash functions to detect data tampering.</li>
              <li>Using version control to track changes.</li>
              <li>Monitoring systems for unauthorized modifications.</li>
            </ul>

            <h2>Availability</h2>
            <p>Availability ensures that systems and data are accessible when needed. Techniques to ensure availability include:</p>
            <ul>
              <li>Using backups and disaster recovery plans.</li>
              <li>Implementing redundancy in critical systems.</li>
              <li>Protecting against Denial-of-Service (DoS) attacks.</li>
            </ul>
        </>
      ),
  },
];
  
  return (
    <div>
      <Head>
        <title>CIA Triad Lesson</title>
        <link rel="stylesheet" href="/styles/lessonstyle.css" />
      </Head>
    
      <header>
        <h1>CIA Triad Lesson</h1>
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
    </>
  );
}
