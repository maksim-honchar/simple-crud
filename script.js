// Знаходимо нашу форму та поле введення за їхніми ID у HTML
const todoForm = document.getElementById('todoForm');
const taskInput = document.getElementById('taskInput');

// Вішаємо слухача подій на відправку форми (працює і по кліку на кнопку, і по натисканю Enter)
todoForm.addEventListener('submit', function (event) {
    // Зупиняємо стандартну поведінку браузера, щоб сторінка не перезавантажувалась
    event.preventDefault();

    // забираємо текст з input і прибираємо пробіли по краях
    const taskText = taskInput.value.trim();

    // Якщо текст порожній нічого не робимо
    if (taskText == '') {
        return;
    }

    // Тимчасово вивидимо в браузер щоб перевірити, що все працює
    console.log('Клієнт зібрав текст задачі: ', taskText);



    // Відправляємо дані на сервер за допомогою fetch
    fetch('add_todo.php', {
        method: 'POST', //Метод надсилання
        headers: {
            'Content-Type': 'application/json; charset=utf-8' //Кажемо серверу, що відправляємо JSON
        },
        body: JSON.stringify({ task: taskText }) // Пакуємо наш текст у JSON-рядок {"task": "текст"}
    })
        .then(response => response.json()) // Чекаємо відповідь від сервера і разпаковуємо її з JSON
        .then(data => {
            console.log('сервер успішно відповів: ', data);

            // Очищуємо полве введення після відправки
            taskInput.value = '';
        })
        .catch(error => {
            console.error('Сталася помилка: ', error);
        })
})   