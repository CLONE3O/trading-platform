document.addEventListener('DOMContentLoaded', () => {
    const usernameDisplay = document.getElementById('usernameDisplay');
    const currentBalanceSpan = document.getElementById('currentBalance');
    const depositAmountInput = document.getElementById('depositAmount');
    const depositBtn = document.getElementById('depositBtn');
    const depositMessage = document.getElementById('depositMessage');
    const withdrawAmountInput = document.getElementById('withdrawAmount');
    const withdrawBtn = document.getElementById('withdrawBtn');
    const withdrawMessage = document.getElementById('withdrawMessage');
    const logoutBtn = document.getElementById('logoutBtn');
    const btcPriceSpan = document.getElementById('btcPrice');
    const ethPriceSpan = document.getElementById('ethPrice');
    const refreshMarketBtn = document.getElementById('refreshMarket');


    async function fetchUserData() {
        try {
            const response = await fetch('/api/user_data');
            if (response.ok) {
                const data = await response.json();
                usernameDisplay.textContent = data.username;
                currentBalanceSpan.textContent = parseFloat(data.balance).toFixed(2);
            } else if (response.status === 401 || response.status === 403) {
                window.location.href = '/login'; // Redirect to login if unauthorized
            } else {
                console.error('Failed to fetch user data:', response.statusText);
                currentBalanceSpan.textContent = 'Error';
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            currentBalanceSpan.textContent = '0.00';
        }
    }

    async function handleTransaction(endpoint, amountInput, messageDisplay) {
        const amount = parseFloat(amountInput.value);
        if (isNaN(amount) || amount <= 0) {
            messageDisplay.className = 'message error-message';
            messageDisplay.textContent = 'Please enter a valid positive amount.';
            return;
        }

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount: amount })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                messageDisplay.className = 'message success-message';
                messageDisplay.textContent = data.message;
                amountInput.value = ''; // Clear input
                await fetchUserData(); // Refresh balance
            } else {
                messageDisplay.className = 'message error-message';
                messageDisplay.textContent = data.message || 'An error occurred.';
            }
        } catch (error) {
            console.error(`Error ${endpoint}ing:`, error);
            messageDisplay.className = 'message error-message';
            messageDisplay.textContent = `An error occurred during transaction. Please try again.`;
        }
    }

    // Initial load
    fetchUserData();
    updateMarketData();

    // Event Listeners
    if (depositBtn) {
        depositBtn.addEventListener('click', () => handleTransaction('/api/deposit', depositAmountInput, depositMessage));
    }

    if (withdrawBtn) {
        withdrawBtn.addEventListener('click', () => handleTransaction('/api/withdraw', withdrawAmountInput, withdrawMessage));
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                // In a real app, you might send a request to the server to invalidate the session
                await fetch('/logout'); // Call Flask logout route
                window.location.href = '/login'; // Redirect to login page
            } catch (error) {
                console.error('Logout error:', error);
            }
        });
    }

    function updateMarketData() {
        // Simulate random price changes for demonstration
        // In a real app, you'd fetch this from a real-time market data API
        btcPriceSpan.textContent = `$${(30000 + Math.random() * 5000 - 2500).toFixed(2)}`;
        ethPriceSpan.textContent = `$${(2000 + Math.random() * 500 - 250).toFixed(2)}`;
        ethPriceSpan.textContent = `$${(2000 + Math.random() * 500 - 250).toFixed(2)}`;
        ethPriceSpan.textContent = `$${(2000 + Math.random() * 500 - 250).toFixed(2)}`;
        adapricespan.textContent = `$${(2000 + Math.random() * 500 - 250).toFixed(2)}`;
    }

    if (refreshMarketBtn) {
        refreshMarketBtn.addEventListener('click', updateMarketData);
    }
});