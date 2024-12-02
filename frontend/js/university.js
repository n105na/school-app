// Event listener for submitting the form to add a new university
document.getElementById('adduniversityForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const universityName = document.getElementById('universityName').value;

    try {
        const response = await fetch('http://localhost:8000/api/universities/create/', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: universityName })
        });

        if (response.ok) {
            alert('University added successfully!');
            document.getElementById('adduniversityForm').reset();
        } else {
            const errorData = await response.json();
            console.error('Error:', errorData);
            alert('Failed to add university.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to add university.');
    }
});

// Event listener for viewing all universities when the button is clicked
document.getElementById('viewuniversityBtn').addEventListener('click', async () => {
    try {
        const response = await fetch('http://localhost:8000/api/universities/', {
            method: 'GET'
        });

        if (response.ok) {
            const universities = await response.json();
            const universityList = document.getElementById('universityList');

            // Creating table headers and rows with ID and Name
            universityList.innerHTML = `
                <h2>All Universities</h2>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>University Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${universities.map(university => `
                            <tr>
                                <td>${university.id}</td>
                                <td>${university.name}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        } else {
            console.error('Failed to load universities');
            alert('Failed to load universities');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to load universities');
    }
});
