<?php

require_once("./utils/validateToken.php");
require_once("./utils/response.php");
require_once("./utils/db.php");

$userinfo = validate_token();
$pdo = getPDO();

if (!isset($_POST['quizId'])) {
    Response::showErrorMessage("Quiz ID is required", 400);
}

try {
    $quizId = $_POST['quizId'];
    $userId = $userinfo['id'];
    $query = "SELECT COUNT(*) AS total_questions FROM questions WHERE quiz_id = :quiz_id";
    $statement = $pdo->prepare($query);
    $statement->bindValue(':quiz_id', $quizId, PDO::PARAM_INT);
    $statement->execute();
    $totalQuestions = $statement->fetch(PDO::FETCH_ASSOC)['total_questions'];
    $query = "SELECT score, started_time, completion_time,status FROM user_scoreboard 
              WHERE user_id = :user_id AND quiz_id = :quiz_id
              ORDER BY completion_time DESC 
              LIMIT 1";
    $statement = $pdo->prepare($query);
    $statement->bindValue(':user_id', $userId, PDO::PARAM_INT);
    $statement->bindValue(':quiz_id', $quizId, PDO::PARAM_INT);
    $statement->execute();
    $result = $statement->fetch(PDO::FETCH_ASSOC);

    if (!$result) {
        Response::showErrorMessage("No result found for this quiz", 400);
    }
    Response::showSuccessMessage("Quiz result fetched successfully", 200, [
        "totalQuestions" => $totalQuestions,
        "score" => $result['score'],    
        "startTime" => $result['started_time'],
        "endTime" => $result['completion_time'],
        "status" => $result['status'],
    ]);

} catch (Exception $e) {
    Response::showErrorMessage("Something went wrong while fetching quiz result", 500);
}
