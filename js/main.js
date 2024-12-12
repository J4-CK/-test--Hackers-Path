// Check if the user is logged in
if (!localStorage.getItem("isLoggedIn")) {
    // Redirect to login page if not logged in
    window.location.href = "login.html";
}
