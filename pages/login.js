import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [returnUrl, setReturnUrl] = useState('');

  useEffect(() => {
    // Get the return URL from the query parameters if it exists
    const { returnUrl: queryReturnUrl } = router.query;
    if (queryReturnUrl) {
      setReturnUrl(queryReturnUrl);
    }
  }, [router.query]);

  async function handleLogin(e) {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include' // Important for cookies
      });

      const result = await res.json();

      if (res.ok) {
        // If we have a return URL, go there, otherwise go home
        router.push(returnUrl || '/');
      } else {
        setError(result.error || 'Login failed.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  }

  return (
    <div className="section">
      {/* Include External CSS */}
      <link rel="stylesheet" href="/styles/login.css" />
      <header>
        <h1><a href="/">Hacker's Path</a></h1>
      </header>
      <div className="section">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="logout-btn">
            {returnUrl ? 'Login & Return' : 'Login'}
          </button>
          {error && <p id="error">{error}</p>}
        </form>
        <div className="register-link">
          <p>Don't have an account? <a href="/register">Create one here</a></p>
        </div>
      </div>
    </div>
  );
}
