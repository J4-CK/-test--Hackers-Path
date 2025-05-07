import { createClient } from '@supabase/supabase-js';
import cookie from 'cookie';
import rateLimit from 'express-rate-limit';

// Supabase client setup
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: 'Too many login attempts, please try again later.'
});

export default async function handler(req, res) {
  // Set security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'");

  // Allow only POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Apply rate limiting
  try {
    await limiter(req, res);
  } catch (error) {
    return res.status(429).json({ error: 'Too many login attempts, please try again later.' });
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
      return res.status(401).json({ error: 'Invalid credentials' }); // Generic error message for security
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

    // Respond with user data
    return res.status(200).json({ user: data.user });
  } catch (err) {
    console.error('API Error:', err); // Log error to Vercel logs
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
