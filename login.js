document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const messageDisplay = document.getElementById('message');

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent default form submission

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    messageDisplay.className = 'message success-message';
                    messageDisplay.textContent = 'Login successful! Redirecting...';
                    window.location.href = data.redirect; // Redirect to dashboard or admin
                } else {
                    messageDisplay.className = 'message error-message';
                    messageDisplay.textContent = data.message || 'Login failed.';
                }
            } catch (error) {
                console.error('Login error:', error);
                messageDisplay.className = 'message error-message';
                messageDisplay.textContent = 'An error occurred during login. Please try again.';
            }
        });
    }
});