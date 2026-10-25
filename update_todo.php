<?php
// Підключаємо файл конфігурації
require_once 'db.php';

// Ловимо сирий потік даних від клієнта (очікеємо JSON на кшталт {"id":1, "task": "Новий текст"})
$data = json_decode(file_get_contents('php://input'), true);

// Отримуємо id та переводимо його в ціле число для безпеки, а також текст задачі
$id = intval($data['id'] ?? 0);
$task = trim($data['task'] ?? '');

// Перевіряємо чи переданий ID валідний та чи не порожній текст
if ($id <= 0 || $task === '') {
    http_response_code(400);
    echo json_encode(['error' => 'Невірний ID або текст задачі'], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    //Готуємо безпечний SQL-запит на оновлення задачі за її id
    $stmt = $pdo->prepare("UPDATE todos SET task = ? WHERE id = ?");
    $stmt->execute([$task, $id]);

    // Встановлюємо заголовок JSON і відправляємо на клієнт успішну відповідь
    header('Content-Type: application/json; charset=utf-8;');
    echo json_encode(['success' => true], JSON_UNESCAPED_UNICODE);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Помилка при оновлені задачі'], JSON_UNESCAPED_UNICODE);
}
