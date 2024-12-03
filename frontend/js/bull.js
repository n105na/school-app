console.error("Script loaded successfully.");
function getCSRFToken() {
    const cookieValue = document.cookie
        .split("; ")
        .find((row) => row.startsWith("csrftoken="))
        ?.split("=")[1];
    console.log("CSRF Token:", cookieValue);
    return cookieValue || "";
}

document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logoutBtn');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
        console.log('Logout button event listener attached');
    } else {
        console.error('Logout button not found');
    }
});


async function searchStudent() {
    const token = getCSRFToken();
    console.log("CSRF Token before request:", token);
    const numero = document.getElementById('numero').value;

    try {
        const response = await fetch(`http://127.0.0.1:8000/api/notes/student/bull/${numero}/`,{
        method: "GET",
        headers: {
            "X-CSRFToken": token, // Include CSRF token
            "Content-Type": "application/json",
        },
        credentials: "include", // Ensure cookies are sent with the request
        });
        console.log("Response status:", response.status);
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const studentData = await response.json();
        console.log(studentData);

        // Populate the main table with student data
        populateStudentData(studentData);
        
        // Populate the bulletin content for printing
        populateBulletinContent(studentData); // This will prepare the print content
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

function populateStudentData(studentData) {
    const civiliteInput = document.querySelector(`input[name="civilite"][value="${studentData.civilite}"]`);
    if (civiliteInput) civiliteInput.checked = true;

    document.getElementById('nom_prenom').value = studentData.nom_prenom;
    document.getElementById('filiere').value = studentData.filiere;
    
    displayPicture(studentData.student_image);
    displayGrades(studentData.notes);
}

function displayGrades(notes) {
    const gradesTableBody = document.querySelector('#gradesTable tbody');
    gradesTableBody.innerHTML = ''; // Clear existing rows

    let totalCoefficient = 0;
    let totalWeightedNote = 0;

    notes.forEach(note => {
        const row = document.createElement('tr');
        const coefficient = note.module.coefficient;
        const weightedNote = coefficient * note.note;

        row.innerHTML = `
            <td>${note.module.designation_module}</td>
            <td>${note.module.code_module}</td>
            <td>${coefficient}</td>
            <td>${note.note}</td>
        `;
        gradesTableBody.appendChild(row);

        totalCoefficient += coefficient;
        totalWeightedNote += weightedNote;
    });

    const moyenne = totalWeightedNote / totalCoefficient || 0;

    document.getElementById('totalCoefficient').innerText = totalCoefficient;
    document.getElementById('totalWeightedNote').innerText = totalWeightedNote;
    document.getElementById('moyenne').innerText = moyenne.toFixed(2);
}

function displayPicture(pictureUrl) {
    const pictureContainer = document.getElementById('studentPicture');
    pictureContainer.innerHTML = '';

    const img = document.createElement('img');
    img.src = pictureUrl ? `http://127.0.0.1:8000${pictureUrl}` : '/media/default-image.jpg';
    img.alt = 'Student Picture';
    img.style.width = '100px';
    img.style.height = '100px';
    img.style.borderRadius = '50%';
    img.style.objectFit = 'cover';

    pictureContainer.appendChild(img);
}

function populateBulletinContent(studentData) {
    document.getElementById('printNomPrenom').innerText = studentData.nom_prenom;
    document.getElementById('printFiliere').innerText = studentData.filiere;

    // Set the picture for printing
    const printImage = document.getElementById('printStudentImage');
    printImage.src = studentData.student_image ? `http://127.0.0.1:8000${studentData.student_image}` : '/media/default-image.jpg';
    printImage.alt = 'Student Picture';

    // Populate grades table for printing
    const printGradesTableBody = document.querySelector('#printGradesTable tbody');
    printGradesTableBody.innerHTML = '';

    let printTotalCoefficient = 0;
    let printTotalWeightedNote = 0;

    studentData.notes.forEach(note => {
        const row = document.createElement('tr');
        const coefficient = note.module.coefficient;
        const weightedNote = coefficient * note.note;

        row.innerHTML = `
            <td>${note.module.designation_module}</td>
            <td>${note.module.code_module}</td>
            <td>${coefficient}</td>
            <td>${note.note}</td>
        `;
        printGradesTableBody.appendChild(row);

        printTotalCoefficient += coefficient;
        printTotalWeightedNote += weightedNote;
    });

    const printMoyenne = printTotalWeightedNote / printTotalCoefficient || 0;

    document.getElementById('printTotalCoefficient').innerText = printTotalCoefficient;
    document.getElementById('printTotalWeightedNote').innerText = printTotalWeightedNote;
    document.getElementById('printMoyenne').innerText = printMoyenne.toFixed(2);
}


function printBulletin() {
    const bulletinContent = document.getElementById('bulletin-content');
    
    bulletinContent.style.display = 'block';

    const originalContent = document.body.innerHTML;
    document.body.innerHTML = bulletinContent.outerHTML;
    window.print();
    document.body.innerHTML = originalContent;
}


async function logout() {
    try {
        console.log("Logout button clicked");

        const response = await fetch('http://127.0.0.1:8000/api/user/logout/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken(), // CSRF token for security
            },
            credentials: 'include', // Include credentials for session
        });

        if (!response.ok) {
            throw new Error(`Logout failed: ${response.status}`);
        }

        alert('Logged out successfully!');  // Notify the user
        window.location.href = 'login.html';  // Redirect to login page or homepage
    } catch (error) {
        console.error('Error logging out:', error);
        alert(`Failed to log out: ${error.message}`);
    }
}


document.getElementById('sendEmailButton').addEventListener('click', async () => {
    const numero = document.getElementById('numero').value; // Student number input
    const token = getCSRFToken();

    try {
        const response = await fetch(`http://127.0.0.1:8000/api/notes/send_bulletin/${numero}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': token,
            },
            credentials: 'include',
        });
        
        if (!response.ok) {
            const errorText = await response.text(); // Read error response as plain text
            console.error('Error response:', errorText);
            throw new Error('Failed to send email.');
        }
        
        const data = await response.json(); // Parse JSON response
        alert(data.message || 'Email sent successfully!');
        
        
    } catch (error) {
        console.error('Error sending email:', error);
        alert(`Error: ${error.message}`);
    }
});
