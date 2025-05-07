import { createClient } from '@supabase/supabase-js';
import cookie from 'cookie';

// Supabase client setup
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// In-memory store for rate limiting
const loginAttempts = new Map();

// Rate limiting middleware
function rateLimit(ip) {
  const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
  const MAX_ATTEMPTS = 5;
  
  const now = Date.now();
  const windowStart = now - WINDOW_MS;
  
  // Get attempts for this IP
  const attempts = loginAttempts.get(ip) || [];
  
  // Remove old attempts
  const recentAttempts = attempts.filter(timestamp => timestamp > windowStart);
  
  if (recentAttempts.length >= MAX_ATTEMPTS) {
    return false;
  }
  
  // Add new attempt
  recentAttempts.push(now);
  loginAttempts.set(ip, recentAttempts);
  
  // Clean up old entries periodically
  if (Math.random() < 0.1) { // 10% chance to clean up
    for (const [key, value] of loginAttempts.entries()) {
      if (value.every(timestamp => timestamp < windowStart)) {
        loginAttempts.delete(key);
      }
    }
  }
  
  return true;
}

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

  // Get client IP
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  // Apply rate limiting
  if (!rateLimit(ip)) {
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
