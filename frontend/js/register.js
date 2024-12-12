const apiUrl = "https://school-app-8.onrender.com/"
function getCSRFToken() {
    const cookieValue = document.cookie
        .split("; ")
        .find((row) => row.startsWith("csrftoken="))
        ?.split("=")[1];
    return cookieValue || "";
}
async function checkRegisterAccess() {
    try {
        const response = await fetch(apiUrl + 'api/register-student/', {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            // Redirect or show an error message if the user is not an admin
            alert('You do not have permission to access this page.');
            window.location.href = 'index.html'; // Redirect to home or login page
        } else {
            const data = await response.json();
            console.log(data.message); // Optionally log welcome message
            // Load registration form here or enable registration functionality
        }
    } catch (error) {
        console.error('Error checking register access:', error);
        alert('Failed to check register access.');
    }
}

// Call this function when the register page is loaded



document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    try {
        const response = await fetch(apiUrl + 'api/user/register-student/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken(),
            },
            body: JSON.stringify({ email, password, role }),
            credentials: 'include',
        });

        const data = await response.json();

        if (response.ok) {
            alert('User registered successfully!');
            window.location.href = 'admin.html';
        } else {
            alert(data.error || 'Failed to register user.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
