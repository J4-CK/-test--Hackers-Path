import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function checkSession() {
      const res = await fetch('/api/auth/session');
      const data = await res.json();

      if (res.ok) {
        setUser(data.user); // Set user data
      } else {
        router.push('/login'); // Redirect if not authenticated
      }
    }
    checkSession();
  }, [router]);

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login'); // Redirect to login after logout
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Welcome - Hacker's Path</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <h1>Welcome to Hacker's Path</h1>
        <p>Logged in as: {user?.email}</p>
        <button onClick={handleLogout}>Logout</button>
        <p>Lessons and quizzes will appear here!</p>
      </body>
    </html>
  );
}
