const home = document.querySelector(".home-All");
const project = document.querySelector(".projects-All");
const task = document.querySelector(".tasks-All");
const chat = document.querySelector(".chat-All");
const welcomeMessage = document.getElementById("welcome-message");

function switchView(view) {
  home.classList.add("hidden");
  home.classList.remove("visible");

  project.classList.add("hidden");
  project.classList.remove("visible");

  task.classList.add("hidden");
  task.classList.remove("visible");

  chat.classList.add("hidden");
  chat.classList.remove("visible");

  view.classList.add("visible");
  view.classList.remove("hidden");

  if (view === home) {
    updateStats();
    updateChart();
  }
}

function toHome(event) {
  if (event) event.preventDefault();
  switchView(home);
}

function toProject(event) {
  if (event) event.preventDefault();
  switchView(project);
}

function toTask(event) {
  if (event) event.preventDefault();
  switchView(task);
}

function toChat(event) {
  if (event) event.preventDefault();
  switchView(chat);
}

function getStats() {
  const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
  const allProjects = JSON.parse(localStorage.getItem("projects")) || [];
  const allTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const allStudents = JSON.parse(localStorage.getItem("students")) || [];

  let projectCount = 0;
  let taskCount = 0;
  let finishedProjectCount = 0;
  let studentCount = allStudents.length;

  if (loggedInUser && loggedInUser.role === "admin") {
    projectCount = allProjects.length;
    taskCount = allTasks.length;
    finishedProjectCount = allProjects.filter(
      (project) => project.status === "completed"
    ).length;
  } else if (loggedInUser && loggedInUser.role === "student") {
    const studentName = loggedInUser.username;

    projectCount = allProjects.filter((project) =>
      project.students.includes(studentName)
    ).length;
    taskCount = allTasks.filter(
      (task) => task.assignedStudent === studentName
    ).length;
    finishedProjectCount = allProjects.filter(
      (project) =>
        project.students.includes(studentName) && project.status === "completed"
    ).length;

    studentCount = "-";
  }

  return { projectCount, studentCount, taskCount, finishedProjectCount };
}

function updateStats() {
  const stats = getStats();

  const cards = document.querySelectorAll(".stats .card p");
  if (cards.length >= 4) {
    cards[0].textContent = stats.projectCount;
    cards[1].textContent = stats.studentCount;
    cards[2].textContent = stats.taskCount;
    cards[3].textContent = stats.finishedProjectCount;
  }
}

let myChart;
function updateChart() {
  const stats = getStats();

  const ctx = document.getElementById("dashboardChart").getContext("2d");

  if (myChart) {
    myChart.destroy();
  }

  myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Projects", "Students", "Tasks", "Finished Projects"],
      datasets: [
        {
          label: "Count",
          data: [
            stats.projectCount,
            stats.studentCount === "-" ? 0 : stats.studentCount,
            stats.taskCount,
            stats.finishedProjectCount,
          ],
          backgroundColor: [
            "rgb(41, 63, 62)",
            "rgb(37, 57, 71)",
            "rgb(75, 65, 42)",
            "rgb(55, 44, 75)",
          ],
          borderColor: ["cyan", "lightblue", "yellow", "violet"],
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelector(".nav-link[onclick='toHome(event)']")
    .addEventListener("click", toHome);
  document
    .querySelector(".nav-link[onclick='toProject(event)']")
    .addEventListener("click", toProject);
  document
    .querySelector(".nav-link[onclick='toTask(event)']")
    .addEventListener("click", toTask);
  document
    .querySelector(".nav-link[onclick='toChat(event)']")
    .addEventListener("click", toChat);

  const logoutButton = document.querySelector(".logout");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      sessionStorage.removeItem("loggedInUser");
      localStorage.removeItem("rememberedUser");
      Toastify({
        text: "Logged out successfully!",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#3579f6",
      }).showToast();
      setTimeout(() => {
        window.location.href = "sign_in.html";
      }, 2000);
    });
  }

  const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
  if (loggedInUser && loggedInUser.role === "admin") {
    welcomeMessage.textContent = `Admin ${loggedInUser.username}`;
  } else if (loggedInUser && loggedInUser.role === "student") {
    welcomeMessage.textContent = `Student ${loggedInUser.username}`;
  } else {
    welcomeMessage.textContent = "Welcome Guest";
  }

  function checkLoggedInUser() {
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));

    if (!loggedInUser) {
        window.location.href = "sign_in.html";  
    }
}


  checkLoggedInUser();
  updateStats();
  updateChart();
});
