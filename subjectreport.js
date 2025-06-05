$(document).ready(function () {
    let token = localStorage.getItem("token");

    $.ajax({
        url: 'api/home.php',
        method: 'GET',
        headers: {
            Authorization: token
        },
        success: function(response) {
            let result = JSON.parse(response);
            console.log(result);
            quizzes = result.data.quizzes;
            let option = '';
            result.data.subjects.forEach(subject => {
                option += `<option value="${subject.id}">${subject.subject_name}</option>`;
            });
            $('.subject_option').html(option);
        },
        error: function() {
            localStorage.clear();
            console.log("error in fetching subjects and quizzes");
        }
    });

    let chartInstance = null;  


    $('.subject').change(function() {
        let subjectName = $('.subject').val();
        console.log(subjectName);

        $.ajax({
            url: `api/subjectstats.php?subject=${encodeURIComponent(subjectName)}`,
            method: 'GET',
            headers: {
                Authorization: token
            },
            success: function (response) {
                const result = typeof response === 'string' ? JSON.parse(response) : response;

                if (result.status === 200 && result.data) {
                    const { passed, failed, not_attended } = result.data;

                    const ctx = document.getElementById('subjectChart').getContext('2d');

                    if (chartInstance) {
                        chartInstance.destroy();
                    }

                    chartInstance = new Chart(ctx, {
                        type: 'pie',
                        data: {
                            labels: ['Passed', 'Failed', 'Not Attended'],
                            datasets: [{
                                data: [passed, failed, not_attended],
                                backgroundColor: ['#28a745', '#dc3545', '#ffc107'],
                                borderWidth: 1
                            }]
                        },
                        options: {
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'bottom'
                                },
                                title: {
                                    display: true,
                                    text: `Quiz Outcome Breakdown for ${subjectName}`
                                }
                            }
                        }
                    });
                } else {
                    console.log("No data found or unexpected format.");
                }
            },
            error: function (err) {
                console.error("Failed to fetch subject stats:", err);
            }
        });
    });
});
