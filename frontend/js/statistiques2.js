document.addEventListener('DOMContentLoaded', function () {
    fetchAdmisNonAdmisDataAndDisplayCharts();
    setupSendEmailButton();
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

                // Store the counts globally for email use
                window.admisCount = admisCount;
                window.nonAdmisCount = nonAdmisCount;
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

function setupSendEmailButton() {
    document.getElementById('sendEmailButton').addEventListener('click', function () {
        const chartCanvas = document.getElementById('admisNonAdmisPieChart');
        const chartImageBase64 = chartCanvas.toDataURL('image/png'); // Convert chart to base64

        // Prepare email data
        const emailData = {
            admis_count: window.admisCount, // Use the globally stored admis count
            non_admis_count: window.nonAdmisCount, // Use the globally stored non-admis count
            email: 'benaini2021@gmail.com', // Replace with user input or predefined email
            chart_image_base64: chartImageBase64,
        };

        // Send the email
        fetch('http://127.0.0.1:8000/api/notes/send-email/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailData),
        })
            .then(response => {
                if (response.ok) {
                    alert('Email sent successfully!');
                } else {
                    alert('Failed to send email.');
                }
            })
            .catch(error => {
                console.error('Error sending email:', error);
            });
    });
}
