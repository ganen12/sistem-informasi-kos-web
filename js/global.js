// Logout Confirmation (Universal)
document.addEventListener('DOMContentLoaded', function() {
    const logoutButton = document.getElementById('confirmLogout');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            window.location.href = 'login.html';
        });
    }
});