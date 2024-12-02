document.addEventListener('DOMContentLoaded', function() {
    fetchNotesAndCalculatePV();
});

function fetchNotesAndCalculatePV() {
    fetch('http://127.0.0.1:8000/api/notes/student/list/')
        .then(response => response.json())
        .then(data => {
            console.log('Fetched data:', data);

            if (data && Array.isArray(data) && data.length > 0) {
                const filiereContainer = document.getElementById('filiereContainer');
                filiereContainer.innerHTML = ''; // Clear any previous content

                // Process each filiere object
                data.forEach(filiere => {
                    // Create a section for each filiere
                    const section = document.createElement('section');
                    const title = document.createElement('h2');
                    title.innerText = `Filiere: ${filiere.filiere || 'N/A'}`;
                    section.appendChild(title);

                    // Create stats for this filiere, formatted to 2 decimal places
                    const stats = document.createElement('p');
                    stats.classList.add('stats');
                    stats.innerText = `
                        Moyenne Générale: ${filiere.moyenne_generale ? filiere.moyenne_generale.toFixed(2) : 'N/A'}  
                        Moyenne Min: ${filiere.moyenne_min ? filiere.moyenne_min.toFixed(2) : 'N/A'} 
                        Moyenne Max: ${filiere.moyenne_max ? filiere.moyenne_max.toFixed(2) : 'N/A'}
                    `;
                    section.appendChild(stats);

                    // Create a table for students
                    const table = document.createElement('table');
                    const tableHeader = document.createElement('thead');
                    tableHeader.innerHTML = `
                        <tr>
                            <th>Num Étudiant</th>
                            <th>Nom Étudiant</th>
                            <th>Moyenne Générale</th>
                        </tr>
                    `;
                    table.appendChild(tableHeader);

                    const tableBody = document.createElement('tbody');
                    
                    // Display each student's unique `num_etudiant` and `nom_prenom` with their `moyenne_generale`
                    const studentMap = new Map();
                    filiere.notes.forEach(note => {
                        // Only add each student once, using `num_etudiant` as the unique key
                        if (!studentMap.has(note.num_etudiant)) {
                            studentMap.set(note.num_etudiant, {
                                num_etudiant: note.num_etudiant,
                                nom_prenom: note.nom_prenom,
                                moyenne_generale: note.moyenne_generale
                            });
                        }
                    });

                    // Populate the table rows with unique student data
                    studentMap.forEach(student => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${student.num_etudiant || 'N/A'}</td>
                            <td>${student.nom_prenom || 'N/A'}</td>
                            <td>${student.moyenne_generale ? student.moyenne_generale.toFixed(2) : 'N/A'}</td>
                        `;
                        tableBody.appendChild(row);
                    });

                    table.appendChild(tableBody);
                    section.appendChild(table);

                    // Append the section for this filiere to the container
                    filiereContainer.appendChild(section);
                });

                // Make the bulletin content visible for printing
                document.getElementById('bulletin-content').style.display = 'block';
            } else {
                console.error('Invalid or empty data received:', data);
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// Print function
function printBulletin() {
    const bulletinContent = document.getElementById('bulletin-content');

    const originalContent = document.body.innerHTML;
    document.body.innerHTML = bulletinContent.outerHTML;
    window.print();
    document.body.innerHTML = originalContent;
}
