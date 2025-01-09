import Head from 'next/head';

export default function CIATriadLesson() {
  return (
    <>
      <Head>
        <title>CIA Triad Lesson</title>
        <link rel="stylesheet" href="/styles/lessonstyle.css" />
      </Head>

      /* Roadmap Section *
      <div className="roadmap">
        <a href="/leaderboard">Leaderboard</a>
        <a href="/lessons">Lessons</a>
        <a href="/quizzes">Quizzes</a>
        <a href="/profile">Profile</a>
      </div>

      <header>
        <h1>CIA Triad Lesson</h1>
      </header>

      <div className="slide">
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

        <h2>Quiz: Test Your Knowledge</h2>
        <p>Answer the following questions to test your understanding of the CIA Triad:</p>
        <ul>
          <li>What does the "C" in CIA stand for?</li>
          <li>How can data integrity be maintained?</li>
          <li>What is an example of ensuring availability?</li>
        </ul>
      </div>
            {/* Final Navigation */}
            <div className="final-navigation">
        <a href="/lessons/strong-passwords-quiz">Take the Quiz</a>
        <a href="/">Return to Homepage</a>
      </div>
    </>
  );
}
