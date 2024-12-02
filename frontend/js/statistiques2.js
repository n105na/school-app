document.addEventListener('DOMContentLoaded', function() {
    fetchAdmisNonAdmisDataAndDisplayCharts();
});

function fetchAdmisNonAdmisDataAndDisplayCharts() {
    fetch('http://127.0.0.1:8000/api/notes/moyenne-generale/') // Replace with your actual endpoint for student data
        .then(response => response.json())
        .then(data => {
            if (data) {
                let admisCount = 0;
                let nonAdmisCount = 0;

                // Process each student's moyenne
                data.forEach(student => {
                    if (student.moyenne_generale >= 10) {
                        admisCount++;
                    } else {
                        nonAdmisCount++;
                    }
                });

                displayAdmisNonAdmisHistogram(admisCount, nonAdmisCount);
                displayAdmisNonAdmisPieChart(admisCount, nonAdmisCount);
            } else {
                console.error('No data available');
            }
        })
        .catch(error => {
            console.error('Error fetching student data:', error);
        });
}

function displayAdmisNonAdmisHistogram(admisCount, nonAdmisCount) {
    const ctx = document.getElementById('admisNonAdmisHistogram').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Admis', 'Non Admis'],
            datasets: [{
                label: 'Nombre d\'Étudiants',
                data: [admisCount, nonAdmisCount],
                backgroundColor: ['#28a745', '#dc3545']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function displayAdmisNonAdmisPieChart(admisCount, nonAdmisCount) {
    const ctx = document.getElementById('admisNonAdmisPieChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Admis', 'Non Admis'],
            datasets: [{
                data: [admisCount, nonAdmisCount],
                backgroundColor: ['#28a745', '#dc3545']
            }]
        },
        options: {
            responsive: true
        }
    });
}
