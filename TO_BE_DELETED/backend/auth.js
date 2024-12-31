// Predefined users
const allowedUsers = ["user1", "user2", "user3"];

function login() {
    const username = document.getElementById("username").value;
    const error = document.getElementById("error");

    if (allowedUsers.includes(username)) {
        // Set logged-in status in localStorage
        localStorage.setItem("isLoggedIn", "true");
        // Redirect to the main page
        window.location.href = "index.html";
    } else {
        // Show an error message
        error.textContent = "Invalid username. Please try again.";
    }
}
