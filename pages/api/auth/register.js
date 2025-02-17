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

  // Input Validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      error: 'Password must be at least 8 characters long, include one letter, one number, and one special character.',
    });
  }

  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  if (!usernameRegex.test(username)) {
    return res.status(400).json({
      error: 'Username must be 3-20 characters long and contain only letters, numbers, or underscores.',
    });
  }

  try {
    // Step 1: Create a new user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    // Step 2: Retrieve authenticated session to ensure auth.uid() is available
    const { data: session, error: sessionError } = await supabase.auth.getSession();

    if (!session || !session.user) {
      await adminSupabase.auth.admin.deleteUser(authData.user.id);
      return res.status(401).json({ error: 'User authentication failed. Please try again.' });
    }

    const userId = session.user.id;
    console.log("Authenticated User ID:", userId);

    // Step 3: Insert into profiles table (Ensures id matches auth.uid())
    const { error: profileError } = await supabase.from('profiles').insert([
      { id: userId, username },
    ]);

    if (profileError) {
      console.error("Profile Insert Error:", profileError);
      await adminSupabase.auth.admin.deleteUser(userId);
      return res.status(400).json({ error: profileError.message });
    }

    // Step 4: Insert default values into accounts table
    const { error: accountsError } = await supabase.from('accounts').insert([
      { user_id: userId, name: username, region: 'default', completion: 0 },
    ]);

    if (accountsError) {
      console.error("Accounts Insert Error:", accountsError);
      await adminSupabase.auth.admin.deleteUser(userId);
      return res.status(400).json({ error: accountsError.message });
    }

    // Step 5: Insert default values into leaderboard table
    const { error: leaderboardError } = await supabase.from('leaderboard').insert([
      { user_id: userId, region: 'default', monthly_points: 0, streak: 0, total_points: 0 },
    ]);

    if (leaderboardError) {
      console.error("Leaderboard Insert Error:", leaderboardError);
      await adminSupabase.auth.admin.deleteUser(userId);
      return res.status(400).json({ error: leaderboardError.message });
    }

    // Step 6: Insert default values into completion table
    const { error: completionError } = await supabase.from('completion').insert([
      { user_id: userId, lesson_id: 0, complete: 0, total_score: 0 },
    ]);

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
