const taskInput = document.getElementById("taskInput");
const prioritySelect = document.getElementById("prioritySelect");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const filterButtons = document.querySelectorAll(".filter");
const themeToggle = document.getElementById("themeToggle");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// Priority sorting map
const priorityOrder = {
  high: 3,
  medium: 2,
  low: 1
};

addTaskBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});

filterButtons.forEach(btn =>
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTasks();
  })
);

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

function addTask() {
  const text = taskInput.value.trim();
  const priority = prioritySelect.value;
  if (!text) return;

  tasks.push({ id: Date.now(), text, priority, completed: false });
  saveTasks();
  taskInput.value = "";
  renderTasks();
}

function renderTasks() {
  taskList.innerHTML = "";

  let filtered = tasks.filter(task =>
    currentFilter === "all" ? true :
    currentFilter === "completed" ? task.completed :
    !task.completed
  );

  // Sort by priority: High > Medium > Low
  filtered.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);

  filtered.forEach((task) => {
    const li = document.createElement("li");
    li.className = `task-item ${task.priority} ${task.completed ? "completed" : ""}`;

    const label = document.createElement("label");
    label.className = "task-label";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => toggleComplete(task.id));

    const span = document.createElement("span");
    span.textContent = task.text;

    label.append(checkbox, span);

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const editBtn = document.createElement("button");
    editBtn.innerHTML = "✏️";
    editBtn.title = "Edit Task";
    editBtn.addEventListener("click", () => editTask(task.id));

    const delBtn = document.createElement("button");
    delBtn.innerHTML = "🗑️";
    delBtn.title = "Delete Task";
    delBtn.addEventListener("click", () => deleteTask(task.id));

    actions.append(editBtn, delBtn);
    li.append(label, actions);
    taskList.appendChild(li);
  });
}

function toggleComplete(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
  }
}

function deleteTask(id) {
  if (confirm("Are you sure you want to delete this task?")) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
  }
}

function editTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    const newText = prompt("Edit your task:", task.text);
    if (newText !== null && newText.trim() !== "") {
      task.text = newText.trim();
      saveTasks();
      renderTasks();
    }
  }
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

renderTasks();
