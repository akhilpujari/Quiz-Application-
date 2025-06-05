<?php

require_once("./utils/validateToken.php");
require_once("./utils/response.php");   
require_once("./utils/db.php");

$userinfo = validate_token();
$inputData = json_decode(file_get_contents("php://input"), true);

if (!isset($inputData['userResponses'])) {
    Response::showErrorMessage("Responses are required", 400);
}
try {
    $startTime = $inputData["startTime"];
    $endTime = $inputData["endTime"];
    $quizId = $inputData["quizId"];
    $userId = $userinfo['id'];
    $responses = $inputData['userResponses'];
    $pdo = getPDO();
    $query = "SELECT id FROM questions WHERE quiz_id = :quiz_id";
    $statement = $pdo->prepare($query);
    $statement->bindValue(':quiz_id', $quizId, PDO::PARAM_INT);
    $statement->execute();
    $allQuestions = $statement->fetchAll(PDO::FETCH_COLUMN); 
    
    $query = "INSERT INTO user_response (user_id, question_id, selected_option)
              VALUES (:user_id, :question_id, :selected_option)";
    $statement = $pdo->prepare($query);
    foreach ($allQuestions as $questionId) {
        $selectedOption = isset($responses[$questionId]) ? $responses[$questionId] : null; 

        $statement->bindValue(':user_id', $userId, PDO::PARAM_INT);
        $statement->bindValue(':question_id', $questionId, PDO::PARAM_INT);
        $statement->bindValue(':selected_option', $selectedOption, PDO::PARAM_STR);
        $statement->execute();
    }
    $query = "SELECT question_id, option FROM question_options 
              WHERE is_correct = true AND question_id IN (" . implode(',', $allQuestions) . ")";
    $statement = $pdo->prepare($query);
    $statement->execute();
    $correctAnswers = $statement->fetchAll(PDO::FETCH_ASSOC);

    $score = 0;
    foreach ($responses as $questionId => $option) {
        foreach ($correctAnswers as $answer) {
            if ($answer['question_id'] == $questionId && $answer['option'] == $option) {
                $score++;
                break; 
            }
        }
    }
    $status = $score >= 0.5 * count($allQuestions) ? true : false;
    $query = "INSERT INTO user_scoreboard(user_id, quiz_id, score, started_time, completion_time,status)
              VALUES (:user_id, :quiz_id, :score, :start_time, :end_time,:status)";
    $statement = $pdo->prepare($query);
    $statement->bindValue(':user_id', $userId, PDO::PARAM_INT);
    $statement->bindValue(':quiz_id', $quizId, PDO::PARAM_INT);
    $statement->bindValue(':score', $score, PDO::PARAM_INT);
    $statement->bindValue(':start_time', $startTime, PDO::PARAM_STR);
    $statement->bindValue(':end_time', $endTime, PDO::PARAM_STR);
    $statement->bindValue(':status', $status, PDO::PARAM_BOOL);
    $statement->execute();

    Response::showSuccessMessage("Quiz submitted successfully", 200);
} 
catch (Exception $e) {
    Response::showErrorMessage($e->getMessage(), 500);
}
