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

    // Step 2: Insert into profiles
    const { error: profileError } = await supabase.from('profiles').insert([
      { id: userId, username }
    ]);

    if (profileError) {
      console.error("Profile Insert Error:", profileError);
      await adminSupabase.auth.admin.deleteUser(userId);
      return res.status(400).json({ error: profileError.message });
    }

    // Step 3: Insert into accounts
    const accountData = [
      {
        user_id: userId,
        name: username,
        region: "default",
        completion: 0
      }
    ];

    console.log("Debug Insert Data for Accounts:", JSON.stringify(accountData));

    const { error: accountsError } = await supabase.from("accounts").insert(accountData);

    if (accountsError) {
      console.error("Accounts Insert Error:", accountsError);
      await adminSupabase.auth.admin.deleteUser(userId);
      return res.status(400).json({ error: accountsError.message });
    }

    // Step 4: Insert into leaderboard
    const leaderboardData = [
      {
        user_id: userId,
        region: "default",
        monthly_points: 0,
        streak: 0,
        total_points: 0
      }
    ];

    console.log("Debug Insert Data for Leaderboard:", JSON.stringify(leaderboardData));

    const { error: leaderboardError } = await supabase.from("leaderboard").insert(leaderboardData);

    if (leaderboardError) {
      console.error("Leaderboard Insert Error:", leaderboardError);
      await adminSupabase.auth.admin.deleteUser(userId);
      return res.status(400).json({ error: leaderboardError.message });
    }

    // Step 5: Insert into completion
    const completionData = [
      {
        user_id: userId,
        lesson_id: 0,
        complete: 0,
        total_score: 0
      }
    ];

    console.log("Debug Insert Data for Completion:", JSON.stringify(completionData));

    const { error: completionError } = await supabase.from("completion").insert(completionData);

    if (completionError) {
      console.error("Completion Insert Error:", completionError);
      await adminSupabase.auth.admin.deleteUser(userId);
      return res.status(400).json({ error: completionError.message });
    }

    return res.status(200).json({ message: 'Registration successful!', user: authData.user });
  } catch (err) {
    console.error('API Error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
