
// ===================================
// TASKFLOW - TO DO LIST APPLICATION
// ===================================

// Get HTML elements
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const priorityInput = document.getElementById("priorityInput");
const dateInput = document.getElementById("dateInput");

const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");
const emptyState = document.getElementById("emptyState");

// Statistics elements
const totalTasks = document.getElementById("totalTasks");
const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");

// Current date
document.getElementById("currentDate").textContent =
    new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });


// ===================================
// LOAD TASKS FROM LOCAL STORAGE
// ===================================

let tasks = [];

try {
    tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    if (!Array.isArray(tasks)) tasks = [];
} catch (error) {
    tasks = [];
}

tasks = tasks.map((task, index) => ({
    ...task,
    id: task.id || (Date.now().toString() + index),
    priority: task.priority || "Medium",
    dueDate: task.dueDate || "",
    completed: Boolean(task.completed)
}));

// Current filter
let currentFilter = "all";


// ===================================
// SAVE TASKS
// ===================================

function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));

    displayTasks();
}


// ===================================
// ADD NEW TASK
// ===================================

taskForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const taskName = taskInput.value.trim();

    if (taskName === "") {
        alert("Please enter a task!");
        return;
    }

    const newTask = {
        id: Date.now().toString() + Math.random().toString(36).slice(2),
        name: taskName,
        priority: priorityInput.value,
        dueDate: dateInput.value,
        completed: false
    };

    tasks.push(newTask);

    taskInput.value = "";
    dateInput.value = "";
    priorityInput.value = "Medium";

    saveTasks();

});


// ===================================
// DISPLAY TASKS
// ===================================

function displayTasks() {

    taskList.innerHTML = "";

    // Update statistics
    const total = tasks.length;

    const completed = tasks.filter(
        task => task.completed
    ).length;

    const pending = total - completed;

    totalTasks.textContent = total;
    completedTasks.textContent = completed;
    pendingTasks.textContent = pending;


    // Search tasks
    const searchText = searchInput.value.toLowerCase();

    let filteredTasks = tasks.filter(task =>
        task.name.toLowerCase().includes(searchText)
    );


    // Apply filter
    if (currentFilter === "pending") {
        filteredTasks = filteredTasks.filter(
            task => !task.completed
        );
    }

    if (currentFilter === "completed") {
        filteredTasks = filteredTasks.filter(
            task => task.completed
        );
    }


    // Empty state
    emptyState.style.display =
        filteredTasks.length === 0 ? "block" : "none";


    // Create task cards
    filteredTasks.forEach(task => {

        const li = document.createElement("div");

        li.className = "task-item";

        if (task.completed) {
            li.classList.add("done");
        }


        // Checkbox
        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";
        checkbox.className = "task-check";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", function() {

            task.completed = checkbox.checked;

            saveTasks();

        });


        // Task details
        const details = document.createElement("div");

        details.className = "task-details";

        const name = document.createElement("div");

        name.className = "task-name";
        name.textContent = task.name;

        const date = document.createElement("div");

        date.className = "task-date";

        if (task.dueDate) {

            date.textContent = "Due: " +
                new Date(task.dueDate + "T00:00:00")
                .toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                });

        } else {

            date.textContent = "No due date";

        }

        details.appendChild(name);
        details.appendChild(date);


        // Priority badge
        const priority = document.createElement("span");

        priority.className = "priority " +
            (["High", "Medium", "Low"].includes(task.priority)
                ? task.priority
                : "Medium");

        priority.textContent = task.priority || "Medium";


        // Action buttons
        const actions = document.createElement("div");

        actions.className = "task-actions";


        // Edit button
        const editBtn = document.createElement("button");

        editBtn.className = "action-btn edit-btn";
        editBtn.textContent = "Edit";

        editBtn.addEventListener("click", function() {

            editTask(task.id);

        });


        // Delete button
        const deleteBtn = document.createElement("button");

        deleteBtn.className = "action-btn delete-btn";
        deleteBtn.textContent = "Delete";

        deleteBtn.addEventListener("click", function() {

            deleteTask(task.id);

        });


        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);


        // Add all elements
        li.appendChild(checkbox);
        li.appendChild(details);
        li.appendChild(priority);
        li.appendChild(actions);

        taskList.appendChild(li);

    });

}


// ===================================
// EDIT TASK
// ===================================

function editTask(id) {

    const task = tasks.find(task => task.id === id);

    if (!task) return;

    const updatedName = prompt(
        "Enter updated task name:",
        task.name
    );

    if (updatedName === null) return;

    if (updatedName.trim() === "") {
        alert("Task name cannot be empty!");
        return;
    }

    task.name = updatedName.trim();

    saveTasks();

}


// ===================================
// DELETE TASK
// ===================================

function deleteTask(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) return;

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();

}


// ===================================
// SEARCH TASKS
// ===================================

searchInput.addEventListener("input", function() {

    displayTasks();

});


// ===================================
// FILTER TASKS
// ===================================

function setFilter(filter) {

    currentFilter = filter;

    // Update sidebar navigation
    document.querySelectorAll(".nav-link").forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.filter === filter
        );

    });

    // Update filter buttons
    document.querySelectorAll(".filter-btn").forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.filter === filter
        );

    });

    displayTasks();

}


// Sidebar filters
document.querySelectorAll(".nav-link").forEach(button => {

    button.addEventListener("click", function() {

        setFilter(this.dataset.filter);

    });

});


// Task list filters
document.querySelectorAll(".filter-btn").forEach(button => {

    button.addEventListener("click", function() {

        setFilter(this.dataset.filter);

    });

});


// ===================================
// INITIAL DISPLAY
// ===================================

displayTasks();
