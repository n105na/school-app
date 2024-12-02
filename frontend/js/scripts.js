/*document.addEventListener("DOMContentLoaded", function () {
    // Reload unique ID from localStorage or set to 1 if not found
    let uniqueId = localStorage.getItem("uniqueId") || 1;

    // Check if the page was reloaded
    if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
        uniqueId++; // Increment ID on reload
        localStorage.setItem("numero", uniqueId); 
    }
});
    // Set uniqueId in the "numero" input field
    document.getElementById("numero").value = uniqueId; // Display uniqueId in the numero field */

   // Fetch sports data
// Fetch sports data
fetch('http://127.0.0.1:8000/api/sports/')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        const sportsSelect = document.getElementById('sports');
        data.forEach(sport => {
            const option = document.createElement('option');
            option.value = sport.id; // Assuming the value is the ID
            option.textContent = sport.name;
            sportsSelect.appendChild(option);
        });
    })
    .catch(error => console.error('Error fetching sports:', error));

// Fetch filières data
fetch('http://127.0.0.1:8000/api/filieres/')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        const filiereSelect = document.getElementById('filiere');
        data.forEach(filiere => {
            const option = document.createElement('option');
            option.value = filiere.id; // Assuming the value is the ID
            option.textContent = filiere.name;
            filiereSelect.appendChild(option);
        });
    })
    .catch(error => console.error('Error fetching filières:', error));
//fetch nationalite data

// Assuming you already have a function to fetch and populate nationalities
fetch('http://localhost:8000/api/nationalites/')
    .then(response => response.json())
    .then(data => {
        const nationaliteSelect = document.getElementById('nationalite');
        data.forEach(nationalite => {
            const option = document.createElement('option');
            option.value = nationalite.id; // Assuming the value is the ID
            option.textContent = nationalite.name;
            option.setAttribute('data-code', nationalite.code_nationalite); // Store the code as a data attribute
            nationaliteSelect.appendChild(option);
        });
    })
    .catch(error => console.error('Error fetching nationalities:', error));

// Event listener for nationality selection
document.getElementById('nationalite').addEventListener('change', (event) => {
    const selectedOption = event.target.options[event.target.selectedIndex];
    const codeNationaliteInput = document.getElementById('code_nationalite');
    
    // Check if an option is selected
    if (selectedOption.value) {
        // Get the code from the selected option's data attribute
        const code = selectedOption.getAttribute('data-code');
        codeNationaliteInput.value = code; // Set the code in the input field
    } else {
        codeNationaliteInput.value = ''; // Clear the input if nothing is selected
    }
});




// Function to preview the selected image
function previewImage(event) {
    const imagePreview = document.getElementById('imagePreview');
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        imagePreview.src = e.target.result; // Set the src of the preview image
        imagePreview.style.display = 'block'; // Show the preview
    };

    if (file) {
        reader.readAsDataURL(file); // Read the selected file
    } else {
        imagePreview.src = ''; // Clear the preview if no file is selected
        imagePreview.style.display = 'none'; // Hide preview
    }
}

function affichage() {
    // Get form values
    const numero = document.querySelector('input[name="numero"]').value || 'Non spécifié';
    const civilite = document.querySelector('input[name="civilite"]:checked') ? 
                     document.querySelector('input[name="civilite"]:checked').value : 
                     'Non spécifié';
    const nom_prenom = document.getElementById('nom_prenom').value || 'Non spécifié';
    const adresse = document.getElementById('adresse').value || 'Non spécifié';
    const no_postal = document.getElementById('no_postal').value || 'Non spécifié';
    const localite = document.getElementById('localite').value || 'Non spécifié';
    const pays = document.getElementById('country').value || 'Non spécifié';

    // Get selected platforms
    const plateforme = [];
    document.querySelectorAll('input[name="platform[]"]:checked').forEach(function (checkbox) {
        plateforme.push(checkbox.value);
    });

    // Get selected applications
    const application = [];
    document.querySelectorAll('select[name="application[]"] option:checked').forEach(function (option) {
        application.push(option.value);
    });

    // Get selected sports
    const sports = Array.from(document.querySelectorAll('select[name="sports"] option:checked')).map(option => option.textContent);

    // Get selected filière
    const filiere = document.querySelector('select[name="filiere"]').selectedOptions[0] ? document.querySelector('select[name="filiere"]').selectedOptions[0].text : 'Non spécifié';
    //get selected nationalite
    const nationalite = document.querySelector('select[name="nationalite"]').selectedOptions[0] ? document.querySelector('select[name="nationalite"]').selectedOptions[0].text : 'Non spécifié';

    // Create result message
    const results = `
        <h3>Results</h3>
        <p>Numero: ${numero}</p>
        <p>Civilité: ${civilite}</p>
        <p>Nom/Prenom: ${nom_prenom}</p>
        <p>Adresse: ${adresse}</p>
        <p>No Postal: ${no_postal}</p>
        <p>Localité: ${localite}</p>
        <p>Pays: ${pays}</p>
        <p>Platform(s): ${plateforme.join(', ') || 'Non spécifié'}</p>
        <p>Application(s): ${application.join(', ') || 'Non spécifié'}</p>
        <p>Sports: ${sports.join(', ') || 'Non spécifié'}</p>
        <p>Filière: ${filiere}</p>
        <p>Nationalite: ${nationalite}</p>
    `;

    // Display results in the results div
    document.getElementById('results').innerHTML = results;
}
//handeling the user form here 
document.getElementById('userForm').addEventListener('submit', function(event) {
    event.preventDefault();  // Stop traditional form submission

    //const formData = new FormData(this);  // Collect the form data
    const formData = new FormData();
formData.append('numero', document.getElementById('numero').value);
//handeling the required buttons ...
const civilite = document.querySelector('input[name="civilite"]:checked');
if (civilite) {
    formData.append('civilite', civilite.value);
} else {
    console.error('Civilité is required!');
}

formData.append('nom_prenom', document.getElementById('nom_prenom').value);
formData.append('adresse', document.getElementById('adresse').value);
formData.append('no_postal', document.getElementById('no_postal').value);
formData.append('localite', document.getElementById('localite').value);
formData.append('country', document.getElementById('country').value);
// Adding selected platform checkboxes to FormData
document.querySelectorAll('input[name="platform"]:checked').forEach(function(checkbox) {
    formData.append('platform', checkbox.value);
});

// Adding selected application options to FormData
document.querySelectorAll('#application option:checked').forEach(function(option) {
    formData.append('application', option.value);
});
console.log([...formData.entries()]);
// Get selected sports
const sports = [];
document.querySelectorAll('select[name="sports"] option:checked').forEach(function(option) {
    sports.push(option.value);
});

// Get the selected filière
const filiere = document.querySelector('select[name="filiere"]').value;

// Append sports and filière to FormData
sports.forEach(function(sport) {
    formData.append('sports[]', sport);
});
formData.append('filiere', filiere); // Add the selected filière
1


const imageFile = document.getElementById('image').files[0];
    if (imageFile) {
        formData.append('student_image', imageFile);  // Append the image file
    }


    fetch('http://localhost:8000/api/student/', {  // Change this URL to your actual API endpoint
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log('Form submitted successfully:', data);
        // Show success message or redirect user to another page
        document.getElementById('results').innerHTML = "Form submitted successfully!";
    })
    .catch((error) => {
        console.error('Form submission failed:', error);
        // Show error message
        document.getElementById('results').innerHTML = "Form submission failed. Please try again.";
    });
});

////////////////////the search //////////////////////////////
// Function to search for a student by ID (Numero)
function searchStudent() {
    const numero = document.getElementById('numero').value;
    
    if (!numero) {
        alert("Please enter a Numero to search");
        return;
    }

    // Send AJAX request to search student by numero
    fetch(`http://localhost:8000/api/students/${numero}/`) 
        .then(response => {
            if (!response.ok) {
                throw new Error('Student not found');
            }
            return response.json();
        })
        .then(data => {
            // Populate the form with the student's data
            document.getElementById('nom_prenom').value = data.nom_prenom;
            document.getElementById('adresse').value = data.adresse;
            document.getElementById('no_postal').value = data.no_postal;
            document.getElementById('localite').value = data.localite;
            document.getElementById('country').value = data.country;

            // Set civilité radio button
            document.querySelector(`input[name="civilite"][value="${data.civilite}"]`).checked = true;

            // Set platform checkboxes
            document.querySelectorAll('input[name="platform"]').forEach(function(checkbox) {
                checkbox.checked = data.platform.includes(checkbox.value);
            });

            // Set application options
            const applicationSelect = document.getElementById('application');
            for (let option of applicationSelect.options) {
                option.selected = data.application.includes(option.value);
            }

            // Set sports
            const sportsSelect = document.getElementById('sports');
            for (let option of sportsSelect.options) {
                option.selected = data.sports.includes(option.value);
            }

            // Set filiere
            document.getElementById('filiere').value = data.filiere;
        })
        .catch(error => {
            alert(error.message);
        });
}
/////////////UPDATE/////////////////////
// Function to handle updating the student details
document.getElementById("updateButton").addEventListener("click", function(event) {
    const numero = document.getElementById('numero').value;

    if (!numero) {
        alert("Please search and select a student to update.");
        return;
    }

    const formData = new FormData(document.getElementById("userForm"));  // Get all the form data

    // Send a PUT request to update the student by numero
    fetch(`http://localhost:8000/api/students/${numero}/update/`, {
        method: "PUT",
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update student');
        }
        return response.json();
    })
    .then(data => {
        alert("Student updated successfully");
    })
    .catch(error => {
        alert(error.message);
    });
});

//////////////DELETE LOGIC //////////////////////////
document.getElementById('deleteBtn').addEventListener('click', function() {
    const numero = document.getElementById('numero').value; // Get student ID

    // Check if the student number is provided
    if (!numero) {
        alert("Please enter a student number.");
        return;
    }

    // Send DELETE request to the server
    fetch(`http://localhost:8000/api/students/delete/${numero}/`, {  // Updated the URL to match your delete route
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (response.ok) {
            alert(`Student N°${numero} has been deleted successfully.`);
            // Clear all form fields after deletion
            document.getElementById('userForm').reset();

            // Set focus back to the "Numero" field
            document.getElementById('numero').focus();

            // Optionally, update the student list if required
            // updateStudentList(); // This would be a function that refreshes the student list
        } else {
            alert(`Failed to delete student N°${numero}.`);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred during deletion.');
    });
});
function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    section.style.display = section.style.display === 'none' ? 'block' : 'none';
}

// Initially hide all sections except the first one
document.querySelectorAll('.section-content').forEach((section, index) => {
    if (index !== 0) section.style.display = 'none';
});
