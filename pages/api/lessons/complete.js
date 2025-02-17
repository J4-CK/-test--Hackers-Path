import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userId, lessonId } = req.body;

    if (!userId || !lessonId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Verify lesson exists
    const { data: lesson, error: lessonError } = await supabase
      .from("completion")
      .select("lesson_id")
      .eq("lesson_id", lessonId)
      .eq("user_id", userId)
      .single();

    if (lessonError || !lesson) {
      return res.status(404).json({ error: "Lesson not found or not started" });
    }

    // Fetch user's last streak update
    const { data: streakData } = await supabase
      .from("streak_tracking")
      .select("streak, last_streak_update")
      .eq("user_id", userId)
      .single();

    let streak = streakData?.streak || 0;
    let lastUpdate = streakData?.last_streak_update ? new Date(streakData.last_streak_update) : null;

    const now = new Date();
    const cstNow = new Date(now.toLocaleString("en-US", { timeZone: "America/Chicago" }));
    const lastCstUpdate = lastUpdate ? new Date(lastUpdate.toLocaleString("en-US", { timeZone: "America/Chicago" })) : null;

    if (!lastCstUpdate || lastCstUpdate < cstNow.setHours(0, 0, 0, 0)) {
      // If the last streak update was before today, increment or reset streak
      const yesterdayMidnight = new Date(cstNow);
      yesterdayMidnight.setDate(yesterdayMidnight.getDate() - 1);

      if (lastCstUpdate >= yesterdayMidnight) {
        streak += 1;
      } else {
        streak = 1;
      }

      await supabase
        .from("streak_tracking")
        .upsert({
          user_id: userId,
          last_streak_update: cstNow.toISOString(),
          streak
        });
    }

    return res.status(200).json({ message: "Streak updated", streak });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
