const chatStudentList = document.getElementById('chat-student-list');
const chatHeader = document.getElementById('chat-header');
const chatWindow = document.getElementById('chat-window');
const head = document.querySelector(".chat-sidebar .h")
console.log(head.innerHTML);


function loadSignedInStudents() {
    chatStudentList.innerHTML = ""; 

    const students = JSON.parse(localStorage.getItem("students")) || [];
    const admins = JSON.parse(localStorage.getItem("admins")) || [];
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));

    if (!loggedInUser) {
        console.error("No user is logged in.");
        return;
    }

    if (loggedInUser.role === "admin") {
        
        students.forEach(student => {
            const li = document.createElement("li");
            li.textContent = `${student.username} (ID: ${student.studentId})`;
            li.onclick = () => startChat(student.username);
            chatStudentList.appendChild(li);
        });
    } else if (loggedInUser.role === "student") {
        head.innerHTML = "List of Admins";
        admins.forEach(admin => {
            const li = document.createElement("li");
            li.textContent = `${admin.username} (Admin)`;
            li.onclick = () => startChat(admin.username);
            chatStudentList.appendChild(li);
        });
    }
}

function getChatKey(user1, user2) {
    return `chat_${[user1, user2].sort().join("_")}`;
}

function startChat(chatPartner) {
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
        console.error("No user is logged in.");
        return;
    }

    chatHeader.textContent = `Chatting with ${chatPartner}...`;

    const chatKey = getChatKey(loggedInUser.username, chatPartner);
    const chatHistory = JSON.parse(localStorage.getItem(chatKey)) || [];

    chatWindow.innerHTML = `<h3 id="chat-header">Chatting with ${chatPartner}...</h3>
                            <div id="chat-messages"></div>
                            <div class="input-area">
                                <input type="text" id="message-input" placeholder="Type your message...">
                                <button onclick="sendMessage('${chatPartner}')">Send</button>
                            </div>`;

    const chatMessagesDiv = document.getElementById('chat-messages');

    chatHistory.forEach(message => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.sender === loggedInUser.username ? "sent" : "received"}`;
        messageDiv.textContent = message.text;
        chatMessagesDiv.appendChild(messageDiv);
    });

    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function sendMessage(chatPartner) {
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
        console.error("No user is logged in.");
        return;
    }

    const messageInput = document.getElementById('message-input');
    const messageText = messageInput.value.trim();

    if (messageText !== '') {
        const chatKey = getChatKey(loggedInUser.username, chatPartner);
        const chatHistory = JSON.parse(localStorage.getItem(chatKey)) || [];

        const newMessage = {
            sender: loggedInUser.username,
            text: messageText,
            timestamp: new Date().toISOString()
        };

        chatHistory.push(newMessage);
        localStorage.setItem(chatKey, JSON.stringify(chatHistory));

        const chatMessagesDiv = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = "message sent";
        messageDiv.textContent = messageText;
        chatMessagesDiv.appendChild(messageDiv);

        messageInput.value = '';
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }
}

loadSignedInStudents();
