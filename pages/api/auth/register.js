import { createClient } from '@supabase/supabase-js';

// Supabase client setup
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
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
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    // Insert into profiles table
    const { error: profileError } = await supabase.from('profiles').insert([
      { id: authData.user.id, username },
    ]);

    if (profileError) {
      await supabase.auth.api.deleteUser(authData.user.id);
      return res.status(400).json({ error: profileError.message });
    }

    // Insert default values into accounts table
    const { error: accountsError } = await supabase.from('accounts').insert([
      { user_id: authData.user.id, name: username, region: 'default', completion: 0 },
    ]);

    if (accountsError) {
      await supabase.auth.api.deleteUser(authData.user.id);
      return res.status(400).json({ error: accountsError.message });
    }

    // Insert default values into leaderboard table
    const { error: leaderboardError } = await supabase.from('leaderboard').insert([
      { user_id: authData.user.id, region: 'default', monthly_points: 0, streak: 0, total_points: 0 },
    ]);

    if (leaderboardError) {
      await supabase.auth.api.deleteUser(authData.user.id);
      return res.status(400).json({ error: leaderboardError.message });
    }

    // Insert default values into completion table
    const { error: completionError } = await supabase.from('completion').insert([
      { user_id: authData.user.id, lesson_id: 0, complete: 0, total_score: 0 },
    ]);

    if (completionError) {
      await supabase.auth.api.deleteUser(authData.user.id);
      return res.status(400).json({ error: completionError.message });
    }

    return res.status(200).json({ message: 'Registration successful!', user: authData.user });
  } catch (err) {
    console.error('API Error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
