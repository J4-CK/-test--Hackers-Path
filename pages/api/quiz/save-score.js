import { createClient } from "@supabase/supabase-js";
import cookie from "cookie";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
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

    const { quizName, score, maxScore } = req.body;
    const userId = sessionUser.user.id;

    // Save the quiz score
    const { error: scoreError } = await supabase
      .from("quiz_scores")
      .insert([
        {
          user_id: userId,
          quiz_name: quizName,
          score: score,
          max_score: maxScore,
          completed_at: new Date().toISOString()
        }
      ]);

    if (scoreError) {
      console.error('Error saving score:', scoreError);
      return res.status(500).json({ error: "Failed to save score" });
    }

    // Update user activity
    const { error: activityError } = await supabase
      .from("user_activity")
      .insert([
        {
          user_id: userId,
          activity: `Completed ${quizName} with score ${score}/${maxScore}`,
          created_at: new Date().toISOString()
        }
      ]);

    if (activityError) {
      console.error('Error logging activity:', activityError);
      // Don't return error here as the score was saved successfully
    }

    return res.status(200).json({ message: "Score saved successfully" });
  } catch (err) {
    console.error('Save score error:', err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
} 
