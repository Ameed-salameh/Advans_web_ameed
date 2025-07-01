document.addEventListener("DOMContentLoaded", function () {
    const projectsContainer = document.getElementById("projectsContainer");
    const searchInput = document.getElementById("search");
    const statusFilter = document.getElementById("statusFilter");
    const studentList = document.getElementById("studentsList");

    let projects = JSON.parse(localStorage.getItem("projects")) || [
];

    function loadSignedInStudents() { 
        const students = JSON.parse(localStorage.getItem("students")) || [];
        const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));

        if (!loggedInUser) {
            console.error("No user is logged in.");
            return;
        }

        if (loggedInUser.role === "admin") {
            students.forEach(student => {
                const option = document.createElement("option");
                option.value = student.username; 
                option.textContent = `${student.username} (ID: ${student.studentId})`;
                studentList.appendChild(option);
            });
        } else {
            const option = document.createElement("option");
            option.value = loggedInUser.username;
            option.textContent = `${loggedInUser.username} (ID: ${loggedInUser.studentId})`;
            studentList.appendChild(option);
        }
    }
    loadSignedInStudents();

    function loadTasksForProject(projectName) {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    
        if (!loggedInUser) {
            alert("No user logged in.");
            return;
        }
    
        const isAdmin = loggedInUser.role === "admin";
        const taskContainer = document.getElementById("modalTasks");
        taskContainer.innerHTML = ""; // Clear previous tasks
    
        const filteredTasks = tasks.filter(task => task.project === projectName);
    
        if (filteredTasks.length === 0) {
            taskContainer.innerHTML = `<p>No tasks found for this project.</p>`;
            return;
        }
    
        filteredTasks.forEach(task => {
            if (!isAdmin && task.assignedStudent.toLowerCase() !== loggedInUser.username.toLowerCase()) {
                return;
            }
    
            const taskCard = document.createElement("div");
            taskCard.classList.add("task-card");
    
            taskCard.innerHTML = `
                <p class="taskid"><strong>Task ID:</strong>${task.taskId}</p>
                <p><strong>Task Name:</strong> ${task.taskName}</p>
                <p><strong>Description:</strong> ${task.description}</p>
                <p><strong>Assigned Student:</strong> ${task.assignedStudent}</p>
                <p><strong>Status:</strong> ${task.status}</p>
                <p><strong>Due Date:</strong> ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A"}</p>
            `;
    
            taskContainer.appendChild(taskCard);
        });
    }

    function renderProjects() {
        projectsContainer.innerHTML = "";
    
        // Get logged-in user details from sessionStorage
        const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    
        if (!loggedInUser) {
            console.error("No user is logged in.");
            return;
        }
    
        let filteredProjects = projects.filter(project => 
            (loggedInUser.role === "admin" || project.students === loggedInUser.username) &&
            (statusFilter.value === "all" || project.status === statusFilter.value) &&
            (project.title.toLowerCase().includes(searchInput.value.toLowerCase()) ||
             project.description.toLowerCase().includes(searchInput.value.toLowerCase()))
        );
    
        filteredProjects.forEach(project => {
            let projectCard = document.createElement("div");
            projectCard.classList.add("project-card");
            projectCard.innerHTML = `
                <h3 style="color:#3579f6; text-align: start;">${project.title}</h3>
                <p class="desc" style="text-align: start;"><strong>Description:</strong> ${project.description}</p>
                <p class="stu" style="text-align: start;"><strong>Students:</strong> ${project.students}</p>
                <p class="cat" style="text-align: start;"><strong>Category:</strong> ${project.category}</p>
                <div class="progress-bar-container" style="position: relative; height: 20px; background-color: #444444; width: 100%; border-radius: 5px;">
                    <div class="progress-bar" style="width: ${project.progress}%; background-color: #3579f6; height: 100%; border-radius: 5px;">
                        <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-weight: bold;">
                            ${project.progress}%
                        </span>
                    </div>
                </div>
                <p style="display: flex; justify-content: space-between; width: 100%;">
                    <span class="sdate">${project.startDate}</span>
                    <span class="edate">${project.endDate}</span>
                </p>
            `;
    
            projectCard.addEventListener("click", function () {
                projectCard.style.border = "2px solid #f19d38"; // Highlight selected project
            });
    
            // Reset border when clicking elsewhere
            document.addEventListener("click", function (event) {
                if (!projectCard.contains(event.target)) {
                    projectCard.style.border = "";
                }
            });
    
            projectsContainer.appendChild(projectCard);
        });
    }
    
    
    projectsContainer.style.display = "flex";
    projectsContainer.style.flexWrap = "wrap"; // To allow wrapping if there are many cards
    projectsContainer.style.justifyContent = "center"; // Centers the cards horizontally
    projectsContainer.style.alignItems = "center"; // Centers the cards vertically if needed
    projectsContainer.style.gap = "20px"; // Adds spacing between cards
    
    searchInput.addEventListener("input", renderProjects);
    statusFilter.addEventListener("change", renderProjects);

    renderProjects();

    // Handle modal opening and closing
    const addProjectButton = document.getElementById("addProject");
    const modal = document.getElementById("addProjectModal");
    const closeModalButton = document.getElementById("closeModal");

    addProjectButton.addEventListener("click", () => {
        modal.style.display = "block";
    });

    closeModalButton.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    // Handle adding a new project
    document.getElementById("addProjectForm").addEventListener("submit", function (e) {
        e.preventDefault();

        // Get input values
        const title = document.getElementById("projectTitle").value.trim();
        const description = document.getElementById("projectDescription").value.trim();
        const students = Array.from(document.getElementById("studentsList").selectedOptions).map(opt => opt.value).join(", ");
        const category = document.getElementById("projectCategory").value;
        const startDate = document.getElementById("startDate").value;
        const endDate = document.getElementById("endDate").value;
        const status = document.getElementById("projectStatus").value;

        if (!title || !description || !category || !startDate || !endDate) {
            alert("Please fill in all required fields.");
            return;
        }

        // Create new project object
        const newProject = {
            title,
            description,
            students,
            category,
            progress: status === "completed" ? 100 : 0,
            status,
            startDate,
            endDate
        };

        // Add to local storage
        projects.push(newProject);
        localStorage.setItem("projects", JSON.stringify(projects));

        // Refresh the displayed projects
        renderProjects();

        // Close modal and reset form
        modal.style.display = "none";
        document.getElementById("addProjectForm").reset();
    });

    const modal2 = document.getElementById("projectModal");

document.querySelectorAll(".project-card").forEach(card => {
    card.addEventListener("click", function () {
        const title = this.querySelector("h3").textContent;
        const description = this.querySelector(".desc").textContent.replace("Description: ", "");
        const category = this.querySelector(".cat").textContent.replace("Category: ", "");
        const students = this.querySelector(".stu").textContent.replace("Students: ", "");
        const startDate = this.querySelector(".sdate").textContent;
        const endDate = this.querySelector(".edate").textContent;

        document.getElementById("modalTitle").textContent = title;
        document.getElementById("modalDescription").textContent = description;
        document.getElementById("modalCategory").textContent = category;
        document.getElementById("modalStudents").textContent = students;
        document.getElementById("modalStartDate").textContent = startDate;
        document.getElementById("modalEndDate").textContent = endDate;
        loadTasksForProject(title);

        // Show modal with animation
        modal2.style.visibility = "visible";
        modal2.style.opacity = "1";
        modal2.querySelector(".modal-content2").style.right = "0"; // Slide in
    });
});

// Close modal when clicking outside the modal content
window.addEventListener("click", function (event) {
    if (event.target === modal2) {
        modal2.style.opacity = "0";
        modal2.querySelector(".modal-content2").style.right = "-320px"; // Slide out
        setTimeout(() => {
            modal2.style.visibility = "hidden";
        }, 300); // Match transition time
    }
});

});