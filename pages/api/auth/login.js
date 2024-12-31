const { createClient } = require('@supabase/supabase-js');
const cookie = require('cookie');

// Supabase setup
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    res.setHeader(
      'Set-Cookie',
      cookie.serialize('token', data.session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      })
    );

    return res.status(200).json({ user: data.user });
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
