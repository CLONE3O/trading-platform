document.addEventListener('DOMContentLoaded', () => {
    const userTableBody = document.querySelector('#userTable tbody');
    const transactionTableBody = document.querySelector('#transactionTable tbody');
    const logoutBtn = document.getElementById('logoutBtn');

    async function fetchUsers() {
        try {
            const response = await fetch('/api/admin/users');
            if (response.ok) {
                const users = await response.json();
                renderUsers(users);
            } else if (response.status === 401 || response.status === 403) {
                window.location.href = '/login'; // Redirect if not authorized
            } else {
                console.error('Failed to fetch users:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }

    function renderUsers(users) {
        userTableBody.innerHTML = ''; // Clear existing rows
        users.forEach(user => {
            const row = userTableBody.insertRow();
            row.insertCell().textContent = user.id;
            row.insertCell().textContent = user.username;
            row.insertCell().textContent = parseFloat(user.balance).toFixed(2);
            row.insertCell().textContent = user.role;
            const activeCell = row.insertCell();
            activeCell.textContent = user.is_active ? 'Yes' : 'No';

            const actionsCell = row.insertCell();
            const toggleButton = document.createElement('button');
            toggleButton.textContent = user.is_active ? 'Deactivate' : 'Activate';
            toggleButton.className = user.is_active ? 'inactive-btn' : 'active-btn';
            toggleButton.addEventListener('click', () => toggleUserActive(user.id));
            actionsCell.appendChild(toggleButton);
        });
    }

    async function toggleUserActive(userId) {
        try {
            const response = await fetch(`/api/admin/toggle_user_active/${userId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            if (response.ok) {
                await fetchUsers(); // Refresh the user list
            } else {
                const data = await response.json();
                alert('Failed to toggle user status: ' + (data.message || response.statusText));
            }
        } catch (error) {
            console.error('Error toggling user status:', error);
            alert('An error occurred while changing user status.');
        }
    }

    async function fetchTransactions() {
        try {
            const response = await fetch('/api/admin/transactions');
            if (response.ok) {
                const transactions = await response.json();
                renderTransactions(transactions);
            } else if (response.status === 401 || response.status === 403) {
                window.location.href = '/login'; // Redirect if not authorized
            } else {
                console.error('Failed to fetch transactions:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    }

    function renderTransactions(transactions) {
        transactionTableBody.innerHTML = '';
        transactions.forEach(tx => {
            const row = transactionTableBody.insertRow();
            row.insertCell().textContent = tx.id;
            row.insertCell().textContent = tx.username;
            row.insertCell().textContent = tx.type;
            row.insertCell().textContent = parseFloat(tx.amount).toFixed(2);
            row.insertCell().textContent = new Date(tx.timestamp).toLocaleString();
        });
    }

    // Initial data load for admin dashboard
    fetchUsers();
    fetchTransactions();

    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await fetch('/logout');
                window.location.href = '/login';
            } catch (error) {
                console.error('Logout error:', error);
            }
        });
    }
});