import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import styles from '../../styles/Lessons.module.css';

export default function Lessons() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const { data: { user } } = supabase.auth.getUser();
    setUser(user);
  }, []);

  const lessons = [
    {
      title: "CIA Triad",
      description: "Learn about Confidentiality, Integrity, and Availability",
      link: "/lessons/CIA-triad-presentation"
    },
    {
      title: "Strong Passwords",
      description: "Understanding password security",
      link: "/lessons/strong-passwords-presentation"
    },
    {
      title: "Risk Basics",
      description: "Introduction to risk management",
      link: "/lessons/risk-basics-presentation"
    },
    {
      title: "Risk Continued",
      description: "Advanced risk management concepts",
      link: "/lessons/risk-continued"
    },
    {
      title: "Security Controls",
      description: "Learn about different security controls",
      link: "/lessons/security-controls-presentation"
    }
  ];

  return (
    <div className={styles.container}>
      <div className="roadmap">
        <a href="/leaderboard">Leaderboard</a>
        <a href="/lessons">Lessons</a>
        <a href="/quiz">Quizzes</a>
        <a href="/profile">Profile</a>
      </div>
      
      <h1>Available Lessons</h1>
      <div className={styles.lessonGrid}>
        {lessons.map((lesson, index) => (
          <div key={index} className={styles.lessonCard}>
            <h2>{lesson.title}</h2>
            <p>{lesson.description}</p>
            <a href={lesson.link} className={styles.startButton}>
              Start Lesson
            </a>
          </div>
        ))}
      </div>
    </div>
  );
} 