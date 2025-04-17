import { createClient } from "@supabase/supabase-js";
import cookie from "cookie";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

function timeSince(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 31536000; // years

  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000; // months
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400; // days
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600; // hours
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60; // minutes
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
}

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
      .from("accounts")
      .select("name, region")
      .eq("id", userId)
      .single();

    // Fetch streak data
    const { data: streakData } = await supabase
      .from("streaktracker")
      .select("streak, last_streak_update")
      .eq("user_id", userId)
      .single();

    // Fetch recent activity
    const { data: recentActivity } = await supabase
      .from("user_activity")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10);

    let streak = streakData?.streak || 0;
    let lastUpdate = streakData?.last_streak_update ? new Date(streakData.last_streak_update) : null;
    const now = new Date();

    // Convert to CST
    const cstNow = new Date(now.toLocaleString("en-US", { timeZone: "America/Chicago" }));
    const lastCstUpdate = lastUpdate ? new Date(lastUpdate.toLocaleString("en-US", { timeZone: "America/Chicago" })) : null;

    // Check if streak needs updating
    if (lastCstUpdate) {
      const lastMidnight = new Date(cstNow);
      lastMidnight.setHours(0, 0, 0, 0);

      if (lastCstUpdate < lastMidnight) {
        const yesterdayMidnight = new Date(lastMidnight);
        yesterdayMidnight.setDate(yesterdayMidnight.getDate() - 1);

        if (lastCstUpdate >= yesterdayMidnight) {
          streak += 1; // Continue streak
        } else {
          streak = 1; // Reset streak
        }

        await supabase
          .from("streak_tracking")
          .upsert({
            user_id: userId,
            last_streak_update: cstNow.toISOString(),
            streak
          });
      }
    } else {
      streak = 1;
      await supabase
        .from("streak_tracking")
        .insert({
          user_id: userId,
          last_streak_update: cstNow.toISOString(),
          streak
        });
    }

    // Format recent activity with time since
    const formattedActivity = recentActivity?.map(activity => ({
      ...activity,
      timeSince: timeSince(activity.created_at)
    })) || [];

    return res.status(200).json({
      user: {
        email: sessionUser.user.email,
        username: profile?.username || "N/A",
        region: profile?.region || "N/A",
        streak,
        recentActivity: formattedActivity
      },
    });
  } catch (err) {
    console.error('Session error:', err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
