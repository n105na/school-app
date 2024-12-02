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

    // URL endpoints - update these as per your backend API setup
const baseURL = 'http://localhost:8000/api/modules/';



// Search Module by ID
document.getElementById('searchModuleBtn').addEventListener('click', async () => {
    const id = document.getElementById('id').value;
    if (!id) {
        alert('Please enter the module ID to search.');
        return;
    }
    try {
        const response = await fetch(`${baseURL}${id}/`);
        if (response.ok) {
            const moduleData = await response.json();
            document.getElementById('code_module').value = moduleData.code_module;
            document.getElementById('designation_module').value = moduleData.designation_module;
            document.getElementById('coefficient').value = moduleData.coefficient;
            document.getElementById('volume_horaire').value = moduleData.volume_horaire;
            document.getElementById('filiere').value = moduleData.filiere;
        } else {
            alert('Module not found');
        }
    } catch (error) {
        console.error('Error searching module:', error);
    }
});

// Add Module
document.getElementById('moduleForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const moduleData = {
        code_module: document.getElementById('code_module').value,
        designation_module: document.getElementById('designation_module').value,
        coefficient: document.getElementById('coefficient').value,
        volume_horaire: document.getElementById('volume_horaire').value,
        filiere: document.getElementById('filiere').value,
    };
    try {
        const response = await fetch(`${baseURL}create/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(moduleData),
        });
        if (response.ok) {
            alert('Module added successfully!');
            document.getElementById('moduleForm').reset();
        } else {
            alert('Failed to add module');
        }
    } catch (error) {
        console.error('Error adding module:', error);
    }
});

// Update Module
document.getElementById('updateModuleBtn').addEventListener('click', async () => {
    const id = document.getElementById('id').value;
    if (!id) {
        alert('Please enter the module ID to update.');
        return;
    }
    const updatedData = {
        code_module: document.getElementById('code_module').value,
        designation_module: document.getElementById('designation_module').value,
        coefficient: document.getElementById('coefficient').value,
        volume_horaire: document.getElementById('volume_horaire').value,
        filiere: document.getElementById('filiere').value,
    };
    try {
        const response = await fetch(`${baseURL}${id}/update/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        });
        if (response.ok) {
            alert('Module updated successfully!');
        } else {
            alert('Failed to update module');
        }
    } catch (error) {
        console.error('Error updating module:', error);
    }
});

// Delete Module
document.getElementById('deleteModuleBtn').addEventListener('click', async () => {
    const id = document.getElementById('id').value;
    if (!id) {
        alert('Please enter the module ID to delete.');
        return;
    }
    try {
        const response = await fetch(`${baseURL}${id}/delete/`, {
            method: 'DELETE',
        });
        if (response.ok) {
            alert('Module deleted successfully!');
            document.getElementById('moduleForm').reset();
        } else {
            alert('Failed to delete module');
        }
    } catch (error) {
        console.error('Error deleting module:', error);
    }
});

// Load filieres on page load
window.addEventListener('load', loadFilieres);
