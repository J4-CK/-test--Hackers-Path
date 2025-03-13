import { fetchLeaderboard, fetchLeaderboardstreak, fetchLeaderboardmonthly } from './api/auth/leaderboard';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Leaderboard({ initialPlayers }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [players, setPlayers] = useState(initialPlayers);
  const [leaderboardType, setLeaderboardType] = useState('default');

  useEffect(() => {
    async function checkSession() {
      const res = await fetch('/api/auth/session');
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
      } else {
        router.push('/login');
      }
    }
    checkSession();
  }, [router]);

  const fetchData = async (type) => {
    let newPlayers;
    switch (type) {
      case 'streak':
        newPlayers = await fetchLeaderboardstreak();
        break;
      case 'monthly':
        newPlayers = await fetchLeaderboardmonthly();
        break;
      default:
        newPlayers = await fetchLeaderboard();
    }
    setPlayers(newPlayers.slice(0, 20));
    setLeaderboardType(type);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const loggedInUser = players.find(player => player.name === user.username);

  return (
    <div>
      <Head>
        <title>Hacker's Path</title>
        <link rel="stylesheet" href="/styles/homepagestyle.css" />
      </Head>
      <div>
        <header>
          <h1><a href="/index">Hacker's Path</a></h1>
        </header>
      </div>
      <div className="roadmap">
        <a href="/leaderboard">Leaderboard</a>
        <a href="/htmllessons/lessons.html">Lessons</a>
        <a href="/htmlquiz/quizzes.html">Quizzes</a>
        <a href="/profile">{user?.username ? `Profile (${user.username})` : 'Profile'}</a>
      </div>

        <div style={{ textAlign: 'center', padding: '20px' }}>
          <button style={styles.button} onClick={() => fetchData('default')}>Overall</button>
          <button style={styles.button} onClick={() => fetchData('streak')}>Streak</button>
          <button style={styles.button} onClick={() => fetchData('monthly')}>Monthly</button>

        <div className="leaderboard">
          <h1>{leaderboardType === 'default' ? 'Top 20 Leaderboard' : leaderboardType === 'streak' ? 'Top 20 Streak Leaderboard' : 'Top 20 Monthly Points Leaderboard'}</h1>
          <table style={{ margin: '0 auto', borderCollapse: 'collapse', width: '80%' }}>
            <thead>
              <tr>
                <th style={styles.th}>Rank</th>
                <th style={styles.th}>Username</th>
                <th style={styles.th}>{leaderboardType === 'default' ? 'Points' : leaderboardType === 'streak' ? 'Streak' : 'Monthly Points'}</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, index) => (
                <tr key={player.user_id} style={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
                  <td style={styles.td}>{index + 1}</td>
                  <td style={styles.td}>{player.name}</td>
                  <td style={styles.td}>{leaderboardType === 'default' ? player.total_points : leaderboardType === 'streak' ? player.streak : player.monthly_points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {loggedInUser && (
          <div className="leaderboard" style={{ marginTop: '40px' }}>
            <h1>Your Ranking</h1>
            <table style={{ margin: '0 auto', borderCollapse: 'collapse', width: '80%' }}>
              <thead>
                <tr>
                  <th style={styles.th}>Rank</th>
                  <th style={styles.th}>Username</th>
                  <th style={styles.th}>{leaderboardType === 'default' ? 'Points' : leaderboardType === 'streak' ? 'Streak' : 'Monthly Points'}</th>
                </tr>
              </thead>
              <tbody>
                <tr style={styles.evenRow}>
                  <td style={styles.td}>{players.findIndex(player => player.name === user.username) + 1}</td>
                  <td style={styles.td}>{loggedInUser.name}</td>
                  <td style={styles.td}>{leaderboardType === 'default' ? loggedInUser.total_points : leaderboardType === 'streak' ? loggedInUser.streak : loggedInUser.monthly_points}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const players = await fetchLeaderboard();
    return {
      props: { initialPlayers: players.slice(0, 20) },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      props: { initialPlayers: [] },
    };
  }
}

const styles = {
  th: { backgroundColor: '#6a1b9a', color: 'white', padding: '10px', textAlign: 'center' },
  td: { padding: '10px', borderBottom: '1px solid #ddd', color: '#000' },
  evenRow: { backgroundColor: '#f9f9f9' },
  oddRow: { backgroundColor: '#fff' },
  button: {
    backgroundColor: '#6a1b9a',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    margin: '5px',
    cursor: 'pointer',
    borderRadius: '5px',
    fontSize: '16px',
  }
};
