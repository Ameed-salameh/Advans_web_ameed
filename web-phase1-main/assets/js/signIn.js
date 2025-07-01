document.addEventListener("DOMContentLoaded", () => {
    const signInForm = document.querySelector("form");
    signInForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();
        const staySignedIn = document.getElementById("stay-signed-in").checked;

        if (username === "" || password === "") {
            Toastify({ text: "Username and password are required!", duration: 3000, gravity: "top", position: "right", backgroundColor: "#f44336" }).showToast();
            return;
        }

        
        const students = JSON.parse(localStorage.getItem("students")) || [];
        const admins = JSON.parse(localStorage.getItem("admins")) || [];

       
        const userData = [...students, ...admins].find(user => user.username === username);

        if (!userData) {
            Toastify({ text: "User not found. Please sign up first.", duration: 3000, gravity: "top", position: "right", backgroundColor: "#f44336" }).showToast();
            return;
        }

        if (userData.password !== password) {
            Toastify({ text: "Incorrect password. Please try again.", duration: 3000, gravity: "top", position: "right", backgroundColor: "#f44336" }).showToast();
            return;
        }

        Toastify({ text: "Sign-in successful! Welcome " + username, duration: 3000, gravity: "top", position: "right", backgroundColor: "#4caf50" }).showToast();
        
        sessionStorage.setItem("loggedInUser", JSON.stringify(userData));
        
        if (staySignedIn) {
            localStorage.setItem("rememberedUser", JSON.stringify(userData));
        }

        setTimeout(() => { window.location.href = "home.html"; }, 3000);
    });
});


document.addEventListener("DOMContentLoaded", () => {
    const rememberedUser = localStorage.getItem("rememberedUser");
    if (rememberedUser) {
        sessionStorage.setItem("loggedInUser", rememberedUser);
        window.location.href = "home.html";
    }
});
