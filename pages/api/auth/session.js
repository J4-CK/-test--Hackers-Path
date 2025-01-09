import { createClient } from "@supabase/supabase-js";
import cookie from "cookie";

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Parse the token from cookies
    const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};
    const token = cookies.token;

    if (!token) {
      console.error("No token provided");
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Validate session and get user ID
    const { data: sessionUser, error: sessionError } = await supabase.auth.getUser(token);

    if (sessionError) {
      console.error("Session validation failed:", sessionError.message);
      return res.status(401).json({ error: "Invalid session token" });
    }

    const userId = sessionUser.id;

    // Fetch profile data from 'profiles' table
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", userId)
      .single();

    if (profileError) {
      console.error("Error fetching profile:", profileError.message);
      return res.status(500).json({ error: "Error fetching profile data" });
    }

    // Fetch leaderboard data from 'leaderboard' table
    const { data: leaderboard, error: leaderboardError } = await supabase
      .from("leaderboard")
      .select("streak, total_points, region")
      .eq("user_id", userId)
      .single();

    if (leaderboardError) {
      console.error("Error fetching leaderboard:", leaderboardError.message);
      return res.status(500).json({ error: "Error fetching leaderboard data" });
    }

    // Return the combined user data
    return res.status(200).json({
      user: {
        email: sessionUser.email,
        username: profile.username || "N/A",
        streak: leaderboard.streak || 0,
        totalPoints: leaderboard.total_points || 0,
        region: leaderboard.region || "N/A",
      },
    });
  } catch (err) {
    console.error("Internal Server Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
