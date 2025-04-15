let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = "all";

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const prioritySelect = document.getElementById("prioritySelect");
const taskList = document.getElementById("taskList");
const themeToggle = document.getElementById("themeToggle");
const filterButtons = document.querySelectorAll(".filter");

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";

  const filtered = tasks
    .filter(task => {
      if (filter === "all") return true;
      if (filter === "active") return !task.completed;
      if (filter === "completed") return task.completed;
    })
    .sort((a, b) => {
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

  filtered.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = `task-item ${task.priority} ${task.completed ? "completed" : ""}`;

    const label = document.createElement("label");
    label.className = "task-label";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => toggleComplete(index));

    const span = document.createElement("span");
    span.textContent = task.text;

    label.append(checkbox, span);

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const editBtn = document.createElement("button");
    editBtn.innerHTML = "✏️";
    editBtn.title = "Edit Task";
    editBtn.addEventListener("click", () => editTask(index));

    const delBtn = document.createElement("button");
    delBtn.innerHTML = "🗑️";
    delBtn.title = "Delete Task";
    delBtn.addEventListener("click", () => deleteTask(index));

    actions.append(editBtn, delBtn);
    li.append(label, actions);
    taskList.appendChild(li);
  });
}

function addTask() {
  const text = taskInput.value.trim();
  const priority = prioritySelect.value;
  if (text === "") return;

  tasks.push({ text, priority, completed: false });
  taskInput.value = "";
  saveTasks();
  renderTasks();
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  if (confirm("Are you sure you want to delete this task?")) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  }
}

function editTask(index) {
  const current = tasks[index].text;
  const newText = prompt("Edit your task:", current);
  if (newText !== null) {
    const trimmed = newText.trim();
    if (trimmed !== "") {
      tasks[index].text = trimmed;
      saveTasks();
      renderTasks();
    }
  }
}

addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    filter = btn.dataset.filter;
    renderTasks();
  });
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  themeToggle.textContent = isDark ? "🌙" : "🌞";
});

renderTasks();
