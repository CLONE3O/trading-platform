document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    const messageDisplay = document.getElementById('message');

    if (signupForm) {
        signupForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent default form submission (page reload)

            // Get values from input fields
            const username = document.getElementById('username').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm_password').value;

            // --- Client-side Validation ---
            if (!username || !email || !password || !confirmPassword) {
                messageDisplay.className = 'message error-message';
                messageDisplay.textContent = 'All fields are required.';
                return;
            }

            if (password.length < 6) { // Example: minimum password length
                messageDisplay.className = 'message error-message';
                messageDisplay.textContent = 'Password must be at least 6 characters long.';
                return;
            }

            if (password !== confirmPassword) {
                messageDisplay.className = 'message error-message';
                messageDisplay.textContent = 'Passwords do not match.';
                return;
            }

            // Clear previous messages
            messageDisplay.textContent = '';
            messageDisplay.className = '';

            // Prepare data for the backend
            const formData = {
                username: username,
                email: email,
                password: password
            };

            try {
                // Send data to the Flask backend's /signup API endpoint
                const response = await fetch('/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json', // We're sending JSON now
                    },
                    body: JSON.stringify(formData) // Convert JS object to JSON string
                });

                const data = await response.json(); // Parse the JSON response from the server

                if (response.ok && data.success) {
                    messageDisplay.className = 'message success-message';
                    messageDisplay.textContent = data.message || 'Account created successfully! Redirecting to login...';
                    // Redirect to login page after a short delay
                    setTimeout(() => {
                        window.location.href = '/login'; // Or to '/' which often redirects to login
                    }, 2000); // Redirect after 2 seconds
                } else {
                    messageDisplay.className = 'message error-message';
                    messageDisplay.textContent = data.message || 'An error occurred during sign up.';
                }
            } catch (error) {
                console.error('Sign up error:', error);
                messageDisplay.className = 'message error-message';
                messageDisplay.textContent = 'Network error or server unreachable. Please try again later.';
            }
        });
    }
});