let quizzes;
$(document).ready(function() {
    let token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html';
    } else {
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
});

function startQuiz(event){
    event.preventDefault();
    let token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }
    localStorage.setItem('quizId', $('#quiz').val());
    
    let time_limit = quizzes.find(quiz => quiz.id == $('#quiz').val()).time_limit;
    localStorage.setItem('time_limit', time_limit);
    
    $.ajax({
        url: 'api/quiz.php',
        method: 'POST',
        headers: {
            Authorization: token
        },
        data: {
            quiz_id: $('#quiz').val()
        },
        success: function(response) {
            localStorage.setItem("timestamp", Date.now());
            let result = JSON.parse(response);
            localStorage.setItem('quizData', JSON.stringify(result.data));
            window.location.href = 'quizpage.html';
        },
        error: function() {
            localStorage.clear();
            window.location.href = 'index.html';
        }
    })
}

