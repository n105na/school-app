// Event listener to handle the form submission for adding a new nationalité
document.getElementById('addNationaliteForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const codeNationalite = document.getElementById('codeNationalite').value;
    const nationaliteName = document.getElementById('nationaliteName').value;

    try {
        const response = await fetch('http://localhost:8000/api/nationalites/create', { // No trailing slash here
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                code_nationalite: codeNationalite,
                name: nationaliteName
            })
        });

        if (response.ok) {
            alert('Nationalité added successfully!');
            document.getElementById('addNationaliteForm').reset();
        } else {
            const errorData = await response.json();
            console.error('Error:', errorData);
            alert('Failed to add nationalité.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to add nationalité.');
    }
});

// Event listener to display all nationalités when the 'View All Nationalites' button is clicked
document.getElementById('viewNationalitebtn').addEventListener('click', async () => {
    try {
        const response = await fetch('http://localhost:8000/api/nationalites/', {
            method: 'GET'
        });

        if (response.ok) {
            const nationalites = await response.json();
            const nationaliteList = document.getElementById('nationalitelist');

            // Creating table headers and rows with Code and Name
            nationaliteList.innerHTML = `
                <h2>All Nationalités</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Code Nationalité</th>
                            <th>Nationalité Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${nationalites.map(nationalite => `
                            <tr>
                                <td>${nationalite.code_nationalite}</td>
                                <td>${nationalite.name}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        } else {
            console.error('Failed to load nationalités');
            alert('Failed to load nationalités');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to load nationalités');
    }
});
