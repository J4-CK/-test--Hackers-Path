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
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    const userId = authData?.user?.id;
    console.log("✅ User signed up with ID:", userId);

    if (!userId) {
      return res.status(400).json({ error: 'User registration failed. No user ID returned.' });
    }

    // Insert into profiles
    console.log("➡️ Inserting into profiles...");
    const { data: profileData, error: profileError } = await supabase.from('profiles').insert([
      { id: userId, username }
    ]);
    console.log("✅ Profiles insert result:", profileData);
    if (profileError) {
      console.error("❌ Profile Insert Error:", profileError);
      await adminSupabase.auth.admin.deleteUser(userId);
      return res.status(400).json({ error: profileError.message, details: profileError });
    }

    // Insert into accounts
    const accountData = [
      {
        user_id: userId,
        name: username,
        region: "default",
        completion: [0], // FIXED here: must be int[]
      }
    ];

    console.log("➡️ Inserting into accounts:", JSON.stringify(accountData));
    const { data: accountsData, error: accountsError } = await supabase.from("accounts").insert(accountData);
    console.log("✅ Accounts insert result:", accountsData);
    if (accountsError) {
      console.error("❌ Accounts Insert Error:", accountsError);
      await adminSupabase.auth.admin.deleteUser(userId);
      return res.status(400).json({ error: accountsError.message, details: accountsError });
    }

    // Insert into leaderboard
    const leaderboardData = [
      {
        user_id: userId,
        region: "default",
        monthly_points: 0,
        streak: 0,
        total_points: 0
      }
    ];

    console.log("➡️ Inserting into leaderboard:", JSON.stringify(leaderboardData));
    const { data: leaderboardRes, error: leaderboardError } = await supabase.from("leaderboard").insert(leaderboardData);
    console.log("✅ Leaderboard insert result:", leaderboardRes);
    if (leaderboardError) {
      console.error("❌ Leaderboard Insert Error:", leaderboardError);
      await adminSupabase.auth.admin.deleteUser(userId);
      return res.status(400).json({ error: leaderboardError.message, details: leaderboardError });
    }

    // Insert into completion table
    const completionData = [
      {
        user_id: userId,
        lesson_id: 0,
        complete: 0,
        total_score: 0
      }
    ];

    console.log("➡️ Inserting into completion:", JSON.stringify(completionData));
    const { data: completionRes, error: completionError } = await supabase.from("completion").insert(completionData);
    console.log("✅ Completion insert result:", completionRes);
    if (completionError) {
      console.error("❌ Completion Insert Error:", completionError);
      await adminSupabase.auth.admin.deleteUser(userId);
      return res.status(400).json({ error: completionError.message, details: completionError });
    }

    return res.status(200).json({ message: 'Registration successful!', user: authData.user });
  } catch (err) {
    console.error('❌ API Error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
