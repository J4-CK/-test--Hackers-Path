import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';

export default function LessonTemplate() {
  const [currentSection, setCurrentSection] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const user = useUser();
  const supabase = useSupabaseClient();

  useEffect(() => {
    if (user !== null) {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (!loading && user && !hasStarted) {
      // Track lesson start
      fetch('/api/activity/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          activityType: 'lesson_start',
          description: 'Started Risk Continued lesson',
          lessonId: 'risk-continued'
        }),
      });
      setHasStarted(true);
    }
  }, [user, hasStarted, loading]);

  useEffect(() => {
    // Track lesson completion when reaching the last section
    if (currentSection === sections.length - 1 && user) {
      fetch('/api/activity/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          activityType: 'lesson_complete',
          description: 'Completed Risk Continued lesson',
          lessonId: 'risk-continued'
        }),
      });
    }
  }, [currentSection, user]);

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
          <p className="lesson-text">We talked previously about assets, threats, and vulnerabilities. These are all aspects involved in Risk Identification.</p>
          <p className="lesson-text">Risk Identification is important because we can't protect against what we can't see.</p>
          <p className="lesson-text">Risk Identification also isn't just done once. It's a continuous process of finding, understanding, and preparing for risk.</p>
          <p className="lesson-text">Everyone within an organization should be identifying risk and communicate clearly when they find it.</p>
        </>
      ),
    },
    {
      title: "Risk Assessment",
      content: (
        <>
          <p className="lesson-text">We've mentioned in the previous lesson that risk assessment involves finding risks based on likelihood and impact, but there is more to it than that.</p>
          <p className="lesson-text">Risk assessment also includes prioritizing risk based on what your organization needs. This could also include evaluating which mitigations to use.</p>
          <p className="lesson-text">The end result of conducting risk assessment is usually a report or presentation on the risk to management.</p>
        </>
      ),
    },
    {
      title: "Risk Treatment",
      content: (
        <>
          <p className="lesson-text">After identifying and assessing risk, we have to address how to treat it. There are four options to do this.</p>
          <p className="lesson-text">Option 1: Avoid the Risk. This usually involves stopping an activity because the impact and/or likelihood of the risk is too high.</p>
          <p className="lesson-text">Option 2: Accept the Risk. This involves continuing the activity after calculating that the impact and/or likelihood of the risk is low, or the benefits heavily outweigh the costs of the risk.</p>
          <p className="lesson-text">Option 3: Mitigate the Risk. This involves taking steps to reduce or prevent a risk's impact or likelihood. They can involve controls or plans on how to address the risk if it happens.</p>
          <p className="lesson-text">Option 4: Transfer the Risk. This usually involves passing on the cost of the risk to someone else willing to accept it for a price. An example of this would be insurance.</p>
          <p className="lesson-text"><b>Note: There is no such thing as ignoring risk!</b></p>
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
        <a href="/lessons">Lessons</a>
        <a href="/quiz">Quizzes</a>
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
      <div className="center-nav">
        {currentSection > 0 && (
          <button onClick={() => setCurrentSection(currentSection - 1)} className="nav-button">
            Previous
          </button>
        )}
        {currentSection < sections.length - 1 && (
          <button onClick={() => setCurrentSection(currentSection + 1)} className="nav-button">
            Next
          </button>
        )}
      </div>
      {currentSection === sections.length - 1 && (
        <div className="final-nav">
          <a href="/quiz/risk-continued-quiz" className="quiz-link">Take the Quiz</a>
          <a href="/" className="home-link">Return to Home</a>
        </div>
      )}
    </div>
  );
}
