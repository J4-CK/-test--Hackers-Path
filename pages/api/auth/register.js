import { createClient } from '@supabase/supabase-js';

// Supabase public client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Admin client (for rollback if needed)
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
    // Step 1: Sign up the user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password
    });

    if (signUpError) {
      return res.status(400).json({ error: signUpError.message });
    }

    const userId = signUpData?.user?.id;
    if (!userId) {
      return res.status(400).json({ error: 'User registration failed. No user ID returned.' });
    }

    // Step 2: Sign in to get access token
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    // === DEBUG: Log sign-in response ===
    console.log("📦 signInData:", JSON.stringify(signInData, null, 2));
    console.log("❌ signInError:", signInError);
    // === END DEBUG ===

    const token = signInData?.session?.access_token;

    // === DEBUG: Log access token ===
    console.log("🔑 Access token used:", token);
    // === END DEBUG ===

    if (signInError || !token) {
      await adminSupabase.auth.admin.deleteUser(userId);
      return res.status(401).json({ error: 'Sign-in after signup failed.' });
    }

    // Step 3: Create token-based client
    const userClient = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      }
    );

    // === DEBUG: Check what auth.uid() resolves to ===
    const { data: debugData, error: debugError } = await userClient.rpc("debug_uid");
    if (debugError) {
      console.error("❌ debug_uid RPC error:", debugError);
    } else {
      console.log("🔍 debug_uid result:", debugData?.[0]);
    }
    // === END DEBUG ===

    // Step 4: Insert into profiles
    const { error: profileError } = await userClient.from('profiles').insert([
      { id: userId, username }
    ]);

    if (profileError) {
      await adminSupabase.auth.admin.deleteUser(userId);
      return res.status(400).json({ error: profileError.message });
    }

    // Step 5: Insert into accounts
    const accountData = [
      {
        user_id: userId,
        name: username,
        region: 'default',
        completion: [0]
      }
    ];
    const { error: accountsError } = await userClient.from('accounts').insert(accountData);
    if (accountsError) {
      await adminSupabase.auth.admin.deleteUser(userId);
      return res.status(400).json({ error: accountsError.message });
    }

    // Step 6: Insert into leaderboard
    const leaderboardData = [
      {
        user_id: userId,
        region: "default",
        monthly_points: 0,
        streak: 0,
        total_points: 0
      }
    ];
    const { error: leaderboardError } = await userClient.from('leaderboard').insert(leaderboardData);
    if (leaderboardError) {
      await adminSupabase.auth.admin.deleteUser(userId);
      return res.status(400).json({ error: leaderboardError.message });
    }

    // Step 7: Insert into completion
    const completionData = [
      {
        user_id: userId,
        lesson_id: 0,
        complete: 0,
        total_score: 0
      }
    ];
    const { error: completionError } = await userClient.from('completion').insert(completionData);
    if (completionError) {
      await adminSupabase.auth.admin.deleteUser(userId);
      return res.status(400).json({ error: completionError.message });
    }

    return res.status(200).json({ message: 'Registration successful!', user: signUpData.user });
  } catch (err) {
    console.error('🔥 Unexpected API error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}
