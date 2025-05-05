import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';
import QuizHistory from '../components/QuizHistory';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      const { data: userData, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.error('Error fetching user data:', error);
        return;
      }

      setUser(userData);
      setLoading(false);
    };

    checkUser();
  }, [router]);

  if (loading) return <div className="loading">Loading profile...</div>;
  if (!user) return <div className="error">Error loading profile</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Profile</h1>
      </div>

      <div className="profile-content">
        <div className="profile-details">
          <div className="detail-item">
            <span className="label">Email:</span>
            <span className="value">{user.email}</span>
          </div>
          <div className="detail-item">
            <span className="label">Total Points:</span>
            <span className="value">{user.total_points || 0}</span>
          </div>
          <div className="detail-item">
            <span className="label">Monthly Points:</span>
            <span className="value">{user.monthly_points || 0}</span>
          </div>
        </div>

        <QuizHistory userId={user.id} />
      </div>

      <style jsx>{`
        .profile-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .profile-header {
          margin-bottom: 30px;
        }

        .profile-header h1 {
          color: #8c30c2;
          margin: 0;
          font-size: 2em;
        }

        .profile-content {
          display: grid;
          gap: 30px;
        }

        .profile-details {
          background: rgba(255, 255, 255, 0.1);
          padding: 20px;
          border-radius: 8px;
          display: grid;
          gap: 15px;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .detail-item:last-child {
          border-bottom: none;
        }

        .label {
          color: #b0b0b0;
          font-size: 1.1em;
        }

        .value {
          color: #e0e0e0;
          font-size: 1.1em;
          font-weight: bold;
        }

        .loading, .error {
          text-align: center;
          padding: 20px;
          color: #b0b0b0;
        }

        .error {
          color: #ff4444;
        }
      `}</style>
    </div>
  );
}
