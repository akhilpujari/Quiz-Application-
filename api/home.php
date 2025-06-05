<?php
require_once("./utils/validateToken.php");
require_once("./utils/response.php");
require_once("./utils/db.php");


$user = validate_token();


try{
    $pdo = getPDO();
    $query = "SELECT * FROM subjects WHERE status = true";
    $statement = $pdo->prepare($query);
    $statement->execute();
    $subjects = $statement->fetchAll(PDO::FETCH_ASSOC);
    if(!$subjects){
        Response::showErrorMessage("Something went wrong",400);
    }

    $query = "SELECT * FROM quizzes WHERE status = true";
    $statement1 = $pdo->prepare($query);
    $statement1->execute();
    $quizzes = $statement1->fetchAll(PDO::FETCH_ASSOC);
    if(!$quizzes){
        Response::showErrorMessage("Something went wrong",400);
    }
    else{
        $data = [
            "subjects" => $subjects,
            "quizzes" => $quizzes
        ];
        Response::showSuccessMessage("Subjects fetched successfully",200,$data);
    }
}
catch(PDOException $e){
    Response::showErrorMessage($e->getMessage(),400);
}