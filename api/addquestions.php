<?php
require_once("./utils/validateToken.php");
require_once("./utils/response.php");

try {
    $user = validate_token();
    $inputData = json_decode(file_get_contents("php://input"), true);
    if (empty($inputData['questions']) || !is_array($inputData['questions'])) {
        Response::showErrorMessage("Questions array is required and must be non-empty", 400);
    }
    if (empty($inputData['quizId'])) {
        Response::showErrorMessage("quizId is required", 400);
    }

    $pdo = getPDO();
    $pdo->beginTransaction();

    $insertQuestion = $pdo->prepare("
        INSERT INTO questions (quiz_id, difficulty_level_id, question_text)
        VALUES (:quiz_id, :difficulty_level_id, :question_text)
    ");
    $insertOption = $pdo->prepare("
        INSERT INTO question_options (question_id, option_text, option, is_correct)
        VALUES (:question_id, :option_text, :option, :is_correct)
    ");

    foreach ($inputData['questions'] as $q) {

        if (empty($q['question']) || empty($q['difficultyLevel']) || 
            empty($q['options']) || !is_array($q['options']) || empty($q['correctOption'])) {
            throw new Exception("Invalid question structure");
        }
        $insertQuestion->execute([
            ':quiz_id' => $inputData['quizId'],
            ':difficulty_level_id' => $q['difficultyLevel'],
            ':question_text' => $q['question']
        ]);
        $questionId = $pdo->lastInsertId();
        
        foreach ($q['options'] as $opt) {
            if (empty($opt['text']) || empty($opt['letter'])) {
                throw new Exception("Option text and letter are required");
            }
            $isCorrect = (strtoupper($q['correctOption']) === strtoupper($opt['letter']));
            
            $insertOption->bindValue(':question_id', $questionId, PDO::PARAM_INT);
            $insertOption->bindValue(':option_text', $opt['text'], PDO::PARAM_STR);
            $insertOption->bindValue(':option', strtoupper($opt['letter']), PDO::PARAM_STR);
            $insertOption->bindValue(':is_correct', $isCorrect, PDO::PARAM_BOOL);
            
            $insertOption->execute();
        }
    }

    $pdo->commit();
    Response::showSuccessMessage("Questions added successfully", 200, [
        'insertedCount' => count($inputData['questions'])
    ]);

} catch (PDOException $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    Response::showErrorMessage("Database error: " . $e->getMessage(), 500);

} catch (Exception $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    Response::showErrorMessage($e->getMessage(), 400);
}