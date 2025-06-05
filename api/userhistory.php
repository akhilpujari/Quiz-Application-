<?php
require_once("./utils/response.php");
require_once("./utils/validateToken.php");

try {
    $user = validate_token();
    
    $pageNumber =(int) ($_GET['page'] ?? 1);
    $limit = 10;
    $offset = ($pageNumber - 1) * $limit;

    $pdo = getPDO();
    $query = "SELECT u.id AS user_id, q.quiz_title, u.username, us.score, us.started_time, us.completion_time, us.status 
              FROM user_scoreboard AS us 
              INNER JOIN quizzes AS q ON us.quiz_id = q.id 
              INNER JOIN users_details AS u ON us.user_id = u.id 
              ORDER BY user_id ASC 
              LIMIT :limit OFFSET :offset";

    $statement = $pdo->prepare($query);
    $statement->bindValue(':limit', $limit, PDO::PARAM_INT);
    $statement->bindValue(':offset', $offset, PDO::PARAM_INT);
    $statement->execute();

    $result = $statement->fetchAll(PDO::FETCH_ASSOC);
    Response::showErrorMessage("data fetched",200,$result);

} catch(Exception $e) {
    Response::showErrorMessage("Error: " . $e->getMessage(), 400);
}
