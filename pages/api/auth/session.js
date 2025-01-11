import { createClient } from "@supabase/supabase-js";
import cookie from "cookie";

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  console.log("Incoming request:", req.method, req.url);

  if (req.method !== "GET") {
    console.error("Invalid request method:", req.method);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Parse cookies
    const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};
    console.log("Parsed cookies:", cookies);

    const token = cookies.token;

    if (!token) {
      console.error("No token found in cookies");
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    console.log("Token received:", token);

    // Decode the token for debugging purposes
    const jwt = require("jsonwebtoken");
    const decoded = jwt.decode(token);
    console.log("Decoded token:", decoded);

    if (decoded?.exp * 1000 < Date.now()) {
      console.error("Token expired:", decoded.exp);
      return res.status(401).json({ error: "Unauthorized: Token expired" });
    }

    // Validate token and get session user
    const { data: sessionUser, error: sessionError } = await supabase.auth.getUser(token);
    if (sessionError) {
      console.error("Session validation failed:", sessionError.message);
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    console.log("Session user data:", sessionUser);

    const userId = sessionUser?.id;

    if (!userId) {
      console.error("User ID is undefined or missing in session");
      return res.status(400).json({ error: "User ID is missing in session" });
    }

    console.log("User ID:", userId);

    // Fetch profile data
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", userId)
      .single();

    if (profileError) {
      console.error(`Error fetching profile for user ID ${userId}:`, profileError.message);
    } else {
      console.log("Profile data:", profile);
    }

    // Fetch leaderboard data
    const { data: leaderboard, error: leaderboardError } = await supabase
      .from("leaderboard")
      .select("streak, total_points, region")
      .eq("user_id", userId)
      .single();

    if (leaderboardError) {
      console.error(`Error fetching leaderboard data for user ID ${userId}:`, leaderboardError.message);
    } else {
      console.log("Leaderboard data:", leaderboard);
    }

    // Return combined user data (handle missing data gracefully)
    return res.status(200).json({
      user: {
        email: sessionUser.email,
        username: profile?.username || "N/A",
        streak: leaderboard?.streak || 0,
        totalPoints: leaderboard?.total_points || 0,
        region: leaderboard?.region || "N/A",
      },
    });
  } catch (err) {
    console.error("Unhandled error occurred:", err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
