<?php

require_once("./utils/db.php");
require_once("./utils/response.php");

if($_SERVER["REQUEST_METHOD"] != "POST"){
    Response::showErrorMessage("Sever Error not found",404);
}
if(!isset($_POST["firstname"]) || empty($_POST["firstname"])|| trim($_POST["firstname"]) == ""){
    Response::showErrorMessage("firstname required",404);
}

if(!isset($_POST["lastname"]) || empty($_POST["lastname"])|| trim($_POST["lastname"]) == ""){
    Response::showErrorMessage("lastname required",404);
}

if(!isset($_POST["username"]) || empty($_POST["username"])|| trim($_POST["username"]) == ""){
    Response::showErrorMessage("username required",404);
}
if(!isset($_POST["password"]) || empty($_POST["password"])|| trim($_POST["password"]) == ""){
    Response::showErrorMessage("password required",404);
}
if(!isset($_POST["confirm_password"]) || empty($_POST["confirm_password"]) || trim($_POST["confirm_password"]) == ""){
    Response::showErrorMessage("confirm password required",404);
}

if($_POST["password"] !== $_POST["confirm_password"]){
    Response::showErrorMessage("same password required",404);
}
try{
    $firstname = $_POST["firstname"];
    $lastname = $_POST["lastname"];
    $username = $_POST["username"];
    $password = md5($_POST["password"]);
    $pdo = getPDO();
    $query = "INSERT INTO users_details(firstname,lastname,username,password) VALUES (:firstname,:lastname,:username,:password)";
    $statement = $pdo->prepare($query);
    $statement->bindValue(":firstname", $firstname, PDO::PARAM_STR);
    $statement->bindValue(":lastname", $lastname, PDO::PARAM_STR);
    $statement->bindValue(":username", $username, PDO::PARAM_STR);
    $statement->bindValue(":password", $password, PDO::PARAM_STR);
    $statement->execute();

    Response::showSuccessMessage(" successfull",200);
}
catch(PDOException $e){
    Response::showErrorMessage($e->getMessage(),404);
}