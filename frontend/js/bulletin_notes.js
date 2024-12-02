





// Fetch and display student data, including loading modules for the specific filiere
function searchStudent() {
    const numero = document.getElementById("numero").value;

    fetch(`http://localhost:8000/api/notes/student/${numero}/`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Student not found");
            }
            return response.json();
        })
        .then(data => {
            // Populate student's details
            document.getElementById("nom_prenom").value = data.student.nom_prenom;

            // Set civilite
            const civiliteInput = document.querySelector(`input[name="civilite"][value="${data.student.civilite}"]`);
            if (civiliteInput) {
                civiliteInput.checked = true;
            }

            // Set Filiere name
            document.getElementById("filiere").value = data.student.filiere.name;
            
           
            // Populate the module dropdown based on filiere
            const moduleDropdown = document.getElementById("module");
            moduleDropdown.innerHTML = '<option value="">Select Module</option>';
            data.modules.forEach(module => {
                const option = document.createElement("option");
                option.value = module.code_module;
                option.textContent = module.designation_module;
                option.dataset.coefficient = module.coefficient;
                moduleDropdown.appendChild(option);
            });

            // Update the module code and coefficient when a module is selected
            moduleDropdown.addEventListener("change", function() {
                const selectedOption = moduleDropdown.options[moduleDropdown.selectedIndex];
                document.getElementById("code_module").value = selectedOption.value;
                document.getElementById("coefficient").value = selectedOption.dataset.coefficient || "";
                fetchModuleDetails();
            });
            displayPicture(data.student_image);
        })
        .catch(error => {
            document.getElementById("responseMessage").textContent = error.message;
        });
}


function displayPicture(pictureUrl) {
    const pictureContainer = document.getElementById('studentImageContainer');
    const img = document.getElementById('studentImage'); // Get the existing img tag
    if (pictureUrl) {
        // If the URL is relative, append it to the base URL (localhost in this case)
        if (pictureUrl.startsWith('/media/')) {
            img.src = `http://127.0.0.1:8000${pictureUrl}`;
        } else {
            img.src = pictureUrl;
        }
        pictureContainer.style.display = 'block'; // Show the image container
    } else {
        img.src = ''; // Use a default image path that works
        pictureContainer.style.display = 'block'; // Show the default image
    }
    pictureContainer.appendChild(img);
}


// Fetch module details based on selected module and student number
function fetchModuleDetails() {
    const numero = document.getElementById("numero").value;
    const moduleDropdown = document.getElementById("module");
    const selectedModuleCode = moduleDropdown.value;

    if (!selectedModuleCode) {
        return;
    }

    // Fetch the note for the selected student and module
    fetch(`http://localhost:8000/api/notes/modify/${numero}/${selectedModuleCode}/`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Note not found or an error occurred.");
            }
            return response.json();
        })
        .then(data => {
            if (data.note) {
                document.getElementById("note").value = data.note;
                document.getElementById("responseMessage").textContent = "";
            } else {
                document.getElementById("note").value = "";
                document.getElementById("responseMessage").textContent = "La note n'existe pas encore. Vous pouvez l'enregistrer.";
            }
        })
        .catch(error => {
            document.getElementById("responseMessage").textContent = error.message;
        });
}

// Function to save a new note for the selected module
function enregistrerNote() {
    const numero = document.getElementById("numero").value;
    const moduleDropdown = document.getElementById("module");
    const selectedModuleCode = moduleDropdown.value;
    const note = document.getElementById("note").value;

    if (!numero || !selectedModuleCode || !note) {
        document.getElementById("responseMessage").textContent = "Veuillez remplir tous les champs requis.";
        return;
    }

    const noteData = {
        student_id: numero,
        code_module: selectedModuleCode,
        note: note
    };

    fetch("http://localhost:8000/api/notes/create/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(noteData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Erreur lors de l'enregistrement de la note.");
        }
        return response.json();
    })
    .then(data => {
        document.getElementById("responseMessage").textContent = "Note enregistrée avec succès.";
        document.getElementById("note").value = "";
    })
    .catch(error => {
        document.getElementById("responseMessage").textContent = error.message;
    });
}

// Modify an existing note for the selected module and student
function modifyNote() {
    const numero = document.getElementById("numero").value;
    const selectedModuleCode = document.getElementById("module").value;
    const note = document.getElementById("note").value;

    if (!numero || !selectedModuleCode || !note) {
        document.getElementById("responseMessage").textContent = "Veuillez remplir tous les champs requis.";
        return;
    }

    const noteData = {
        student_id: numero,
        code_module: selectedModuleCode,
        note: note
    };

    fetch(`http://localhost:8000/api/notes/modify/${numero}/${selectedModuleCode}/`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(noteData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Erreur lors de la modification de la note.");
        }
        return response.json();
    })
    .then(data => {
        document.getElementById("responseMessage").textContent = "Note modifiée avec succès.";
    })
    .catch(error => {
        document.getElementById("responseMessage").textContent = error.message;
    });
}


//////THE DELETE NOTE FEATURE 
// Function to delete a note for the selected module and student
function deleteNote() {
    const numero = document.getElementById("numero").value;
    const selectedModuleCode = document.getElementById("module").value;

    if (!numero || !selectedModuleCode) {
        document.getElementById("responseMessage").textContent = "Veuillez remplir tous les champs requis.";
        return;
    }

    // Check if the note exists before attempting to delete it
    fetch(`http://localhost:8000/api/notes/modify/${numero}/${selectedModuleCode}/`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Note Inéxistante pour ce module");
            }
            return response.json();
        })
        .then(data => {
            // Display the module code, coefficient, and note details
            document.getElementById("code_module").value = data.code_module;
            document.getElementById("coefficient").value = data.coefficient;
            document.getElementById("note").value = data.note;
            document.getElementById("responseMessage").textContent = "";

            // Confirm deletion
            const confirmDelete = confirm("Êtes-vous sûr de vouloir supprimer cette note?");
            if (!confirmDelete) return;

            // Proceed with the deletion
            fetch(`http://localhost:8000/api/notes/delete/${numero}/${selectedModuleCode}/`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Erreur lors de la suppression de la note.");
                }
                return response.json();
            })
            .then(data => {
                document.getElementById("responseMessage").textContent = "Note supprimée avec succès.";
                // Clear fields after deletion
                document.getElementById("code_module").value = "";
                document.getElementById("coefficient").value = "";
                document.getElementById("note").value = "";
            })
            .catch(error => {
                document.getElementById("responseMessage").textContent = error.message;
            });
        })
        .catch(error => {
            document.getElementById("responseMessage").textContent = error.message;
        });
}

// Add event listener for the "showNotesButton" to trigger fetching notes
// Set up the button event listener
document.addEventListener('DOMContentLoaded', function() {
    // Attach the click event to the button with the ID 'afficherButton'
    const afficherButton = document.getElementById('afficherButton');
    afficherButton.addEventListener('click', fetchAndDisplayNotes);
});

function fetchAndDisplayNotes() {
    fetch('http://127.0.0.1:8000/api/notes/student/list/')
        .then(response => response.json())
        .then(data => {
            if (data) {
                const tableBody = document.getElementById('tableBody');
                tableBody.innerHTML = ''; // Clear previous content

                // Loop through each filière's data
                data.forEach(filiereData => {
                    filiereData.notes.forEach(note => {
                        // Create a row for each note within the filière
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${note.num_etudiant || 'N/A'}</td>
                            <td>${note.nom_module || 'N/A'}</td>
                            <td>${note.code_module || 'N/A'}</td>
                            <td>${note.coefficient || 'N/A'}</td>
                            <td>${note.note !== undefined ? note.note.toFixed(2) : 'N/A'}</td>
                        `;
                        tableBody.appendChild(row);
                    });
                });
            } else {
                console.error('Invalid or empty data received:', data);
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

