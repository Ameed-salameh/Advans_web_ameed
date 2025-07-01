document.addEventListener("DOMContentLoaded", () => {
    const signUpForm = document.querySelector("form");

    signUpForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();
        const isStudent = document.getElementById("is-student").checked;
        const studentId = document.getElementById("student-id").value.trim();

        if (username === "" || password === "") {
            Toastify({ text: "Username and password are required!", duration: 3000, gravity: "top", position: "right", backgroundColor: "red" }).showToast();
            return;
        }

        if (isStudent && studentId === "") {
            Toastify({ text: "Student ID is required!", duration: 3000, gravity: "top", position: "right", backgroundColor: "red" }).showToast();
            return;
        }

        if (localStorage.getItem(username)) {
            Toastify({ text: "Username already exists. Choose a different username.", duration: 3000, gravity: "top", position: "right", backgroundColor: "red" }).showToast();
            return;
        }

        // Check if student ID is unique
        const storedStudents = JSON.parse(localStorage.getItem("students")) || [];
        if (isStudent && storedStudents.some(student => student.studentId === studentId)) {
            Toastify({ text: "Student ID already exists. Choose a different one.", duration: 3000, gravity: "top", position: "right", backgroundColor: "red" }).showToast();
            return;
        }

        const userData = isStudent
            ? { username, password, role: "student", studentId }
            : { username, password, role: "admin" };

        
       // localStorage.setItem(username, JSON.stringify(userData));

        // Store students/admins in separate arrays
        if (isStudent) {
            storedStudents.push(userData);
            localStorage.setItem("students", JSON.stringify(storedStudents));
        } else {
            const storedAdmins = JSON.parse(localStorage.getItem("admins")) || [];
            storedAdmins.push(userData);
            localStorage.setItem("admins", JSON.stringify(storedAdmins));
        }

        console.log("Students:", JSON.parse(localStorage.getItem("students")));
        console.log("Admins:", JSON.parse(localStorage.getItem("admins")));

        Toastify({ text: "Sign-up successful! You can now sign in.", duration: 3000, gravity: "top", position: "right", backgroundColor: "green" }).showToast();
        setTimeout(() => { window.location.href = "sign_in.html"; }, 3000);
    });
});
