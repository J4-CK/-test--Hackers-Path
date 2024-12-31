// auth.js

// Initialize Supabase Client
const SUPABASE_URL = "https://hkjamfwhgbeqshaubnmr.supabase.co"; 
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhramFtZndoZ2JlcXNoYXVibm1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1OTM5MjQsImV4cCI6MjA1MDE2OTkyNH0.IKVfhgr0tCm7EzG6-L3Rai0gczCxRLQ5ll8uUMo6Jc4"; 
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Function to log in
async function login() {
    const email = document.getElementById("username").value; // Using email for login
    const password = document.getElementById("password").value;
    const error = document.getElementById("error");

    try {
        const { data, error: loginError } = await supabase.auth.signInWithPassword({ email, password });

        if (loginError) {
            throw loginError;
        }

        // Save session details in localStorage
        localStorage.setItem("supabaseSession", JSON.stringify(data));
        // Redirect to the homepage or account page
        window.location.href = "index.html";
    } catch (err) {
        console.error("Login Error:", err);
        error.textContent = "Invalid username or password. Please try again.";
    }
}

// Function to log out
async function logout() {
    try {
        await supabase.auth.signOut();
        localStorage.removeItem("supabaseSession");
        window.location.href = "login.html";
    } catch (err) {
        console.error("Logout Error:", err);
    }
}

// Function to check session
async function checkSession() {
    const session = supabase.auth.getSession();

    if (!session || !session.session) {
        // Redirect to login if no session exists
        window.location.href = "login.html";
    } else {
        // User is logged in; populate user details if needed
        const user = session.session.user;
        const navbarUser = document.getElementById("navbar-user");
        if (navbarUser) {
            navbarUser.textContent = `Logged in as: ${user.email}`;
        }
    }
}
