import { fetchLeaderboard } from './api/auth/leaderboard';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Leaderboard({ players }) {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function checkSession() {
      const res = await fetch('/api/auth/session');
      const data = await res.json();
      console.log("Session Data:", data); // Debugging

      if (res.ok && data.user) {
        setUser(data.user);
      } else {
        router.push('/login');
      }
    }

    checkSession();
  }, [router]);

  if (!user) {
    return <div>Loading...</div>; // Show loading spinner or fallback UI
  }

  // Find the logged-in user in the leaderboard data
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
        {/* Display the user's username on the "Profile" button */}
        <a href="/profile">{user?.username ? `Profile (${user.username})` : 'Profile'}</a>
      </div>

      <div style={{ fontFamily: 'Arial, sans-serif', textAlign: 'center', padding: '20px' }}>
        {/* Top 20 Leaderboard */}
        <div className="leaderboard">
          <h1>Top 20 Leaderboard</h1>
          <table style={{ margin: '0 auto', borderCollapse: 'collapse', width: '80%' }}>
            <thead>
              <tr>
                <th style={styles.th}>Rank</th>
                <th style={styles.th}>Username</th>
                <th style={styles.th}>Score</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, index) => (
                <tr key={player.user_id} style={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
                  <td style={styles.td}>{index + 1}</td>
                  <td style={styles.td}>{player.name}</td>
                  <td style={styles.td}>{player.total_points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Logged-in User Table */}
        {loggedInUser && (
          <div className="leaderboard" style={{ marginTop: '40px' }}>
            <h1>Your Stats</h1>
            <table style={{ margin: '0 auto', borderCollapse: 'collapse', width: '50%' }}>
              <thead>
                <tr>
                  <th style={styles.th}>Rank</th>
                  <th style={styles.th}>Username</th>
                  <th style={styles.th}>Score</th>
                </tr>
              </thead>
              <tbody>
                <tr style={styles.evenRow}>
                  <td style={styles.td}>
                    {players.findIndex(player => player.name === user.username) + 1}
                  </td>
                  <td style={styles.td}>{loggedInUser.name}</td>
                  <td style={styles.td}>{loggedInUser.total_points}</td>
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

    // Debug: Log fetched data
    console.log('Fetched players:', players);

    // Limit the array to the top 20 players
    const topPlayers = players.slice(0, 20);

    return {
      props: { players: topPlayers },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);

    return {
      props: { players: [] }, // Fallback to empty data
    };
  }
}


const styles = {
  th: {
    backgroundColor: '#6a1b9a',
    color: 'white',
    padding: '10px',
    textAlign: 'center',
  },
  td: {
    padding: '10px',
    borderBottom: '1px solid #ddd',
    color: '#000',
  },
  evenRow: {
    backgroundColor: '#f9f9f9',
  },
  oddRow: {
    backgroundColor: '#fff',
  },
};
