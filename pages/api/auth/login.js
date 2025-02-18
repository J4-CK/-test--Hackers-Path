import { createClient } from '@supabase/supabase-js';
import cookie from 'cookie';

// Supabase client setup
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  // Allow only POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  try {
    // Authenticate user with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // Handle authentication errors
    if (error) {
      return res.status(401).json({ error: error.message });
    }

    const userId = data.user.id;

    // Fetch user's streak data
    const { data: streakData, error: streakError } = await supabase
      .from('streaktracker')
      .select('streak, last_streak_update')
      .eq('id', userId)
      .single();

    if (streakError && streakError.code !== 'PGRST116') { 
      // PGRST116: No rows found (acceptable if it's a new user)
      console.error('Streak Fetch Error:', streakError);
      return res.status(500).json({ error: 'Error fetching streak data' });
    }

    let newStreak = 1;
    let lastStreakUpdate = new Date().toISOString();

    if (streakData) {
      const lastUpdateTime = new Date(streakData.last_streak_update);
      const timeDiff = (new Date() - lastUpdateTime) / (1000 * 60 * 60); // Convert ms to hours

      if (timeDiff <= 24) {
        newStreak = streakData.streak + 1;
      }
    }

    // Update the streak in the database
    const { error: updateError } = await supabase
      .from('streaktracker')
      .upsert({
        id: userId,
        streak: newStreak,
        last_streak_update: lastStreakUpdate,
      }, { onConflict: ['id'] });

    if (updateError) {
      console.error('Streak Update Error:', updateError);
      return res.status(500).json({ error: 'Error updating streak data' });
    }

    // Set an HTTP-only cookie with the session token
    res.setHeader(
      'Set-Cookie',
      cookie.serialize('token', data.session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Secure in production
        sameSite: 'Strict', // Protect against CSRF
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    );

    // Respond with user data and updated streak
    return res.status(200).json({ 
      user: data.user,
      streak: newStreak
    });

  } catch (err) {
    console.error('API Error:', err); // Log error to Vercel logs
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
