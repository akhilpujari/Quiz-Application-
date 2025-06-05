<?php
require_once("./utils/response.php");
require_once("./utils/validateToken.php");

try {
    $user = validate_token();
    $userId = $user['id'];

    $pdo = getPDO();

    $query = "
    SELECT 
        q.quiz_title AS quiz_title,
        us.quiz_id,
        MAX(us.score) AS best_score,
        COUNT(que.id) AS total_questions
    FROM 
        user_scoreboard us
    JOIN 
        quizzes q ON us.quiz_id = q.id
    LEFT JOIN 
        questions que ON q.id = que.quiz_id
    WHERE 
        us.user_id = :user_id AND us.status = TRUE
    GROUP BY 
        us.quiz_id, q.quiz_title
";

    $statement = $pdo->prepare($query);
    $statement->bindValue(':user_id', $userId, PDO::PARAM_INT);
    $statement->execute();
    $certifications = $statement->fetchAll(PDO::FETCH_ASSOC);

    if (!$certifications) {
        throw new Exception("No certifications found", 404);
    }

    Response::showSuccessMessage("Certifications generated", 200, $certifications);
} catch (Exception $e) {
    Response::showErrorMessage($e->getMessage(),  500);
}
