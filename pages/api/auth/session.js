import { createClient } from "@supabase/supabase-js";
import cookie from "cookie";

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  // Allow only GET requests for session retrieval
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Parse the token from cookies
    const cookies = cookie.parse(req.headers.cookie || "");
    const token = cookies.token;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    // Verify and retrieve the user from Supabase
    const { data: user, error } = await supabase.auth.getUser(token);

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    // Return user session data
    return res.status(200).json({ user });
  } catch (err) {
    console.error("Session Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
