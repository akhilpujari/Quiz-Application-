<?php

require_once("./utils/validateToken.php");
require_once("./utils/response.php");

$user = validate_token(); 

$subject = $_POST['subject'];

if(empty($subject) || $subject == null || trim($subject) == ""){
    Response::showErrorMessage("Subject name is required",400);
}

try{
    $pdo = getPDO();
    $query = "INSERT INTO subjects (subject_name) VALUES ('$subject')";
    $statement = $pdo->prepare($query);
    $statement->execute();
    if($statement->rowCount()>0){
        Response::showSuccessMessage("Subject added Successfully",200);
    }
}
catch(PDOException $e){
    Response::showErrorMessage($e->getMessage(),400);
}

