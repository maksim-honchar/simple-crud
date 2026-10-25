// Знаходимо нашу форму та поле введення за їхніми ID у HTML
const todoForm = document.getElementById('todoForm');
const taskInput = document.getElementById('taskInput');
const todoList = document.getElementById('todoList');

// Функція для завантаєення та рендерінгу задач із сервера 
async function loadTodos() {
    try {
        const response = await fetch('get_todos.php');
        const todos = await response.json();

        // Очищаємо перед завантаженням щоб не було дублів
        todoList.innerHTML = '';

        // Перебираємо масив задач і рендерим їх
        todos.forEach(todo => {
            const li = document.createElement('li');

            // Створюємо текст задачі
            const span = document.createElement('span');
            span.textContent = todo.task;

            // Кнопка редагування/збереження
            const editBtn = document.createElement('button');
            editBtn.textContent = 'Редагувати';

            editBtn.addEventListener('click', async function () {
                // Якщо кнопка в режимі "Редагування"
                if (editBtn.textContent === 'Редагувати') {
                    // Створюємо input для редагування
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.value = todo.task;

                    // Замінюємо текстовий span на інпут всередені li
                    li.replaceChild(input, span);
                    input.focus();
                    editBtn.textContent = 'Зберегти';
                } else {
                    // Якщо кнопка в режимі "Зберегти" - дістаємо значенняя з інпуту
                    const input = li.querySelector('input');
                    const newTaskText = input.value.trim();

                    if (newTaskText !== '') {
                        await updateTodo(todo.id, newTaskText);
                    }
                }
            })

            // Створюємо кнопку видалення для кожної задачі
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Видалити';
            li.appendChild(span);
            li.appendChild(deleteBtn);
            li.appendChild(editBtn);
            todoList.appendChild(li);

            // Вішуємо слухача подій на кнопку видалення
            deleteBtn.addEventListener('click', function () {
                deleteTodo(todo.id);
            });

        });
    } catch (error) {
        console.error('Помилка при завантажені задач', error);
    }
}

// Функція оновлення задачі на бекенді
async function updateTodo(id, newTask) {
    try {
        const response = await fetch('update_todo.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({ id, task: newTask })
        });

        const result = await response.json();

        if (result.success) {
            await loadTodos(); // Перемальовуємо актуальний список із бази
        }
    } catch (error) {
        console.error('Помилка при редагуванні:', error);
    }
}

async function deleteTodo(id) {
    try {
        const response = await fetch('delete_todo.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({ id: id })
        });

        const result = await response.json();

        if (result.success) {
            // Після успішного видалення оновлюємо список на екрані
            await loadTodos();
        }
    } catch (error) {
        console.error('Помилка при видалені', error);
    }
}

// Викликаємо функцію одразу при завантажені сторінки
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