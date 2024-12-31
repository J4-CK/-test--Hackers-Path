async function login() {
    const email = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const error = document.getElementById("error");

    if (!email || !password) {
        error.textContent = "Email and password cannot be empty.";
        return;
    }

    try {
        // Make POST request to the secure Vercel API route
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const result = await response.json();

        if (response.ok) {
            alert('Login successful!');
            window.location.href = "index.html"; // Redirect after login
        } else {
            throw new Error(result.error || "Login failed.");
        }
    } catch (err) {
        console.error("Error:", err);
        error.textContent = err.message || "Invalid email or password.";
    }
}
