$(document).ready(function(){
    let quizId = localStorage.getItem('quizId');
    $.ajax({
        url: '/api/quizresult.php',
        method : 'POST',
        headers:{
            'Authorization': localStorage.getItem('token')
        },
        data: { 
            quizId: quizId 
        },
        success:function(response){
          
            let result = JSON.parse(response);
            console.log(result);
            displayQuizResult(result.data);
        },
        error: function(error) {
            console.log(error);
        }
    })
    function displayQuizResult(data) {
        let testStatus = 'FAIL'
        if(data.status == true){
            testStatus = 'PASS'
        }
        $('#resultContainer').html(`
            <div class="card shadow-lg p-4">
                <h2 class="mb-3 text-primary">Quiz Result</h2>
                <p><strong>Quiz ID:</strong> ${quizId}</p>
                <p><strong>Your Score:</strong> <span class="badge bg-success">${data.score} / ${data.totalQuestions}</span></p>
                <p><strong>Start Time:</strong> ${data.startTime}</p>
                <p><strong>End Time:</strong> ${data.endTime}</p>
                <p><strong>Test Status:</strong> ${testStatus}</p>
                <button id="retryQuiz" class="btn btn-primary mt-3">Retry Quiz</button>
            </div>
        `);

        $("#retryQuiz").click(function () {
            localStorage.removeItem("userResponses");
            window.location.href = "Home.html";
        });
    }
})

