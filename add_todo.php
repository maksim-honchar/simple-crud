<?php
// Підключаємо об'єкт конфігурації бази даних (наш об'єкт $pdo)
require_once 'db.php';

// Ловимо посилку від клієнта: читаємо сирий потік даних і перетворюємо JSON у масив PHP
$data = json_decode(file_get_contents('php://input'), true);

// Повторно на бекенді робимо перевірки, бекенд фронту не довіряє - ЦЕ ПРАВИЛО! 
$task = trim($data['task'] ?? '');

if ($task === '') {
    http_response_code(400);
    echo json_encode(['error' => 'Текст задачі не може бути порожнім.'], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    // Готуємо безпечний SQL-запит (захист від SQL-ін'єкцій через плейсхолдер ?)
    $stmt = $pdo->prepare("INSERT INTO todos (task) VALUES (?)");

    // Виконуємо запит, тут звичайний string
    $stmt->execute([$task]);

    // Отримуємо ID щойно створеного запису в базі даних
    $newId = $pdo->lastInsertId();

    // Встановлюємо заголовок для клієнта (браузера), що відповідь буде у форматі JSON
    header('Content-Type: application/json; charset=utf-8');

    // Відправляємо на фронтенд успішну відповідь разом з id та текстом
    echo json_encode([
        'success' => true,
        'id' => $newId,
        'task' => $task
    ], JSON_UNESCAPED_UNICODE);
} catch (\PDOException $n) {
    // Якщо сталося помилка з базою даних, повертаємо статус 500
    http_response_code(500);
    echo json_encode(['error' => 'Помилка при додавані задачі'], JSON_UNESCAPED_UNICODE);
}
