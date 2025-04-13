import { useEffect, useState } from 'react';
import { supabase } from '../../config/supabaseClient';
import styles from '../../styles/Quiz.module.css';

export default function Quizzes() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const quizzes = [
    {
      title: "CIA Triad Quiz",
      description: "Test your knowledge of the CIA Triad",
      link: "/quiz/CIA-Triad-Quiz"
    },
    // Add more quizzes here as they become available
  ];

  return (
    <div className={styles.container}>
      <div className="roadmap">
        <a href="/leaderboard">Leaderboard</a>
        <a href="/lessons">Lessons</a>
        <a href="/quiz">Quizzes</a>
        <a href="/profile">Profile</a>
      </div>
      
      <h1>Available Quizzes</h1>
      <div className={styles.quizGrid}>
        {quizzes.map((quiz, index) => (
          <div key={index} className={styles.quizCard}>
            <h2>{quiz.title}</h2>
            <p>{quiz.description}</p>
            <a href={quiz.link} className={styles.startButton}>
              Start Quiz
            </a>
          </div>
        ))}
      </div>
    </div>
  );
} 