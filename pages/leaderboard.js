import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [quizStats, setQuizStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        // Fetch total points leaderboard
        const { data: pointsData, error: pointsError } = await supabase
          .from('accounts')
          .select('id, name, total_points')
          .order('total_points', { ascending: false })
          .limit(10);

        if (pointsError) throw pointsError;

        // Fetch quiz statistics
        const { data: quizData, error: quizError } = await supabase
          .from('quiz_attempts')
          .select(`
            user_id,
            quiz_type,
            score,
            total_questions,
            points_earned,
            completed_at
          `)
          .order('completed_at', { ascending: false });

        if (quizError) throw quizError;

        // Process quiz statistics
        const userQuizStats = {};
        quizData.forEach(attempt => {
          if (!userQuizStats[attempt.user_id]) {
            userQuizStats[attempt.user_id] = {
              totalQuizzes: 0,
              totalPoints: 0,
              totalScore: 0,
              totalQuestions: 0,
              perfectScores: 0
            };
          }

          const stats = userQuizStats[attempt.user_id];
          stats.totalQuizzes++;
          stats.totalPoints += attempt.points_earned;
          stats.totalScore += attempt.score;
          stats.totalQuestions += attempt.total_questions;
          if (attempt.score === attempt.total_questions) {
            stats.perfectScores++;
          }
        });

        // Calculate averages and format data
        const processedStats = Object.entries(userQuizStats).map(([userId, stats]) => ({
          user_id: userId,
          totalQuizzes: stats.totalQuizzes,
          totalPoints: stats.totalPoints,
          averageScore: stats.totalQuestions > 0 
            ? ((stats.totalScore / stats.totalQuestions) * 100).toFixed(1)
            : 0,
          perfectScores: stats.perfectScores
        }));

        // Sort by total points
        processedStats.sort((a, b) => b.totalPoints - a.totalPoints);

        // Get user names for quiz stats
        const userIds = processedStats.map(stat => stat.user_id);
        const { data: userData, error: userError } = await supabase
          .from('accounts')
          .select('id, name')
          .in('id', userIds);

        if (userError) throw userError;

        // Add names to quiz stats
        const statsWithNames = processedStats.map(stat => ({
          ...stat,
          name: userData.find(user => user.id === stat.user_id)?.name || 'Unknown'
        }));

        setLeaderboardData(pointsData);
        setQuizStats(statsWithNames);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  if (loading) return <div className="loading">Loading leaderboard...</div>;

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <h1>Leaderboard</h1>
      </div>

      <div className="leaderboard-content">
        {/* Total Points Leaderboard */}
        <div className="leaderboard-section">
          <h2>Top Points</h2>
          <div className="leaderboard-table">
            <div className="table-header">
              <span>Rank</span>
              <span>Name</span>
              <span>Total Points</span>
            </div>
            {leaderboardData.map((user, index) => (
              <div key={user.id} className="table-row">
                <span className="rank">#{index + 1}</span>
                <span className="name">{user.name}</span>
                <span className="points">{user.total_points}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quiz Achievements Leaderboard */}
        <div className="leaderboard-section">
          <h2>Quiz Achievements</h2>
          <div className="leaderboard-table">
            <div className="table-header">
              <span>Rank</span>
              <span>Name</span>
              <span>Quizzes</span>
              <span>Points</span>
              <span>Avg Score</span>
              <span>Perfect</span>
            </div>
            {quizStats.map((user, index) => (
              <div key={user.user_id} className="table-row">
                <span className="rank">#{index + 1}</span>
                <span className="name">{user.name}</span>
                <span className="quizzes">{user.totalQuizzes}</span>
                <span className="points">{user.totalPoints}</span>
                <span className="score">{user.averageScore}%</span>
                <span className="perfect">{user.perfectScores}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .leaderboard-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .leaderboard-header {
          margin-bottom: 30px;
        }

        .leaderboard-header h1 {
          color: #8c30c2;
          margin: 0;
          font-size: 2em;
        }

        .leaderboard-content {
          display: grid;
          gap: 30px;
        }

        .leaderboard-section {
          background: rgba(255, 255, 255, 0.1);
          padding: 20px;
          border-radius: 8px;
        }

        .leaderboard-section h2 {
          color: #8c30c2;
          margin: 0 0 20px 0;
        }

        .leaderboard-table {
          display: grid;
          gap: 10px;
        }

        .table-header {
          display: grid;
          grid-template-columns: 80px 1fr repeat(4, 120px);
          gap: 20px;
          padding: 10px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 4px;
          font-weight: bold;
          color: #8c30c2;
        }

        .table-row {
          display: grid;
          grid-template-columns: 80px 1fr repeat(4, 120px);
          gap: 20px;
          padding: 10px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 4px;
          align-items: center;
        }

        .rank {
          color: #8c30c2;
          font-weight: bold;
        }

        .name {
          color: #e0e0e0;
        }

        .points, .quizzes, .score, .perfect {
          color: #b0b0b0;
          text-align: center;
        }

        .loading {
          text-align: center;
          padding: 20px;
          color: #b0b0b0;
        }
      `}</style>
    </div>
  );
}
