document.addEventListener("DOMContentLoaded", function () {
    // Append chatbot UI to the page
    const chatbotContainer = document.createElement("div");
    chatbotContainer.innerHTML = `
        <div id="chatbot" style="position: fixed; bottom: 20px; right: 20px; width: 320px; height: 400px; border: 2px solid #333; background: white; border-radius: 10px; display: flex; flex-direction: column; overflow: hidden;">
            <div style="background: #333; color: white; padding: 10px; text-align: center;">Chatbot</div>
            <div id="chat-messages" style="flex: 1; overflow-y: auto; padding: 10px;"></div>
            <textarea id="user-input" placeholder="Type your message..." style="width: 100%; padding: 5px;"></textarea>
            <button id="send-btn" style="width: 100%; background: #28a745; color: white; padding: 5px; border: none; cursor: pointer;">Send</button>
        </div>
    `;
    document.body.appendChild(chatbotContainer);

    // Access elements
    const chatMessages = document.getElementById("chat-messages");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-btn");

    let chatHistory = [];  // Store chat history
    let pageContent = document.body.innerText;  // Read all page content

    sendButton.addEventListener("click", async () => {
        let userMessage = userInput.value.trim();
        if (!userMessage) return;

        // Display user message
        displayMessage("You", userMessage);
        userInput.value = "";  // Clear input field

        // Store history
        chatHistory.push({ role: "user", content: userMessage });

        // Generate AI response
        let aiResponse = await getAIResponse(userMessage);

        // Display AI response
        displayMessage("Bot", aiResponse);
        chatHistory.push({ role: "bot", content: aiResponse });
    });

    function displayMessage(sender, message) {
        let messageElement = document.createElement("div");
        messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
        messageElement.style.marginBottom = "8px";
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll to latest message
    }

    async function getAIResponse(userMessage) {
        const prompt = `You are a chatbot with full access to the page content. Use this context to answer user queries:
        - Page Content: ${pageContent}
        - Chat History: ${JSON.stringify(chatHistory)}
        - User Input: ${userMessage}

        Respond intelligently based on the above data.`;

        console.log("Sent to AI:", prompt); // Debugging

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=AIzaSyAvS8XWVRS17MEZRdN_p2PeutI3IdZCqAg`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            });

            const result = await response.json();
            return result.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't generate a response.";
        } catch (error) {
            console.error("Error fetching AI response:", error);
            return "Sorry, there was an issue getting a response.";
        }
    }
});
