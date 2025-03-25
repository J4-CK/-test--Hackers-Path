import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function QuizPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      setLoading(true);
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Error fetching session:", error.message);
      }

      setUser(session?.user ?? null);
      setLoading(false);
    };

    checkUser();

    // Listen for authentication changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      authListener.subscription?.unsubscribe();
    };
  }, []);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
    if (error) {
      console.error("Login Error:", error.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {!user ? (
        <>
          <p>Please log in to take the quiz.</p>
          <button onClick={handleLogin}>Log In</button>
        </>
      ) : (
        <>
          <p>Welcome, {user.email}! You can now take the quiz.</p>
          <button onClick={handleLogout}>Log Out</button>
          {/* Your quiz component can be placed here */}
        </>
      )}
    </div>
  );
}

