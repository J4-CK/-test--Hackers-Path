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

    // Set an HTTP-only cookie with the session token
    res.setHeader(
      'Set-Cookie',
      cookie.serialize('token', data.session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Secure in production
        sameSite: 'Strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    );
    

    // Respond with user data
    return res.status(200).json({ user: data.user });
  } catch (err) {
    console.error('API Error:', err); // Log error to Vercel logs
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
