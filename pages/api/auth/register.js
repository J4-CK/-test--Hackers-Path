import { createClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

// Base anon and admin clients
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
    // Step 1: Sign up the user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      return res.status(400).json({ error: signUpError.message });
    }

    const userId = signUpData?.user?.id;
    if (!userId) {
      return res.status(400).json({ error: 'User registration failed. No user ID returned.' });
    }

    // Step 2: Sign in to get a valid session/access_token
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      await adminSupabase.auth.admin.deleteUser(userId);
      return res.status(401).json({ error: 'Sign-in after signup failed: ' + signInError.message });
    }

    const token = signInData?.session?.access_token;
    if (!token) {
      await adminSupabase.auth.admin.deleteUser(userId);
      return res.status(400).json({ error: 'Failed to obtain session token after sign-in.' });
    }

    // Step 3: Create Supabase client using the token (so auth.uid() works)
    const userClient = createBrowserClient(
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
        completion: [0],
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
    console.error('Unexpected API error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}
