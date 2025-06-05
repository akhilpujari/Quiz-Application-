<?php

require_once("./utils/validateToken.php");
require_once("./utils/response.php");

$user = validate_token();

$subjectId = $_POST['subjectId'];
$quizTitle = $_POST['quizTitle'];
$timeLimit = $_POST['timeLimit'];

try{
    $pdo = getPDO();
    $query = "INSERT INTO quizzes(subject_id,quiz_title,time_limit) VALUES (:subjectId,:quizTitle,:timeLimit)";
    $statement = $pdo->prepare($query);
    $statement->bindValue(':subjectId',$subjectId,PDO::PARAM_INT);
    $statement->bindValue(':quizTitle',$quizTitle,PDO::PARAM_STR);
    $statement->bindValue(':timeLimit',$timeLimit);
    $statement->execute();
    if($statement->rowCount() < 0){
        Response::showErrorMessage("not updated",400);
    }
    Response::showSuccessMessage("Quiz added successfully",200,[]);
}
catch(Exception $e){
    Response::showErrorMessage($e->getMessage(),400);
}