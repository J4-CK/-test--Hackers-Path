import { fetchLeaderboard } from './api/auth/leaderboard';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Leaderboard({ players }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState(players || []); // Use initial data from SSR
  const [userEntry, setUserEntry] = useState(null);

  useEffect(() => {
  async function checkSession() {
    const res = await fetch('/api/auth/session');
    const data = await res.json();
    console.log("Session Data:", data); // Debugging user session

    if (res.ok && data.user) {
      setUser(data.user);

      const leaderboard = await fetchLeaderboard();
      console.log("Fetched Leaderboard Data:", leaderboard); // Debugging leaderboard fetch

      setLeaderboardData(leaderboard);

      // Ensure we correctly match user entry
      const userData = leaderboard.find(player => player.username === data.user.username);
      console.log("User Entry Found:", userData); // Debugging user entry

      setUserEntry(userData);
    } else {
      router.push('/login');
    }
  }

  checkSession();
}, [router]);


    checkSession();
  }, [router]);

  if (!user) {
    return <div>Loading...</div>; // Show loading state
  }

  // Get the top 20 players
  const topPlayers = leaderboardData.slice(0, 20);

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
        <a href="/profile">{user.username ? `Profile (${user.username})` : 'Profile'}</a>
      </div>

      <div style={{ fontFamily: 'Arial, sans-serif', textAlign: 'center', padding: '20px' }}>
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
            {topPlayers.map((player, index) => (
              <tr key={player.user_id} style={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
                <td style={styles.td}>{index + 1}</td>
                <td style={styles.td}>{player.username || player.name}</td> {/* Ensure field is correct */}
                <td style={styles.td}>{player.total_points}</td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
{userEntry ? (
  <div className="user-rank" style={{ marginTop: "20px" }}>
    <h2>Your Position</h2>
    <table style={{ margin: '0 auto', borderCollapse: 'collapse', width: '50%' }}>
      <thead>
        <tr>
          <th style={styles.th}>Rank</th>
          <th style={styles.th}>Username</th>
          <th style={styles.th}>Score</th>
        </tr>
      </thead>
      <tbody>
        <tr style={styles.userRow}>
          <td style={styles.td}>
            {leaderboardData.findIndex(player => player.username === user.username) + 1}
          </td>
          <td style={styles.td}>{userEntry.username}</td>
          <td style={styles.td}>{userEntry.total_points}</td>
        </tr>
      </tbody>
    </table>
  </div>
) : (
  <p style={{ textAlign: 'center', marginTop: '20px' }}>Your ranking is not available.</p>
)}


// Fetch data on the server
export async function getServerSideProps() {
  try {
    const players = await fetchLeaderboard();
    console.log('Fetched players:', players); // Debugging

    return {
      props: { players },
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
  userRow: {
    backgroundColor: '#ffeb3b',
    fontWeight: 'bold',
  },
};
