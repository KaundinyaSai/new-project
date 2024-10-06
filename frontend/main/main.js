const settingsButton = document.getElementById("settingsButton");
const revertButton = document.getElementById("revertButton");
const deleteButton = document.getElementById("deleteAccountButton");
const settings = document.getElementById("settings");

settingsButton.addEventListener("click", () => {
  settings.style.right = "0"; // Slide the panel in
  revertButton.style.display = "flex";
});

revertButton.addEventListener("click", () => {
  settings.style.right = "-250px"; // Slide the panel out
  revertButton.style.display = "none";
});

deleteButton.addEventListener("click", () => {});

async function deleteAccount(username) {}
