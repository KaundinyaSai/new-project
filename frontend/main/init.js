document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("JWT");

  if (token) {
    console.log("User logged in", token);

    const payload = jwt_decode(token);
    const expiresIn = payload.exp * 1000; // seconds to milliseconds
    const timeToExpire = new Date(expiresIn);
    loadTasks(payload.id);

    console.log(`Token expires in ${timeToExpire}`);

    if (Date.now() >= expiresIn) {
      localStorage.removeItem("JWT");
      window.location.href = "/login.html";
    }
  } else {
    console.log("User not logged in");
    window.location.href = "/frontend/login.html";
  }
});

async function loadTasks(user_id) {
  try {
    const response = await axios.get(
      `http://localhost:4000/api/tasks/${user_id}`
    );

    const taskTemplate = document.getElementById("taskTemplate");
    const tasksContainer = document.getElementById("tasks");

    const tasks = response.data;
    console.log("Tasks loaded successfully", tasks);

    tasks.forEach((task) => {
      const newTask = taskTemplate.content.cloneNode(true);
      const taskText = task.title;
      newTask.querySelector(".taskText").textContent = taskText;

      const deleteBtn = newTask.querySelector(".deleteTask");
      deleteBtn.addEventListener("click", () => {
        tasksContainer.removeChild(newTask);
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
    });
    taskInput.value = "";
  } catch (error) {
    console.log("ERROR:", error);
  }
}
