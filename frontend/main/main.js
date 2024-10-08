const addTaskForm = document.getElementById("addTask");
const taskInput = document.getElementById("taskInput");
const tasksContainer = document.getElementById("tasks");
const taskTemplate = document.getElementById("taskTemplate");

addTaskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const taskText = taskInput.value;
  if (taskText.trim() === "") return;
  const newTask = taskTemplate.content.cloneNode(true);
  newTask.querySelector("p").textContent = taskText;

  const deleteBtn = newTask.querySelector("#deleteTask");
  deleteBtn.addEventListener("click", () => {
    tasksContainer.removeChild(deleteBtn.parentElement); // Remove the task from the tasks container
  });
  tasksContainer.appendChild(newTask);
  taskInput.value = "";
});
