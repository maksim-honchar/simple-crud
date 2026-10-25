<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style.css">
    <title>To-Do CRUD</title>
</head>

<body>
    <h2>To-Do List</h2>
    <form id="todoForm">
        <input type="text" id="taskInput" placeholder="Нова задача..." required>
        <button type="submit">Додати</button>
    </form>
    <ul id="todoList"></ul>

    <script src="script.js"></script>
</body>

</html>