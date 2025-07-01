function formatDateTime() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    document.getElementById("dateTime").innerText = now.toLocaleString('en-US', options);
}
formatDateTime();
setInterval(formatDateTime, 1000);





