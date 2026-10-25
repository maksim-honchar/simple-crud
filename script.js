// Знаходимо нашу форму та поле введення за їхніми ID у HTML
const todoForm = document.getElementById('todoForm');
const taskInput = document.getElementById('taskInput');
const todoList = document.getElementById('todoList');

//Функція для завантаєення та рендерінгу задач із сервера 
async function loadTodos() {
    try {
        const response = await fetch('get_todos.php');
        const todos = await response.json();

        // Очищаємо перед завантаженням щоб не було дублів
        todoList.innerHTML = '';

        // Перебираємо масив задач і рендерим їх
        todos.forEach(todo => {
            const li = document.createElement('li');
            li.textContent = todo.task;
            todoList.appendChild(li);
        });
    } catch (error) {
        console.error('Помилка при завантажені задач', error);
    }
}

//Викликаємо функцію одразу при завантажені сторінки
loadTodos();

// Вішаємо слухача подій на відправку форми (працює і по кліку на кнопку, і по натисканю Enter)
todoForm.addEventListener('submit', async function (event) {
    // Зупиняємо стандартну поведінку браузера, щоб сторінка не перезавантажувалась
    event.preventDefault();

    // забираємо текст з input і прибираємо пробіли по краях
    const taskText = taskInput.value.trim();

    // Якщо текст порожній нічого не робимо
    if (taskText == '') {
        return;
    }

    try {
        // Відправляємо нову задачу на сервер через fetch з await
        const response = await fetch('add_todo.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({ task: taskText })
        });

        const data = await response.json();

        if (data.success) {
            // Очищуємо поле ведення
            taskInput.value = '';
            await loadTodos();
        }
    } catch (error) {
        console.error('Сталася помилка', error);
    }
})   