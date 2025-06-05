let quizData = JSON.parse(localStorage.getItem("quizData"));
let currentindex;
let startindex;
let endindex;

window.addEventListener("pageshow", function() {
    let token = localStorage.getItem("token");
    if(!token){
        window.location.href = "index.html";
    }
});

if (!localStorage.getItem('userResponses')) {
    localStorage.setItem('userResponses', '{}');
}
let userResponses = JSON.parse(localStorage.getItem('userResponses'));

$(document).ready(function() {
    
    let question_buttons = '';
    startindex = quizData[0].id;
    for(let i = 0;i< quizData.length;i++){
        question_buttons += `<button class="btn btn-outline-primary  me-2 mb-2" id="${quizData[i].id}" onclick ="loadQuestion(${quizData[i].id})">${i+1}</button>`;
        endindex = quizData[i].id;
    }
    $('#questionButtons').html(question_buttons);
    loadQuestion(quizData[0].id);
});
function loadQuestion(id) {
    currentindex = id;
    let question = quizData.find(q => q.id == id);
    if (!question) {
        console.error("Question not found", id);
        return;
    }
    $(`#${question.id}`).removeClass('btn-outline-primary').addClass('btn-outline-danger');
    $('#question-text').text('Q' + " " + question.question_text);
    $('#difficulty-level').text(question.difficulty_level);

    let optionsHtml = '';
    question.options.forEach(opt => {

        const isChecked = userResponses[question.id] === opt.option ? 'checked' : '';
        optionsHtml += `
            <div class="form-check">
                <input class="form-check-input" type="radio" 
                       name="question${question.id}" 
                       value="${opt.option}" 
                       ${isChecked}>
                <label class="form-check-label">${opt.option} : ${opt.option_text}</label>
            </div>`;
    });
    $('#question-options').html(optionsHtml);

    $(`input[name="question${question.id}"]`).change(function() {
        userResponses[question.id] = $(this).val();
        $(`#${question.id}`).removeClass('btn-outline-danger');
        $(`#${question.id}`).removeClass('btn-outline-primary').addClass('btn-success');
        localStorage.setItem('userResponses', JSON.stringify(userResponses));
    });
}

function saveAndNext(){
    if(currentindex >= startindex && currentindex < endindex){
       currentindex++;
       loadQuestion(currentindex);
    }
    console.log(userResponses);
}

function prevQuestion(){
    if(currentindex > startindex && currentindex <= endindex){
       currentindex--;
       loadQuestion(currentindex);
    }
}

function submitQuiz(event) {
    event.preventDefault();
    Swal.fire({
        title: 'Submit Quiz?',
        text: "Are you sure you want to submit your answers?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, submit!',
        cancelButtonText: 'No, cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            apiCallSubmitQuiz();
            document.exitFullscreen();
        } else {
            Swal.fire({
                title: 'Cancelled',
                text: 'Your quiz has not been submitted',
                icon: 'info',
                timer: 1500,
                showConfirmButton: false
            });
        }
    });
}
function apiCallSubmitQuiz(){
    let userResponses = JSON.parse(localStorage.getItem('userResponses'));
    let timestamp = localStorage.getItem("timestamp");
    let date = new Date(parseInt(timestamp));
    console.log(userResponses);
    $.ajax({
        url: 'api/submitquiz.php',
        method : 'POST',
        headers :{
            Authorization : localStorage.getItem('token'),
            "Content-Type": "application/json"
        },
        data: JSON.stringify({
            userResponses: userResponses,
            startTime : date.toISOString(),
            endTime : new Date().toISOString(),
            quizId : localStorage.getItem('quizId'),
        }),
        success: function(response) {    
            console.log(response);
            window.location.href = 'quizresult.html';
            localStorage.removeItem('userResponses');
            localStorage.removeItem('quizData');
            localStorage.removeItem('time_limit');
            localStorage.removeItem('timeleft');
        },
        error : function(error){
            console.error(error);
        } 
    })
}