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

    const { activityType, description } = req.body;
    
    if (!activityType || !description) {
      return res.status(400).json({ error: "Activity type and description are required" });
    }

    // Record the activity
    const { data, error } = await supabase
      .from("user_activity")
      .insert({
        user_id: sessionUser.user.id,
        activity_type: activityType,
        description: description
      });

    if (error) {
      throw error;
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error recording activity:', err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
} 