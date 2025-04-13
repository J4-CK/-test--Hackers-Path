import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch session on load
  useEffect(() => {
    async function fetchUserData() {
      try {
        const res = await fetch("/api/auth/session");
        const data = await res.json();

        if (res.ok) {
          setUser(data.user); // Set the user data
        } else {
          console.error("Session validation failed:", data.error);
          router.push("/login");
        }
      } catch (err) {
        console.error("Error fetching session:", err);
        router.push("/login");
      } finally {
        setLoading(false); // Stop loading indicator
      }
    }
    fetchUserData();
  }, [router]);

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

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <div>
        <Head>
          <title>Loading...</title>
          <link rel="stylesheet" href="/styles/homepagestyle.css" />
        </Head>
        <div className="loading">Loading...</div>
      </div>
    );
  }

  // Show fallback message if no user data is available
  if (!user) {
    return (
      <div>
        <Head>
          <title>Unauthorized</title>
          <link rel="stylesheet" href="/styles/homepagestyle.css" />
        </Head>
        <div className="loading">You are not logged in. Redirecting...</div>
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>Profile - Hacker's Path</title>
        <link rel="stylesheet" href="/styles/homepagestyle.css" />
      </Head>

      <header>
        <h1>
          <a href="/">Hacker's Path</a>
        </h1>
      </header>

      <div className="roadmap">
        <a href="/leaderboard">Leaderboard</a>
        <a href="/lessons">Lessons</a>
        <a href="/quiz">Quizzes</a>
        <a href="/profile">Profile</a>
      </div>

      <div className="container">
        {/* User Details Section */}
        <div className="section">
          <h2>Profile Details</h2>
          <div className="profile-details">
            <div className="detail-item">
              <h3>Username:</h3>
              <p>{user.username || "N/A"}</p>
            </div>
            <div className="detail-item">
              <h3>Email:</h3>
              <p>{user.email || "N/A"}</p>
            </div>
            <div className="detail-item">
              <h3>Region:</h3>
              <p>{user.region || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="section">
          <h2>Stats</h2>
          <div className="stats">
            <div className="stat-item">
              <h3>Current Streak</h3>
              <p>{user.streak || 0} Days</p>
            </div>
            <div className="stat-item">
              <h3>Total Points</h3>
              <p>{user.totalPoints || 0}</p>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="section">
          <h2>Recent Activity</h2>
          {user.recentActivity && user.recentActivity.length > 0 ? (
            user.recentActivity.map((activity, index) => (
              <div key={index} className="activity-item">
                <h3>{activity.action}</h3>
                <p>{activity.description}</p>
                <p>{activity.date}</p>
              </div>
            ))
          ) : (
            <p>No recent activity to show.</p>
          )}
        </div>

        {/* Logout Button */}
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
}
