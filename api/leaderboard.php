<?php

require_once("./utils/validateToken.php");
require_once("./utils/response.php");   
require_once("./utils/db.php");

$userinfo = validate_token();
$inputData = json_decode(file_get_contents("php://input"), true);

if (!isset($inputData['subject']) || !isset($inputData['quizTitle'])) {
    Response::showErrorMessage("Subject and Quiz Title are required", 400);
}

try {
    $subject = $inputData['subject'];
    $quizTitle = $inputData['quizTitle'];
    $pdo = getPDO();

    $query = "SELECT u.username, 
                     MAX(us.score) AS score, 
                     CONCAT(
                     FLOOR(MIN(EXTRACT(EPOCH FROM (us.completion_time - us.started_time))) / 60), ' min ', 
                     FLOOR(MIN(EXTRACT(EPOCH FROM (us.completion_time - us.started_time))) % 60), ' sec'
                 ) AS time_taken 
              FROM user_scoreboard us
              JOIN users_details u ON us.user_id = u.id
              JOIN quizzes q ON us.quiz_id = q.id
              JOIN subjects s ON q.subject_id = s.id
              WHERE s.subject_name = :subject AND q.quiz_title = :quizTitle AND us.status = true
              GROUP BY u.username
              ORDER BY score DESC, time_taken ASC";

    $statement = $pdo->prepare($query);
    $statement->bindValue(':subject', $subject, PDO::PARAM_STR);
    $statement->bindValue(':quizTitle', $quizTitle, PDO::PARAM_STR);
    $statement->execute();
    
    $leaderboard = $statement->fetchAll(PDO::FETCH_ASSOC);

    Response::showSuccessMessage("Leaderboard fetched successfully", 200, $leaderboard);
} 
catch (Exception $e) {
    Response::showErrorMessage($e->getMessage(), 500);
}

?>
