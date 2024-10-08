const addTaskForm = document.getElementById("addTask");
const taskInput = document.getElementById("taskInput");
const tasksContainer = document.getElementById("tasks");
const taskTemplate = document.getElementById("taskTemplate");

addTaskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const taskText = taskInput.value;
  if (taskText.trim() === "") return;

  const newTask = taskTemplate.content.cloneNode(true);
  newTask.querySelector(".taskText").textContent = taskText;

  const deleteBtn = newTask.querySelector(".deleteTask");
  deleteBtn.addEventListener("click", () => {
    tasksContainer.removeChild(deleteBtn.parentElement); // Remove the task from the tasks container
  });
  const taskTextElement = newTask.querySelector(".taskText");
  const check = newTask.querySelector(".checkbox");
  check.addEventListener("change", () => {
    if (check.checked) {
      taskTextElement.style.textDecoration = "line-through";
    } else {
      taskTextElement.style.textDecoration = "none";
    }
  });

  tasksContainer.appendChild(newTask);
  taskInput.value = ""; // Clear the input field
});
