document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("taskModal");
    const btn = document.querySelector(".create-task");
    const closeBtn = document.getElementById("closeModal3");
    const addTaskBtn = document.querySelector(".add-task");
    const tableBody = document.querySelector(".task-table tbody");
    const studentDropdown = document.querySelector(".task-assign select");
    const projectDropdown = document.querySelector(".select-project select");
    const sortDropdown = document.getElementById("sort");

    function loadSignedInStudents() {
        studentDropdown.innerHTML = "<option value=''>Select Student</option>"; 

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
                studentDropdown.appendChild(option);
            });
        } else {
            const option = document.createElement("option");
            option.value = loggedInUser.username;
            option.textContent = `${loggedInUser.username} (ID: ${loggedInUser.studentId})`;
            studentDropdown.appendChild(option);
        }
    }

    function loadProjects() {
        projectDropdown.innerHTML = "<option value=''>Select a project</option>"; 
        const projects = JSON.parse(localStorage.getItem("projects")) || [];
        const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    
        if (!loggedInUser) {
            console.error("No user is logged in.");
            return;
        }
    
        if (loggedInUser.role === "admin") {
            // Admins see all projects
            projects.forEach(project => {
                const option = document.createElement("option");
                option.value = project.title; 
                option.textContent = project.title; 
                projectDropdown.appendChild(option);
            });
        } else if (loggedInUser.role === "student") {
            // Students see only their assigned projects
            const studentProjects = projects.filter(project => 
                project.students.split(", ").includes(loggedInUser.username) // Check if student's name is in the project list
            );
    
            if (studentProjects.length === 0) {
                console.log("No projects found for this student.");
            }
    
            studentProjects.forEach(project => {
                const option = document.createElement("option");
                option.value = project.title;
                option.textContent = project.title;
                projectDropdown.appendChild(option);
            });
        }
    }
    

    function loadTasks(sortedBy = "status") {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
        
        if (!loggedInUser) {
            alert("No user logged in.");
            return;
        }

        const isAdmin = loggedInUser.role === "admin";
        tableBody.innerHTML = ""; 

        function formatDate(dateString) {
            if (!dateString) return "N/A"; 
            const date = new Date(dateString);
            return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        }
        
        tasks.sort((a, b) => {
            if (sortedBy === "dueDate") {
                return new Date(a.dueDate) - new Date(b.dueDate);
            } else if (["assignedStudent", "project", "status"].includes(sortedBy)) {
                return a[sortedBy].toLowerCase().localeCompare(b[sortedBy].toLowerCase());
            }
        });

        tasks.forEach((task) => {
            
            if (!isAdmin && task.assignedStudent.toLowerCase() !== loggedInUser.username.toLowerCase()) {
                return;
            }

            const newRow = document.createElement("tr");
            newRow.innerHTML = `
                <td>${task.taskId}</td>
                <td>${task.project}</td>
                <td>${task.taskName}</td>
                <td>${task.description}</td>
                <td>${task.assignedStudent}</td>
                <td class="status ${task.status.toLowerCase().replace(" ", "-")}">${task.status}</td>
                <td>${formatDate(task.dueDate)}</td>
            `;
            tableBody.appendChild(newRow);
        });
    }

    btn.onclick = () => {
        loadProjects();
        modal.style.display = "block";
    }
    closeBtn.onclick = () => modal.style.display = "none";
    window.onclick = (event) => {
        if (event.target == modal) modal.style.display = "none";
    };

    addTaskBtn.onclick = function () {
        const project = projectDropdown.value;
        const taskName = document.querySelector(".task-name input").value;
        const description = document.querySelector(".task-desc textarea").value;
        const assignedStudent = studentDropdown.value; 
        const status = document.querySelector(".modaltask-status select").value;
        const dueDate = document.querySelector(".task-date input").value;
    
        if (!taskName || !project || !assignedStudent || !status || !dueDate) {
            alert("Please fill in all fields before adding the task.");
            return;
        }
    
        
        const students = JSON.parse(localStorage.getItem("students")) || [];
    
        
        const studentObj = students.find(student => student.username.toLowerCase() === assignedStudent.toLowerCase());
    
        if (!studentObj) {
            alert("Selected student not found.");
            return;
        }
    
        const studentId = studentObj.studentId; 
    
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        const taskId = tasks.length + 1; 
    
        const newTask = {
            taskId,
            project,
            taskName,
            description,
            assignedStudent, 
            studentId,  
            status,
            dueDate,
        };
    
        tasks.push(newTask);
        localStorage.setItem("tasks", JSON.stringify(tasks));
    
        modal.style.display = "none";
    
        
        document.querySelector(".task-name input").value = "";
        document.querySelector(".task-desc textarea").value = "";
        document.querySelector(".task-date input").value = "";
    
        loadTasks(sortDropdown.value); 
        
    };
    

    sortDropdown.addEventListener("change", function () {
        loadTasks(this.value);
    });

    
    loadSignedInStudents();
    loadProjects();
    loadTasks();
});
