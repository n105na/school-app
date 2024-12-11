// Form Submission for Creating a Teacher
document.getElementById('teacherForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const teacherData = {
        civilite: document.getElementById('civilite').value,
        nom_prenom: document.getElementById('nom_prenom').value,
        email: document.getElementById('email').value,
        adresse: document.getElementById('adresse').value,
        date_naissance: document.getElementById('date_naissance').value,
        lieu_naissance: document.getElementById('lieu_naissance').value,
        pays: document.getElementById('pays').value,
        grade: document.getElementById('grade').value,
        specialite: document.getElementById('specialite').value
    };

    fetch('http://localhost:8000/api/teachers/create/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(teacherData),
    })
    .then(response => {
        if (response.ok) {
            alert('Teacher saved successfully!');
            document.getElementById('teacherForm').reset();
        } else {
            alert('Failed to save teacher.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred.');
    });
});

// Search Teacher by ID
document.getElementById('searchTeacherBtn').addEventListener('click', function() {
    const numero = document.getElementById('numero').value.trim();

    if (!numero) {
        alert('Please enter a valid teacher ID');
        return;
    }

    fetch(`http://localhost:8000/api/teachers/${numero}/`)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                alert('Teacher not found');
                throw new Error('Teacher not found');
            }
        })
        .then(data => {
            document.getElementById('numero').value = data.numero;
            document.getElementById('civilite').value = data.civilite;
            document.getElementById('nom_prenom').value = data.nom_prenom;
            document.getElementById('email').value = data.email;
            document.getElementById('adresse').value = data.adresse;
            document.getElementById('date_naissance').value = data.date_naissance;
            document.getElementById('lieu_naissance').value = data.lieu_naissance;
            document.getElementById('pays').value = data.pays;
            document.getElementById('grade').value = data.grade;
            document.getElementById('specialite').value = data.specialite;
        })
        .catch(error => console.error('Error:', error));
});

// Delete Teacher by ID
document.getElementById('deleteTeacherBtn').addEventListener('click', function() {
    const numero = document.getElementById('numero').value;

    if (!numero) {
        alert('Please enter a valid teacher ID');
        return;
    }

    fetch(`http://localhost:8000/api/teachers/delete/${numero}/`, {
        method: 'DELETE',
    })
    .then(response => {
        if (response.ok) {
            alert(`Teacher N°${numero} deleted successfully.`);
            document.getElementById('teacherForm').reset();
        } else {
            alert('Failed to delete teacher.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while deleting.');
    });
});

// Update Teacher Details
document.getElementById('updateTeacherBtn').addEventListener('click', function (event) {
    event.preventDefault(); // Prevent page refresh on update

    const numero = document.getElementById('numero').value; 

    if (!numero) {
        alert('Please enter a valid teacher ID');
        return;
    }

    const updatedTeacherData = {
        civilite: document.getElementById('civilite').value,
        nom_prenom: document.getElementById('nom_prenom').value,
        email: document.getElementById('email').value,
        adresse: document.getElementById('adresse').value,
        date_naissance: document.getElementById('date_naissance').value,
        lieu_naissance: document.getElementById('lieu_naissance').value,
        pays: document.getElementById('pays').value,
        grade: document.getElementById('grade').value,
        specialite: document.getElementById('specialite').value
    };

    fetch(`http://localhost:8000/api/teachers/${numero}/update/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTeacherData)
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error(`Failed to update teacher: ${text}`);
            });
        }
        return response.json();
    })
    .then(data => {
        alert("Teacher updated successfully");
        document.getElementById('teacherForm').reset();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while updating: ' + error.message);
    });
    
});
// the university display 
// Function to load universities into the dropdown
async function loadUniversities() {
    try {
        const response = await fetch('http://localhost:8000/api/universities/', {
            method: 'GET'
        });

        if (response.ok) {
            const universities = await response.json();
            const universitySelect = document.getElementById('university');

            // Clear existing options
            universitySelect.innerHTML = '<option value="">Select University</option>';

            // Populate the dropdown with universities
            universities.forEach(university => {
                const option = document.createElement('option');
                option.value = university.id; // Assuming the API returns the university id
                option.textContent = university.name; // Assuming the API returns the university name
                universitySelect.appendChild(option);
            });
        } else {
            console.error('Failed to load universities');
            alert('Failed to load universities');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to load universities');
    }
}

// Call the loadUniversities function on page load
document.addEventListener('DOMContentLoaded', loadUniversities);
