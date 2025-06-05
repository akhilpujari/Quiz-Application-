<?php 

require_once 'utils/db.php';
require_once 'utils/response.php';

$user = validate_token();

try{
    $pdo = getPDO();
    $query = "DELETE token FROM users_details WHERE id = $user[id]";
    $statement = $pdo->prepare($query);
    $statement->execute();
    if($statement->rowCount() > 0){
        Response::showSuccessMessage("Logout successful",200);
    }
    else{
        Response::showErrorMessage("Something went wrong",400);
    }
}
catch(PDOException $e){
    Response::showErrorMessage($e->getMessage(),400);
}