 const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

let currentFilter = "all";

// Add task when pressing Enter
taskInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addTask();
  }
});

// Load tasks when page loads
document.addEventListener("DOMContentLoaded", loadTasks);

function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === "") return;

  const task = {
    id: Date.now(),
    text: taskText,
    completed: false
  };

  saveTask(task);
  taskInput.value = "";
  refreshList();
}

function renderTask(task) {
  const li = document.createElement("li");

  // Animation starting state
  li.style.opacity = "0";
  li.style.transform = "translateY(10px)";

  li.textContent = task.text;
  li.dataset.id = task.id;

  if (task.completed) {
    li.classList.add("completed");
  }

  li.addEventListener("click", () => toggleTask(task.id));

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "X";
  deleteBtn.classList.add("delete-btn");

  deleteBtn.onclick = (e) => {
    e.stopPropagation();
    deleteTask(task.id);
  };

  li.appendChild(deleteBtn);
  taskList.appendChild(li);

  // Animation ending state
  setTimeout(() => {
    li.style.transition = "all 0.3s ease";
    li.style.opacity = "1";
    li.style.transform = "translateY(0)";
  }, 10);
}

function toggleTask(id) {
  let tasks = getTasks();

  tasks = tasks.map(task =>
    task.id === id
      ? { ...task, completed: !task.completed }
      : task
  );

  localStorage.setItem("tasks", JSON.stringify(tasks));
  refreshList();
}

function deleteTask(id) {
  const li = document.querySelector(`[data-id='${id}']`);

  li.style.transition = "all 0.3s ease";
  li.style.opacity = "0";
  li.style.transform = "translateX(20px)";

  setTimeout(() => {
    let tasks = getTasks().filter(task => task.id !== id);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    refreshList();
  }, 300);
}

function saveTask(task) {
  const tasks = getTasks();
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

function loadTasks() {
  refreshList();
}

function refreshList() {
  taskList.innerHTML = "";
  let tasks = getTasks();

  if (currentFilter === "active") {
    tasks = tasks.filter(task => !task.completed);
  }

  if (currentFilter === "completed") {
    tasks = tasks.filter(task => task.completed);
  }

  tasks.forEach(renderTask);
  updateCounter();

  if (tasks.length === 0) {
    taskList.innerHTML = "<p class='empty'>No tasks yet</p>";
  }
}

function updateCounter() {
  const tasks = getTasks();
  const remaining = tasks.filter(task => !task.completed).length;

  document.getElementById("taskCounter").textContent =
    remaining + " task(s) remaining";
}

function setFilter(filter) {
  currentFilter = filter;

  // Highlight active filter button
  document.querySelectorAll(".filters button").forEach(btn => {
    btn.classList.remove("active");
  });

  const activeBtn = document.querySelector(
    `.filters button[onclick="setFilter('${filter}')"]`
  );

  if (activeBtn) {
    activeBtn.classList.add("active");
  }

  refreshList();
}