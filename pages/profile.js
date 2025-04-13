import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Fetch session on load
  useEffect(() => {
    async function fetchUserData() {
      try {
        const res = await fetch("/api/auth/session");
        const data = await res.json();

        if (res.ok) {
          setUser(data.user);
        } else {
          console.error("Session validation failed:", data.error);
          router.push("/login");
        }
      } catch (err) {
        console.error("Error fetching session:", err);
        router.push("/login");
      }
    }
    fetchUserData();
  }, [router]);

  // Close menu on scroll
  useEffect(() => {
    const handleScroll = () => setMenuOpen(false);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on link click
  const handleNavLinkClick = () => {
    setMenuOpen(false);
  };

  // Handle logout
  async function handleLogout() {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        router.push("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (err) {
      console.error("Error logging out:", err);
    }
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Head>
        <title>Profile - Hacker's Path</title>
        <link rel="stylesheet" href="/styles/homepagestyle.css" />
      </Head>

      <header>
        <h1><a href="/">Hacker's Path</a></h1>
      </header>

      <div className="roadmap-wrapper">
        {!menuOpen ? (
          <button className="hamburger" onClick={() => setMenuOpen(true)}>
            ☰
          </button>
        ) : (
          <button className="hamburger close-btn" onClick={() => setMenuOpen(false)}>
            ×
          </button>
        )}
        <nav className={`roadmap ${menuOpen ? 'open' : ''}`}>
          <a href="/leaderboard" onClick={handleNavLinkClick}>Leaderboard</a>
          <a href="/lessons" onClick={handleNavLinkClick}>Lessons</a>
          <a href="/quiz" onClick={handleNavLinkClick}>Quizzes</a>
          <a href="/profile" onClick={handleNavLinkClick}>
            {user.username ? `Profile (${user.username})` : 'Profile'}
          </a>
        </nav>
      </div>

      <div className="container">
        {/* Profile Details Section */}
        <div className="section">
          <h2>Profile Details</h2>
          <div className="profile-details">
            <div className="detail-item">
              <h3 style={{ color: '#8c30c2' }}>Username:</h3>
              <p>{user.username || "N/A"}</p>
            </div>
            <div className="detail-item">
              <h3 style={{ color: '#8c30c2' }}>Email:</h3>
              <p>{user.email || "N/A"}</p>
            </div>
            <div className="detail-item">
              <h3 style={{ color: '#8c30c2' }}>Region:</h3>
              <p>{user.region || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="section">
          <h2>Stats</h2>
          <div className="stats">
            <div className="box">
              <h3>Current Streak</h3>
              <p>{user.streak || 0} Days</p>
            </div>
            <div className="box">
              <h3>Total Points</h3>
              <p>{user.totalPoints || 0}</p>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="section">
          <h2>Recent Activity</h2>
          <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '8px', marginTop: '1rem' }}>
            {user.recentActivity && user.recentActivity.length > 0 ? (
              user.recentActivity.map((activity, index) => (
                <div key={index} className="activity-item">
                  <p>{activity.description}</p>
                  <p>{activity.date}</p>
                </div>
              ))
            ) : (
              <p>No recent activity to show.</p>
            )}
          </div>
        </div>

        <button onClick={handleLogout} style={{
          background: '#dc3545',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '2rem'
        }}>
          Logout
        </button>
      </div>
    </div>
  );
}
