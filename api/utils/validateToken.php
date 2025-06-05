<?php 
require_once __DIR__ . "\\response.php";
require_once __DIR__ . "\\db.php";


function validate_token(){
    $headers = apache_request_headers();
    $token = $headers["Authorization"];
    if(!isset($token)) {
        Response::showErrorMessage("no token",404);
    }

    $pdo = getPDO();
    $query = "SELECT * FROM users_details WHERE token = :token";
    $stmt = $pdo->prepare($query);
    $stmt->bindValue(':token', $token);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if(!$result){
        Response::showErrorMessage("invalid token",404,$token);
    }
    unset($result['password']);
    return $result;
}
