// Event listener for submitting the form to add a new filiere
const apiUrl = "https://school-app-8.onrender.com/"
document.getElementById('addFiliereForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const filiereName = document.getElementById('filiereName').value;

    try {
        const response = await fetch(apiUrl + 'api/filieres/create', { // No trailing slash here
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: filiereName })
        });

        if (response.ok) {
            alert('Filiere added successfully!');
            document.getElementById('addFiliereForm').reset();
        } else {
            const errorData = await response.json();
            console.error('Error:', errorData);
            alert('Failed to add filiere.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to add filiere.');
    }
});

// Event listener for viewing all filieres when the button is clicked
document.getElementById('viewFilieresBtn').addEventListener('click', async () => {
    try {
        const response = await fetch(apiUrl + 'api/filieres/', {
            method: 'GET'
        });

        if (response.ok) {
            const filieres = await response.json();
            const filieresList = document.getElementById('filieresList');

            // Creating table headers and rows with ID and Name
            filieresList.innerHTML = `
                <h2>All Filieres</h2>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Filiere Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filieres.map(filiere => `
                            <tr>
                                <td>${filiere.id}</td>
                                <td>${filiere.name}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        } else {
            console.error('Failed to load filieres');
            alert('Failed to load filieres');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to load filieres');
    }
});
