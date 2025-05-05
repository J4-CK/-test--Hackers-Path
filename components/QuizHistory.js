import { useEffect, useState } from 'react';

export default function QuizHistory({ userId }) {
  const [quizHistory, setQuizHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuizHistory = async () => {
      try {
        const response = await fetch(`/api/quiz/history?userId=${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch quiz history');
        }
        const data = await response.json();
        setQuizHistory(data.quizHistory);
        setStats(data.stats);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchQuizHistory();
    }
  }, [userId]);

  if (loading) return <div className="loading">Loading quiz history...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!quizHistory.length) return <div className="no-data">No quiz history available</div>;

  return (
    <div className="quiz-history">
      {/* Stats Overview */}
      <div className="stats-overview">
        <div className="stat-card">
          <h3>Total Quizzes</h3>
          <p>{stats.totalQuizzes}</p>
        </div>
        <div className="stat-card">
          <h3>Total Points</h3>
          <p>{stats.totalPoints}</p>
        </div>
        <div className="stat-card">
          <h3>Average Score</h3>
          <p>{stats.averageScore}%</p>
        </div>
        <div className="stat-card">
          <h3>Perfect Scores</h3>
          <p>{stats.perfectScores}</p>
        </div>
      </div>

      {/* Quiz History List */}
      <div className="quiz-list">
        <h2>Recent Quizzes</h2>
        {quizHistory.map((quiz) => (
          <div key={quiz.id} className="quiz-item">
            <div className="quiz-header">
              <h3>{quiz.quiz_type}</h3>
              <span className="date">{new Date(quiz.completed_at).toLocaleDateString()}</span>
            </div>
            <div className="quiz-details">
              <div className="score">
                <span className="label">Score:</span>
                <span className="value">{quiz.score}/{quiz.total_questions}</span>
              </div>
              <div className="points">
                <span className="label">Points Earned:</span>
                <span className="value">{quiz.points_earned}</span>
              </div>
              <div className="percentage">
                <span className="label">Percentage:</span>
                <span className="value">{((quiz.score / quiz.total_questions) * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .quiz-history {
          margin: 20px 0;
          padding: 20px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
        }

        .stats-overview {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: rgba(0, 0, 0, 0.2);
          padding: 20px;
          border-radius: 8px;
          text-align: center;
        }

        .stat-card h3 {
          color: #8c30c2;
          margin: 0 0 10px 0;
          font-size: 1.1em;
        }

        .stat-card p {
          color: #e0e0e0;
          margin: 0;
          font-size: 1.5em;
          font-weight: bold;
        }

        .quiz-list {
          margin-top: 30px;
        }

        .quiz-list h2 {
          color: #8c30c2;
          margin-bottom: 20px;
        }

        .quiz-item {
          background: rgba(0, 0, 0, 0.2);
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 15px;
        }

        .quiz-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .quiz-header h3 {
          color: #e0e0e0;
          margin: 0;
        }

        .date {
          color: #b0b0b0;
          font-size: 0.9em;
        }

        .quiz-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
        }

        .score, .points, .percentage {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .label {
          color: #b0b0b0;
          font-size: 0.9em;
        }

        .value {
          color: #e0e0e0;
          font-size: 1.1em;
          font-weight: bold;
        }

        .loading, .error, .no-data {
          text-align: center;
          padding: 20px;
          color: #b0b0b0;
        }

        .error {
          color: #ff4444;
        }
      `}</style>
    </div>
  );
}
