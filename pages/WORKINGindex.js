import { useEffect, useState } from 'react';

export default function HomePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch('/api/auth/session');
      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    }

    fetchUser();
  }, []);

  return (
    <div>
      <nav>
        {user ? (
          <p>Welcome, {user.email}</p>
        ) : (
          <p><a href="/login">Login</a></p>
        )}
      </nav>
      <h1>Welcome to Hacker's Path</h1>
    </div>
  );
}
