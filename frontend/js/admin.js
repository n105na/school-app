import {BASE_API_URL} from './config.js';
function getCSRFToken() {
    const cookieValue = document.cookie
        .split("; ")
        .find((row) => row.startsWith("csrftoken="))
        ?.split("=")[1];
    return cookieValue || "";
}

async function checkAdminAccess() {
    try {
        const response = await fetch(`${BASE_API_URL}/api/admin-dashboard/`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken(), // Make sure this retrieves the correct token
            },
        });

        if (!response.ok) {
            // Redirect or show an error message if the user is not an admin
            alert('You do not have permission to access this page.');
            window.location.href = 'bulletin.html'; // Redirect to home or login page
        } else {
            const data = await response.json();
            console.log(data.message); // Optionally log welcome message
            // Load admin dashboard content here
        }
    } catch (error) {
        console.error('Error checking admin access:', error);
        alert('Failed to check admin access.');
    }
}







// Fetch all users and display them in a table
async function fetchUsers() {
    try {
        const response = await fetch(`${BASE_API_URL}/api/user/list/`, {
            method: 'GET',
            credentials: 'include',
        });
        const users = await response.json();

        const userTable = document.getElementById('userTable');
        userTable.innerHTML = '';

        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>
                    <button onclick="editUser('${user.id}')">Edit</button>
                    <button onclick="deleteUser('${user.id}')">Delete</button>
                </td>
            `;
            userTable.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

async function deleteUser(userId) {
    try {
        const response = await fetch(`${BASE_API_URL}/api/user/${userId}/delete/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken(), // Make sure this retrieves the correct token
            },
            credentials: 'include',
        });

        if (response.status === 403) {
            throw new Error(`Forbidden: You do not have permission to delete this user.`);
        }

        if (!response.ok) {
            throw new Error(`Failed to delete user: ${response.statusText}`);
        }

        alert('User deleted successfully!');
        fetchUsers(); // Refresh the user list
    } catch (error) {
        console.error('Error deleting user:', error);
        alert(error.message); // Show the error message
    }
}



async function editUser(userId) {
    // Fetch the current user details
    try {
        const response = await fetch(`${BASE_API_URL}/api/user/${userId}/`, {
            method: 'GET',
            credentials: 'include',
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch user: ${response.status}`);
        }

        const user = await response.json();
        
        // Populate a form (you need to create this form in your HTML)
        document.getElementById('editEmail').value = user.email; // Set the email field
        document.getElementById('editRole').value = user.role; // Set the role field
        document.getElementById('editUserId').value = user.id; // Store the user ID for submission

        // Display the edit modal or form
        document.getElementById('editUserModal').style.display = 'block'; // Assuming you have a modal

    } catch (error) {
        console.error('Error fetching user for edit:', error);
        alert(`Failed to fetch user: ${error.message}`);
    }
}

// Function to handle the submission of the edit form
async function submitEditForm() {
    const userId = document.getElementById('editUserId').value;
    const email = document.getElementById('editEmail').value;
    const role = document.getElementById('editRole').value;

    console.log(`Updating user ${userId} with email: ${email} and role: ${role}`);

    try {
        const response = await fetch('${BASE_API_URL}/api/user/${userId}/update/', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken(),
            },
            credentials: 'include',
            body: JSON.stringify({ email, role }),
        });

        if (!response.ok) {
            throw new Error(`Failed to update user: ${response.status}`);
        }

        alert('User updated successfully!');
        fetchUsers(); // Refresh the user list
        document.getElementById('editUserModal').style.display = 'none';

    } catch (error) {
        console.error('Error updating user:', error);
        alert(`Failed to update user: ${error.message}`);
    }
}


// Example usage: Attach the submitEditForm function to a form submission
document.getElementById('editUserForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission
    submitEditForm(); // Call the function to submit the edit
});

document.getElementById('registerUserBtn').addEventListener('click', () => {
    window.location.href = 'register_user.html';
});
function showMessage(message, isError = false) {
    const messageArea = document.getElementById('messageArea');
    messageArea.innerText = message;
    messageArea.style.color = isError ? 'red' : 'green';
}

// Initial fetch of users
fetchUsers();
async function logout() {
    try {
        const response = await fetch(`${BASE_API_URL}/api/user/logout/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken(), // Make sure this retrieves the correct token
            },
            credentials: 'include',  // Include credentials for session
        });

        if (!response.ok) {
            throw new Error(`Logout failed: ${response.status}`);
        }

        alert('Logged out successfully!');  // Notify the user
        window.location.href = 'login.html';  // Redirect to login page or homepage
    } catch (error) {
        console.error('Error logging out:', error);
        showMessage(`Failed to log out: ${error.message}`, true);
    }
}

// Attach logout function to the button
document.getElementById('logoutBtn').addEventListener('click', logout);
