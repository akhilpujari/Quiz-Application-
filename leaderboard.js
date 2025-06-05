$(document).ready(function () {
    $("#fetchLeaderboard").click(function () {
        let subject = $("#subject option:selected").text().trim();
        let quizTitle = $("#quiz option:selected").text().trim();
        let leaderboardBody = $("#leaderboardBody");

        if (!subject || subject === "Select a subject" || !quizTitle || quizTitle === "Select a quiz") {
            leaderboardBody.html('<tr><td colspan="4" class="text-danger text-center">Please select a valid Subject and Quiz Title.</td></tr>');
            return;
        }

        $.ajax({
            url: "/api/leaderboard.php",
            method: "POST",
            headers: {
                Authorization: localStorage.getItem("token"),
            },
            data: JSON.stringify({ subject: subject, quizTitle: quizTitle }),
            contentType: "application/json",
            success: function (response) {
                let result = JSON.parse(response);
                console.log(result);
                if (result.data.length > 0) {
                    displayLeaderboard(result.data);
                } else {
                    leaderboardBody.html('<tr><td colspan="4" class="text-center">No results found.</td></tr>');
                }
            },
            error: function () {
                leaderboardBody.html('<tr><td colspan="4" class="text-danger text-center">Error fetching leaderboard.</td></tr>');
            },
        });

        function displayLeaderboard(data) {
            leaderboardBody.empty();
            data.forEach((user, index) => {
                leaderboardBody.append(`
                    <tr>
                        <td>${index + 1}</td>
                        <td>${user.username}</td>
                        <td><span class="badge bg-success">${user.score}</span></td>
                        <td>${user.time_taken}</td>
                    </tr>
                `);
            });
        }
    });
});

function showSubjects(){
    let token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }
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
            $('#subject_option').html(option);

            $('#subject').on('change', function () {
                let subjectId = $(this).val();
                let quizOptions = '';
                result.data.quizzes.forEach(quiz => {
                    if (quiz.subject_id == subjectId) {
                        quizOptions += `<option value="${quiz.id}">${quiz.quiz_title}</option>`;
                    }
                });
                $('#quizSelect').html(quizOptions);
            });
        },
        error: function() {
            localStorage.clear();
            // window.location.href = 'index.html';
        }
    });
}