<?php
require_once("./utils/response.php");
require_once("./utils/validateToken.php");

try {
    $user = validate_token();

    if (!isset($_GET['subject']) || empty($_GET['subject'])) {
        throw new Exception("Subject is required", 400);
    }

    $subject = $_GET['subject'];
    $pdo = getPDO();
    $quizQuery = "SELECT id FROM quizzes WHERE subject_id = :subject";
    $quizStmt = $pdo->prepare($quizQuery);
    $quizStmt->execute(['subject' => $subject]);
    $quizIds = $quizStmt->fetchAll(PDO::FETCH_COLUMN);

    if (empty($quizIds)) {
        throw new Exception("No quizzes found for this subject", 404);
    }

    $quizIdsString = implode(',', $quizIds); 

    $scoreQuery = "
        SELECT 
            SUM(CASE WHEN status = true THEN 1 ELSE 0 END) AS passed,
            SUM(CASE WHEN status = false THEN 1 ELSE 0 END) AS failed
        FROM user_scoreboard
        WHERE quiz_id IN ($quizIdsString)
    ";

    $stmt = $pdo->query($scoreQuery);
    $scores = $stmt->fetch(PDO::FETCH_ASSOC);
    $notAttendedQuery = "
        SELECT COUNT(*) FROM users_details 
        WHERE id NOT IN (
            SELECT DISTINCT user_id FROM user_scoreboard WHERE quiz_id IN ($quizIdsString)
        )
    ";
    $notAttendedStmt = $pdo->query($notAttendedQuery);
    $notAttended = $notAttendedStmt->fetchColumn();
    $response = [
        'passed' => (int)$scores['passed'],
        'failed' => (int)$scores['failed'],
        'not_attended' => (int)$notAttended
    ];

    Response::showSuccessMessage("Stats fetched", 200, $response);

} catch (Exception $e) {
    Response::showErrorMessage($e->getMessage(), 500);
}
?>
