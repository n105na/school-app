// Function to log in a user
function loginUser(email, password) {
    fetch("http://127.0.0.1:8000/api/user/login/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFToken(), // Include the CSRF token
        },
        credentials: "include", // Include cookies in the request
        body: JSON.stringify({
            email: email, // Use the email parameter
            password: password, // Use the password parameter
        }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Invalid credentials or server error");
            }
            return response.json();
        })
        .then((data) => {
            console.log("Login successful:", data);

            // Check user role
            if (data.role === "Admin") {
                // Redirect to admin.html if the role is Admin
                window.location.href = "/admin.html";
            } else if (data.role === "User") {
                
                window.location.href = "/bulletin.html";
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            alert("Login failed: " + error.message); // Notify the user
        });
}

// Function to get the CSRF token from cookies
function getCSRFToken() {
    const cookieValue = document.cookie
        .split("; ")
        .find((row) => row.startsWith("csrftoken="))
        ?.split("=")[1];
    return cookieValue || "";
}

// Example usage of loginUser function (can be triggered by a form submission)
document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission
    const email = document.getElementById("email").value; // Get email from input
    const password = document.getElementById("password").value; // Get password from input
    loginUser(email, password); // Call the loginUser function
});
