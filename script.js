const chatMessages = document.getElementById("chat-messages");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// Append message to chat
function appendMessage(text, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", sender);
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Send message
async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // Show user's message
    appendMessage(message, "user");
    userInput.value = "";

    // Show "typing..." indicator
    const typingIndicator = document.createElement("div");
    typingIndicator.classList.add("message", "bot");
    typingIndicator.textContent = "Typing...";
    chatMessages.appendChild(typingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
        // Send request to backend
        const response = await fetch("https://resumebackend-0xrs.onrender.com/api/v1/resume", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message })
        });

        const data = await response.json();
        const botReply = data.reply || "Sorry, I didn't understand that.";

        // Remove typing indicator and show actual bot response
        chatMessages.removeChild(typingIndicator);
        appendMessage(botReply, "bot");
    } catch (error) {
        chatMessages.removeChild(typingIndicator);
        appendMessage("Error: Could not reach server.", "bot");
        console.error("Error:", error);
    }
}

// Event listeners
sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
});
