document.addEventListener('DOMContentLoaded', function() {
    fetchGenderDataAndDisplayCharts();
});

function fetchGenderDataAndDisplayCharts() {
    fetch('http://127.0.0.1:8000/api/students/gender-stats/') // Replace with the actual endpoint for gender stats
        .then(response => response.json())
        .then(data => {
            if (data) {
                const maleCount = data.male || 0;
                const femaleCount = data.female || 0;

                displayGenderHistogram(maleCount, femaleCount);
                displayGenderPieChart(maleCount, femaleCount);
            } else {
                console.error('No data available');
            }
        })
        .catch(error => {
            console.error('Error fetching gender data:', error);
        });
}

function displayGenderHistogram(maleCount, femaleCount) {
    const ctx = document.getElementById('genderHistogram').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Male', 'Female'],
            datasets: [{
                label: 'Number of Students',
                data: [maleCount, femaleCount],
                backgroundColor: ['#36A2EB', '#FF6384']
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

function displayGenderPieChart(maleCount, femaleCount) {
    const ctx = document.getElementById('genderPieChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Male', 'Female'],
            datasets: [{
                data: [maleCount, femaleCount],
                backgroundColor: ['#36A2EB', '#FF6384']
            }]
        },
        options: {
            responsive: true
        }
    });
}
