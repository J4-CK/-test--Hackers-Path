import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function checkSession() {
      const res = await fetch('/api/auth/session');
      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
      } else {
        router.push('/login');
      }
    }
    checkSession();
  }, [router]);

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  return (
    <>
      <Head>
        <link rel="stylesheet" href="/styles/global.css" />
      </Head>
      <header>
        <h1>Hacker's Path</h1>
      </header>
      <div className="container">
        <h2>Welcome, {user?.email || 'Guest'}!</h2>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </>
  );
}
