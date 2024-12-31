import { useState } from 'react';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  async function handleLogin(e) {
    e.preventDefault();

    // Get form values
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();

      if (res.ok) {
        router.push('/'); // Redirect to homepage on success
      } else {
        setError(result.error || 'Login failed.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Login - Hacker's Path</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <h1>Hacker's Path</h1>
        <div className="container">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <input type="email" id="email" placeholder="Enter your email" required />
            <input type="password" id="password" placeholder="Enter your password" required />
            <button type="submit">Login</button>
            {error && <p id="error">{error}</p>}
          </form>
        </div>
      </body>
    </html>
  );
}
