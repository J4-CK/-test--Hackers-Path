import { useRouter } from 'next/router';

export default function LogoutPage() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/login');
    }
  };

  return (
    <div className="section">
      <link rel="stylesheet" href="/styles/login.css" />
      <header>
        <h1><a href="/">Hacker's Path</a></h1>
      </header>
      <div className="section">
        <h2>Logout</h2>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
}
