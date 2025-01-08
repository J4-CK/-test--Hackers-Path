import leaderboardData from '../data/leaderboard.json';

export default function Leaderboard() {
    return (
        <div style={{ fontFamily: 'Arial, sans-serif', textAlign: 'center', padding: '20px' }}>
            <div className="leaderboard">
                <h1>Top 20 Leaderboard</h1>
                <table style={{ margin: '0 auto', borderCollapse: 'collapse', width: '80%' }}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Rank</th>
                            <th style={styles.th}>Player</th>
                            <th style={styles.th}>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboardData.map((player, index) => (
                            <tr
                                key={player.id}
                                style={index % 2 === 0 ? styles.evenRow : styles.oddRow}
                            >
                                <td style={styles.td}>{index + 1}</td>
                                <td style={styles.td}>{player.player_name}</td>
                                <td style={styles.td}>{player.score}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
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
