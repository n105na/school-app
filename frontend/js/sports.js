// Add sport form submission
document.getElementById('addSportForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const sportName = document.getElementById('sportName').value;

    try {
        const response = await fetch('http://localhost:8000/api/sports/create', { // No trailing slash here
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: sportName }) // Sending the sport name as JSON
        });

        if (response.ok) {
            alert('Sport added successfully!');
            document.getElementById('addSportForm').reset();
        } else {
            const errorData = await response.json();
            console.error('Error:', errorData);
            alert(errorData.detail || 'Failed to add sport.'); // Displaying error message if available
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to add sport. Check your connection or login status.');
    }
});

// View all sports button click
document.getElementById('viewSportsBtn').addEventListener('click', async () => {
    try {
        const response = await fetch('http://localhost:8000/api/sports/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const sports = await response.json();
            const sportsList = document.getElementById('sportsList');

            // Creating table headers and rows with ID and Name
            sportsList.innerHTML = `
                <h2>All Sports</h2>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Sport Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sports.map(sport => `
                            <tr>
                                <td>${sport.id}</td>
                                <td>${sport.name}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        } else {
            const errorData = await response.json();
            console.error('Failed to load sports:', errorData);
            alert(errorData.detail || 'Failed to load sports.'); // Displaying error message if available
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to load sports. Check your connection or login status.');
    }
});
