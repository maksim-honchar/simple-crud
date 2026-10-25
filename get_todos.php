<?php
// Підключаємо файл конфігурації бази даних
require_once 'db.php';

try {
    //Робимо запит до бази даних, щоб отримати всі задачі, відсортовані від найновіших до найстаріших
    $stmt = $pdo->query("SELECT * FROM todos ORDER BY id DESC");
    $todos = $stmt->fetchAll();

    // Встановлюємо заголовок, що відповідальність є JSON-форматом
    header('Content-Type: application/json; charset=utf-8');

    // Відправляємо дані клієнту у форматі JSON з підтримкою кирилиці
    echo json_encode($todos, JSON_UNESCAPED_UNICODE);
} catch (\PDOException $e) {
    // У разі помилки бази даних повертаємо статус 500 та JSON з описом помилки
    http_response_code(500);
    echo json_encode(['error' => 'Помилка при завантажені задач'], JSON_UNESCAPED_UNICODE);
}
