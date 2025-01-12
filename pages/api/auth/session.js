import { createClient } from "@supabase/supabase-js";
import cookie from "cookie";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};
    const token = cookies.token;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    // Validate token and get session user
    const { data: sessionUser, error: sessionError } = await supabase.auth.getUser(token);

    if (sessionError || !sessionUser?.user?.id) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    const userId = sessionUser.user.id;

    // Fetch profile data
    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", userId)
      .single();

    // Fetch leaderboard data
    const { data: leaderboard } = await supabase
      .from("leaderboard")
      .select("streak, total_points, region")
      .eq("user_id", userId)
      .single();

    // Return combined user data
    return res.status(200).json({
      user: {
        email: sessionUser.user.email,
        username: profile?.username || "N/A",
        streak: leaderboard?.streak || 0,
        totalPoints: leaderboard?.total_points || 0,
        region: leaderboard?.region || "N/A",
      },
    });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
