import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import crypto from 'crypto';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [nonce, setNonce] = useState('');
  const [timestamp, setTimestamp] = useState('');

  // Generate nonce and timestamp on component mount
  useEffect(() => {
    setNonce(crypto.randomBytes(16).toString('hex'));
    setTimestamp(Date.now().toString());
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-CSRF-Token': nonce,
          'X-Request-Timestamp': timestamp,
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({ 
          email, 
          password,
          nonce,
          timestamp 
        }),
        credentials: 'include'
      });

      const result = await res.json();

      if (res.ok) {
        router.push('/');
      } else {
        setError(result.error || 'Login failed.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  }

  return (
    <div className="section">
      <link rel="stylesheet" href="/styles/login.css" />
      <header>
        <h1><a href="/">Hacker's Path</a></h1>
      </header>
      <div className="section">
        <h2>Login</h2>
        <form onSubmit={handleLogin} autoComplete="off">
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="off"
          />
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
          <input type="hidden" name="nonce" value={nonce} />
          <input type="hidden" name="timestamp" value={timestamp} />
          <button type="submit">Login</button>
          {error && <p id="error">{error}</p>}
        </form>
        <div className="register-link">
          <p>Don't have an account? <a href="/register">Create one here!</a></p>
        </div>
      </div>
    </div>
  );
}
