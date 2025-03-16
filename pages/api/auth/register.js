import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

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
    const token = authData?.session?.access_token;

    if (!userId || !token) {
      return res.status(400).json({ error: 'Registration failed: missing user ID or token.' });
    }

    // Create a Supabase client authenticated as the user
    const userClient = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );

    // ➕ Insert into profiles
    const { error: profileError } = await userClient.from('profiles').insert([
      { id: userId, username }
    ]);
    if (profileError) {
      await adminSupabase.auth.admin.deleteUser(userId);
      return res.status(400).json({ error: profileError.message });
    }

    // ➕ Insert into accounts
    const accountData = [
      {
        user_id: userId,
        name: username,
        region: 'default',
        completion: [0], // int[]
      }
    ];
    const { error: accountsError } = await userClient.from('accounts').insert(accountData);
    if (accountsError) {
      await adminSupabase.auth.admin.deleteUser(userId);
      return res.status(400).json({ error: accountsError.message });
    }

    // ➕ Insert into leaderboard
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

    // ➕ Insert into completion
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

    return res.status(200).json({ message: 'Registration successful!', user: authData.user });
  } catch (err) {
    console.error('Unexpected API error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}
