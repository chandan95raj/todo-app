document.addEventListener('DOMContentLoaded', loadTasks);

const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const allFilter = document.getElementById('allFilter');
const activeFilter = document.getElementById('activeFilter');
const completedFilter = document.getElementById('completedFilter');


addTaskBtn.addEventListener('click', addTask);
allFilter.addEventListener('click', () => filterTasks('all'));
activeFilter.addEventListener('click', () => filterTasks('active'));
completedFilter.addEventListener('click', () => filterTasks('completed'));

// Load from localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => displayTask(task));
}

// Add new task
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText) {
        const task = { text: taskText, completed: false };
        displayTask(task);
        saveTask(task);
        taskInput.value = '';
    }
}

// Display tasks
function displayTask(task) {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.classList.add('form-check-input', 'me-2');
    checkbox.addEventListener('change', () => toggleComplete(task, li));

    const span = document.createElement('span');
    span.textContent = task.text;
    if (task.completed) {
        span.classList.add('completed');
    }

    const iconsDiv = document.createElement('div');

    
    const editBtn = document.createElement('i');
    editBtn.classList.add('bi', 'bi-pencil-square', 'me-2', 'text-primary');
    editBtn.style.cursor = 'pointer';
    editBtn.addEventListener('click', () => editTask(task, span));

    
    const deleteBtn = document.createElement('i');
    deleteBtn.classList.add('bi', 'bi-trash', 'text-danger');
    deleteBtn.style.cursor = 'pointer';
    deleteBtn.addEventListener('click', () => deleteTask(task, li));

    iconsDiv.appendChild(editBtn);
    iconsDiv.appendChild(deleteBtn);

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(iconsDiv);

    taskList.appendChild(li);
}

// Edit task functionality
function editTask(task, span) {
    const newTaskText = prompt("Edit task:", task.text);
    if (newTaskText !== null && newTaskText.trim() !== "") {
        task.text = newTaskText.trim();
        span.textContent = task.text;
        updateTaskInStorage(task);
    }
}


// Save task to localStorage
function saveTask(task) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Toggle task completion
function toggleComplete(task, li) {
    task.completed = !task.completed;
    updateTaskInStorage(task);
    li.querySelector('span').classList.toggle('completed', task.completed);
}

// Delete task
function deleteTask(task, li) {
    li.remove();
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    const updatedTasks = tasks.filter(t => t.text !== task.text);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
}

// Update task in localStorage
function updateTaskInStorage(updatedTask) {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach(task => {
        if (task.text === updatedTask.text) {
            task.completed = updatedTask.completed;
        }
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function filterTasks(filter) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    taskList.innerHTML = '';

    tasks.forEach(task => {
        if (filter === 'all' || (filter === 'active' && !task.completed) || (filter === 'completed' && task.completed)) {
            displayTask(task);
        }
    });
}
