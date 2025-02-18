import { fetchLeaderboard } from './api/auth/leaderboard';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Leaderboard({ players }) {
const router = useRouter();
const [user, setUser] = useState(null);
const [leaderboardData, setLeaderboardData] = useState([]);
const [userEntry, setUserEntry] = useState(null);

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
        
      async function getLeaderboard() {
      const data = await fetchLeaderboard();
      setLeaderboardData(data);

      if (currentUser) {
        const user = data.find(player => player.username === currentUser.username);
        setUserEntry(user);
      }
    }

    checkSession(); // Call the function

}, [router]); // <-- Missing dependency array was already present, but function lacked closure



    if (!user) {
        return <div>Loading...</div>; // Show loading spinner or fallback UI
    }
  // Get the top 20 players
  const topPlayers = Players.slice(0, 20);

  // Find the current user's data
  const userEntry = leaderboardData.find(player => player.name === currentUser.username);
    
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
      <a href="/profile">{user.username ? Profile (${user.username}) : 'Profile'}</a>
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
    </div>
  </div>
);
}

export async function getServerSideProps() {
    try {
        const players = await fetchLeaderboard();

        // Debug: Log fetched data
        console.log('Fetched players:', players);

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
};
