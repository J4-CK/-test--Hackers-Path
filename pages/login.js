import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Loading from '../components/Loading';
import Head from 'next/head';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [returnUrl, setReturnUrl] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get the return URL from the query parameters if it exists
    const { returnUrl: queryReturnUrl } = router.query;
    if (queryReturnUrl) {
      setReturnUrl(queryReturnUrl);
    }
  }, [router.query]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push('/');
      } else {
        const data = await res.json();
        setError(data.error || 'Login failed');
        setLoading(false);
      }
    } catch (err) {
      setError('An error occurred');
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div>
        <link rel="stylesheet" href="/styles/homepagestyle.css" />
        <Loading />
      </div>
    );
  }

  return (
    <div className="container">
      <Head>
        <title>Login - Hacker's Path</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" href="/images/favicon.png" />
      </Head>
      
      <div className="section">
        {/* Include External CSS */}
        <link rel="stylesheet" href="/styles/login.css"/>
        
        <h1>Login to Hacker's Path</h1>
        
        <div className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit" className="logout-btn">
                {loading ? <Loading size="small" /> : 'Login'}
              </button>
            </div>
          </form>
          
          <div className="register-link">
            <p>Don't have an account? <a href="/register">Create one here</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
