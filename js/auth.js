// auth.js

// Predefined users and passwords
const allowedUsers = {
    user1: "password1",
    user2: "password2",
    user3: "password3"
};

function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const error = document.getElementById("error");

    if (allowedUsers[username] && allowedUsers[username] === password) {
        // Set logged-in status in localStorage
        localStorage.setItem("isLoggedIn", "true");
        // Redirect to the homepage or index.html
        window.location.href = "index.html";
    } else {
        // Show an error message
        error.textContent = "Invalid username or password. Please try again.";
    }
}

function logout() {
    // Clear the login status
    localStorage.removeItem("isLoggedIn");
    // Redirect to the login page
    window.location.href = "login.html";
}
