import { createClient } from '@supabase/supabase-js';

// Supabase client setup
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Supabase Admin client for user deletion (Service Role Key)
const adminSupabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ error: 'Email, username, and password are required.' });
  }

  try {
    // Step 1: Register the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    const userId = authData?.user?.id;

    console.log("Debug: User ID before inserting into profiles:", userId);

    if (!userId) {
      return res.status(400).json({ error: 'User registration failed. No user ID returned.' });
    }

    // Step 2: Retrieve the authenticated user instead of session
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData?.user?.id) {
      console.error("User retrieval error:", userError);
      await adminSupabase.auth.admin.deleteUser(userId);
      return res.status(401).json({ error: 'User authentication failed. Please try again.' });
    }

    console.log("Authenticated User ID:", userData.user.id);

    // Step 3: Insert into profiles table (Ensure id matches auth.uid())
    const { error: profileError } = await supabase.from('profiles').insert([
      { id: userId, username }
    ]);

    if (profileError) {
      console.error("Profile Insert Error:", profileError.details || profileError.message);
      await adminSupabase.auth.admin.deleteUser(userId);
      return res.status(400).json({ error: profileError.message });
    }

    // Step 4: Insert into accounts table
    const { error: accountsError } = await supabase.from('accounts').insert([
      { user_id: userId, name: username, region: 'default', completion: 0 }
    ]);

    if (accountsError) {
      console.error("Accounts Insert Error:", accountsError.details || accountsError.message);
      await adminSupabase.auth.admin.deleteUser(userId);
      return res.status(400).json({ error: accountsError.message });
    }

    // Step 5: Insert into leaderboard table
    const { error: leaderboardError } = await supabase.from('leaderboard').insert([
      { user_id: userId, region: 'default', monthly_points: 0, streak: 0, total_points: 0 }
    ]);

    if (leaderboardError) {
      console.error("Leaderboard Insert Error:", leaderboardError.details || leaderboardError.message);
      await adminSupabase.auth.admin.deleteUser(userId);
      return res.status(400).json({ error: leaderboardError.message });
    }

    // Step 6: Insert into completion table
    const { error: completionError } = await supabase.from('completion').insert([
      { user_id: userId, lesson_id: 0, complete: 0, total_score: 0 }
    ]);

    if (completionError) {
      console.error("Completion Insert Error:", completionError.details || completionError.message);
      await adminSupabase.auth.admin.deleteUser(userId);
      return res.status(400).json({ error: completionError.message });
    }

    return res.status(200).json({ message: 'Registration successful!', user: userData.user });
  } catch (err) {
    console.error('API Error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
