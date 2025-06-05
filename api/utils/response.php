<?php

class Response{
    public static function showSuccessMessage($message = "Success",$status = 200, $data = []){
        http_response_code($status);
        echo json_encode([
            "status" => $status,
            "message" => $message,
            "data" => $data
        ]);
        exit;
    }
    public static function showErrorMessage($message = "Errro",$status = 400,$data = []){
        http_response_code($status);
        echo json_encode([
            "status" => $status,
            "message" => $message,
            "data" => $data
        ]);
        exit;
    }
}