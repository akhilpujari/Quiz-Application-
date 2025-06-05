<?php

require_once("./utils/db.php");
require_once("./utils/response.php");
require_once("./generateToken.php");

if($_SERVER["REQUEST_METHOD"] != "POST"){
    Response::showErrorMessage("Sever Error not found",404);
}

if(!isset($_POST["username"])|| empty($_POST["username"]) || trim($_POST["username"]) == ""){
    Response::showErrorMessage("username required",404);
}
if(!isset($_POST["password"]) ||  empty($_POST["password"]) || trim($_POST["password"]) == ""){
    Response::showErrorMessage("password required",404);
}

$username = $_POST["username"];
$password = md5($_POST["password"]);

try{
$pdo = getPDO();
$query = "SELECT * FROM users_details WHERE username = :username AND password = :password AND role = 'admin'";
$statement = $pdo->prepare($query);
$statement->bindParam("username", $username, PDO::PARAM_STR);
$statement->bindParam("password", $password, PDO::PARAM_STR);

$statement->execute();
$data = $statement->fetch(PDO::FETCH_ASSOC);

if(!$data){
    Response::showErrorMessage("invalid credentails ",404);
}

    $token = generateToken();
    $data["token"] = $token;
    unset($data["password"]);

    $query = "UPDATE  users_details SET token = :token WHERE id = :id";

    $statement = $pdo->prepare($query);
    $statement->bindValue(":token",$token, PDO::PARAM_STR);
    $statement->bindValue(":id",$data["id"], PDO::PARAM_STR);
    $statement->execute();

    Response::showSuccessMessage("Logged in Successfully",200, $data);
}
catch(PDOException $e){
    Response::showErrorMessage($e->getMessage(),500);
}



