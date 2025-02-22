import { useState } from 'react';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState(''); // FIXED
  const [password, setPassword] = useState(''); // FIXED
  const [error, setError] = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    const email = e.target.email.value; // Not needed if state is used
    const password = e.target.password.value; // Not needed if state is used

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
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
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          id="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // FIXED
          required
        />
        <input
          type="password"
          id="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // FIXED
          required
        />
        <button type="submit">Login</button>
        {error && <p id="error">{error}</p>}
      </form>
    </div>
  );
}
