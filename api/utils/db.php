<?php
require_once __DIR__ . "\\response.php";
const DB_HOST = "localhost";
const DB_PORT = 5432;
const DB_NAME = "quiz";
const DB_USERNAME = "******";
const DB_PASSWORD = "*******";

function getPDO()
{
    try{
        $dsn = "pgsql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME;
        $pdo = new PDO($dsn, DB_USERNAME, DB_PASSWORD, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
        return $pdo;
    }
    catch (PDOException $e){
        Response::showErrorMessage( "database error",500);
    }
}