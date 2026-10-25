<?php
// Підключаємо файл конфігурації бази даних
require_once 'db.php';

// Ловим сирий потік даних від клієнта (очікуємо JSON на кшталт {"id": 1})
$data = json_decode(file_get_contents('php://input'), true);

// Отримуємо id та перводимо його в ціле число для безпеки
$id = intval($data['id'] ?? 0);

// Перевіряємо чи переданий валідний ID
if ($id <= 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Невірний ID задачі.'], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    //  Готуємо безпечний SQL-запит на видалення за id
    $stmt = $pdo->prepare("DELETE FROM todos WHERE id = ?");
    $stmt->execute([$id]);

    // Встановлюємо заголовок JSON і відправляємо успішну відповідь
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['success' => true], JSON_UNESCAPED_UNICODE);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Помилка при видалені задачі.'], JSON_UNESCAPED_UNICODE);
}
