<?php

require_once("./utils/validateToken.php");
require_once("./utils/response.php");
require_once("./utils/db.php");

$user = validate_token();

try {
    if (!isset($_POST['quiz_id'])) {
        Response::showErrorMessage("quiz_id required", 500);
    }
    $quiz_id = $_POST['quiz_id'];
    $pdo = getPDO();
    $query = "SELECT q.id, q.question_text, d.difficulty_type AS difficulty_level 
              FROM questions q
              JOIN difficulty_levels d ON d.id = q.difficulty_level_id 
              WHERE q.quiz_id = :quiz_id AND q.status = true
              ORDER BY q.id ASC";

    $statement = $pdo->prepare($query);
    $statement->bindValue(':quiz_id', $quiz_id, PDO::PARAM_INT);
    $statement->execute();
    $questions = $statement->fetchAll(PDO::FETCH_ASSOC);

    if (!$questions) {
        Response::showErrorMessage("No questions found", 500);
    }
    foreach ($questions as &$question) {
        $question_id = $question['id'];

        $query = "SELECT id, option_text, option 
                  FROM question_options 
                  WHERE question_id = :question_id";

        $statement = $pdo->prepare($query);
        $statement->bindValue(':question_id', $question_id, PDO::PARAM_INT);
        $statement->execute();
        $question['options'] = $statement->fetchAll(PDO::FETCH_ASSOC);
    }

    Response::showSuccessMessage("Questions fetched successfully", 200, $questions);

} catch (PDOException $e) {
    Response::showErrorMessage($e->getMessage(), 500);
}
