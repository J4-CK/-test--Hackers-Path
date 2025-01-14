import { fetchLeaderboard } from './api/auth/leaderboard';

export default function Leaderboard({ players }) {
    return (
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
                            <tr
                                key={player.user_id}
                                style={index % 2 === 0 ? styles.evenRow : styles.oddRow}
                            >
                                <td style={styles.td}>{index + 1}</td>
                                <td style={styles.td}>{player.user_id}</td>
                                <td style={styles.td}>{player.total_points}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
    },
    evenRow: {
        backgroundColor: '#f9f9f9',
    },
    oddRow: {
        backgroundColor: '#fff',
    },
};
