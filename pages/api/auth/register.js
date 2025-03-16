import { createServerClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ error: 'Email, username, and password are required.' });
  }

  const supabase = createServerClient({ req, res });

  try {
    // Step 1: Sign up user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password
    });

    if (signUpError) {
      return res.status(400).json({ error: signUpError.message });
    }

    const userId = signUpData?.user?.id;
    if (!userId) {
      return res.status(400).json({ error: 'No user ID returned after signup.' });
    }

    // Step 2: Sign in to get session
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (signInError || !signInData?.session?.access_token) {
      return res.status(401).json({ error: 'Sign-in after signup failed.' });
    }

    // Step 3: Supabase will now have cookie session set — all future calls are authenticated

    // Step 4: Insert into profiles
    const { error: profileError } = await supabase.from('profiles').insert([
      { id: userId, username }
    ]);
    if (profileError) {
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
    const { error: accountsError } = await supabase.from('accounts').insert(accountData);
    if (accountsError) {
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
    const { error: leaderboardError } = await supabase.from('leaderboard').insert(leaderboardData);
    if (leaderboardError) {
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
    const { error: completionError } = await supabase.from('completion').insert(completionData);
    if (completionError) {
      return res.status(400).json({ error: completionError.message });
    }

    return res.status(200).json({ message: 'Registration successful!', user: signUpData.user });
  } catch (err) {
    console.error('🔥 Unexpected API error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}
