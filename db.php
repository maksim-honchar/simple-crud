<?php
// Параметри підключення ло бази даних
$host = 'localhost';
$db = 'simple_crud';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

// Формуємо DSN (Data Source Name) з урахуванням кодування для захисту від кострубатих символів
$dsn = "mysql:host=$host;dbname=$db;charset=$charset";

// Налаштування PDO для безпечної та перебачуваної 
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, // Викидати винятки при помилка SQL
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC, // Повертати дані у вигляді асоциативних масивів
    PDO::ATTR_EMULATE_PREPARES => false // Використовувати справжніпідготовлені масиви бази
];

try {
    // Створюємо екземпляр PDO
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    //У реальних проектах тут роблять логування помилки, а користувачу показують загальне повідомлення
    http_response_code(500);
    echo json_encode(['error' => 'Помилка підключення до бази даних.']);
}
