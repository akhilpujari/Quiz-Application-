class Question {
  constructor(question,difficultyLevel,options,correctOption) {
    this.question = question;
    this.difficultyLevel=difficultyLevel;
    this.options = options.map(opt => ({
      text: opt.text,
      letter: opt.letter.toUpperCase()
    }));
    this.correctOption = correctOption.toUpperCase();
  }
}

let questionsList = [];
let index = 1;

function addQuestion() {
  const questionId = index++;
  $("#questions-container").append(`
    <div class="card mb-3 card-body" id="question${questionId}" data-question-id="${questionId}">
      <div class="mb-3">
        <label class="form-label">Question</label>
        <textarea class="form-control question-text" rows="2" placeholder="Enter question"></textarea>
        <button class="btn btn-danger mt-2" onclick="removeQuestion(${questionId})">Remove Question</button>
      </div>
      <div class="mt-3">
        <label class="form-label">Difficulty Level</label>
        <select class="form-select difficultyLevel">
          <option value="0">Choose Difficulty Level</option>
          <option value="1">EASY</option>
          <option value="2">MEDIUM B</option>
          <option value="3">HARD</option>
        </select>
      </div>
      <div class="row g-2">
        <div class="col-md-6"><input type="text" class="form-control option-a" placeholder="Option A"></div>
        <div class="col-md-6"><input type="text" class="form-control option-b" placeholder="Option B"></div>
        <div class="col-md-6"><input type="text" class="form-control option-c" placeholder="Option C"></div>
        <div class="col-md-6"><input type="text" class="form-control option-d" placeholder="Option D"></div>
      </div>
      <div class="mt-3">
        <label class="form-label">Correct Option</label>
        <select class="form-select correct-option">
          <option value="A">Option A</option>
          <option value="B">Option B</option>
          <option value="C">Option C</option>
          <option value="D">Option D</option>
        </select>
      </div>
    </div>
  `);
}

function updateQuestionsList() {
  questionsList = [];
  $(".card-body[data-question-id]").each(function() {
    const container = $(this);
    const options = [
      {text: container.find(".option-a").val(), letter: 'A'},
      {text: container.find(".option-b").val(), letter: 'B'},
      {text: container.find(".option-c").val(), letter: 'C'},
      {text: container.find(".option-d").val(), letter: 'D'}
    ];
    const question = new Question(
      container.find(".question-text").val(),
      container.find(".difficultyLevel").val(),
      options,
      container.find(".correct-option").val()
    );
    questionsList.push(question);
  });
  
  console.log("Updated questionsList:", questionsList);
}

function removeQuestion(questionId) {
  $(`#question${questionId}`).remove();
}

function submitQuestions() {
  updateQuestionsList();
  if (questionsList.length === 0) {
    alert("Please add at least one valid question.");
    return;
  }
  const validQuestions = questionsList.filter(q => 
    q.question.trim() && 
    q.difficultyLevel > 0 && 
    q.options.every(opt => opt.text.trim()) && 
    q.correctOption
  );
  
  if (validQuestions.length === 0) {
    alert("Please fill in all fields for at least one question.");
    return;
  }
  if(validQuestions.length != questionsList.length){
    alert("Some questions are invalid. Please fill in all fields for each question.");
    return;
  }
  
  console.log("Submitting questions:", validQuestions);
  
  if($("#quiz").val() == "Select a quiz"){
      alert("Please select a quiz.");
      return;
  }
  $.ajax({
      method : "POST",
      url :"api/addquestions.php",
      headers:{
          Authorization : localStorage.getItem("token"),
          "Content-Type": "application/json"
      },
      data:JSON.stringify({
          quizId : $("#quiz").val(),
          questions: validQuestions
      }),
      success : function(response){
          console.log(response);
          alert("questions added successfully");
          window.location.reload();
      },
      error : function(error){
          console.log(error);
          alert("smthg went wrong");
      }
  })
}
  




  $(document).ready(function() {
    addQuestion();
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
            console.log("error in fetching subjects and quizzes");
        }
    });
  });



function addQuiz(){
    if($("#subject").val() == "Choose Subject"){
        alert("Please select a subject.");
        return;
    }
    else if($("#quizTitle").val() == "" && $("#quizTitle").val().trim() == ""){
        alert("Please enter a quiz title.");
        return;
    }
    else if($("#timeLimit").val() == "" && $("#timeLimit").val().trim() == ""){
        alert("Please enter a time limit.");
        return;
    }

    $.ajax({
        method : "POST",
        url :"api/addquiz.php",
        headers:{
            Authorization : localStorage.getItem("token")
        },
        data:{
            subjectId : $("#subject").val(),
            quizTitle : $("#quizTitle").val(),
            timeLimit : $("#timeLimit").val()
        },
        success : function(response){
            console.log(response);
            $("#subject").val('')
            $("#quizTitle").val('')
           $("#timeLimit").val('')
        },
        error : function(error){
            console.log(error);
        }
    })
   
}







  
function addSubject(){
    if($("#subjectName").val() == ""){
        alert("Please enter a subject name.");
        return;
    }
    $.ajax({
        type: "POST",
        url: "/api/addsubject.php",
        headers: {
            Authorization : localStorage.getItem('token')
        },
        data: { 
            subject: $("#subjectName").val() 
        },
        success: function(response){
            console.log(response);
            alert("subject added successfully");
            $("#subjectName").val("");
        },
        error: function(){
            alert("An error occurred. Please try again.");
        }
    });
};