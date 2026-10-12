const TASKS_KEY = "daymark-tasks";
const USER_KEY = "todo-user-name";

const loginView = document.getElementById("loginView");
const loginForm = document.getElementById("loginForm");
const loginName = document.getElementById("loginName");
const todoView = document.getElementById("todoView");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");

let tasks = readStoredTasks();
let activeFilter = "all";

function showTodo(name) {
  loginView.hidden = true;
  todoView.hidden = false;
  document.getElementById("userGreeting").textContent = `Hi, ${name}`;
}

function showLogin() {
  loginView.hidden = false;
  todoView.hidden = true;
  loginName.focus();
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = loginName.value.trim();
  if (name.length < 2) {
    loginName.setCustomValidity("Enter a name with at least 2 characters.");
    loginName.reportValidity();
    loginName.setCustomValidity("");
    return;
  }

  localStorage.setItem(USER_KEY, name);
  showTodo(name);
});

loginName.addEventListener("input", () => loginName.setCustomValidity(""));

document.getElementById("logoutButton").addEventListener("click", () => {
  localStorage.removeItem(USER_KEY);
  loginForm.reset();
  showLogin();
});

function readStoredTasks() {
  try {
    const storedTasks = JSON.parse(localStorage.getItem(TASKS_KEY) || "[]");
    return Array.isArray(storedTasks) ? storedTasks : [];
  } catch {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

function addTask() {
  const text = taskInput.value.trim();
  const taskError = document.getElementById("taskError");
  if (!text) {
    taskError.textContent = "Write a task before adding it.";
    taskInput.focus();
    return;
  }

  taskError.textContent = "";
  tasks.unshift({ id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), text, completed: false });
  taskInput.value = "";
  saveTasks();
  renderTasks();
  taskInput.focus();
}

document.getElementById("addTaskButton").addEventListener("click", addTask);
taskInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") addTask();
});
taskInput.addEventListener("input", () => {
  document.getElementById("taskError").textContent = "";
});

function renderTasks() {
  const visibleTasks = tasks.filter((task) => {
    if (activeFilter === "active") return !task.completed;
    if (activeFilter === "completed") return task.completed;
    return true;
  });

  taskList.replaceChildren();
  visibleTasks.forEach((task) => {
    const item = document.createElement("li");
    item.className = `task-item${task.completed ? " completed" : ""}`;

    const checkbox = document.createElement("input");
    checkbox.className = "task-check";
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", `Mark ${task.text} ${task.completed ? "incomplete" : "complete"}`);
    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const label = document.createElement("span");
    label.className = "task-text";
    label.textContent = task.text;

    item.append(checkbox, label);
    const deleteButton = document.createElement("button");
    deleteButton.className = "task-delete";
    deleteButton.type = "button";
    deleteButton.textContent = "×";
    deleteButton.setAttribute("aria-label", `Delete ${task.text}`);
    deleteButton.addEventListener("click", () => {
      tasks = tasks.filter((savedTask) => savedTask.id !== task.id);
      saveTasks();
      renderTasks();
    });
    item.append(deleteButton);
    taskList.append(item);
  });

  const completedCount = tasks.filter((task) => task.completed).length;
  const activeCount = tasks.length - completedCount;
  document.getElementById("taskCount").textContent = String(tasks.length);
  document.getElementById("allCount").textContent = String(tasks.length);
  document.getElementById("activeCount").textContent = String(activeCount);
  document.getElementById("completedCount").textContent = String(completedCount);
  document.getElementById("clearCompleted").hidden = completedCount === 0;
  document.getElementById("taskSummary").textContent = activeCount === 0 && tasks.length > 0 ? "Everything is checked off." : `${activeCount} ${activeCount === 1 ? "thing" : "things"} left to do.`;
  emptyState.hidden = visibleTasks.length > 0;
}

document.querySelectorAll(".filter-button").forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    document.querySelectorAll(".filter-button").forEach((filterButton) => {
      const selected = filterButton === button;
      filterButton.classList.toggle("active", selected);
      filterButton.setAttribute("aria-pressed", String(selected));
    });
    renderTasks();
  });
});

document.getElementById("clearCompleted").addEventListener("click", () => {
  tasks = tasks.filter((task) => !task.completed);
  saveTasks();
  renderTasks();
});

const savedName = localStorage.getItem(USER_KEY);
if (savedName) showTodo(savedName);
else showLogin();
renderTasks();