let conversation = [];

function sendMessage() {
    const input = document.getElementById("userInput").value;
    if (input) {
        conversation.push({ sender: "玩家", message: input }); // 在发送消息前同步更新对话数组
        addMessageToChatBox("玩家", input, "player");
        document.getElementById("userInput").value = "";
        getAIResponse(input);
    }
}


function handleEnter(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

function addMessageToChatBox(sender, message, senderClass) {
    const chatBox = document.getElementById("chatBox");
    const responseDiv = document.createElement("div");
    responseDiv.className = `response ${senderClass}`;
    responseDiv.innerHTML = `<p><strong>${sender}:</strong> ${message}</p>`;
    chatBox.appendChild(responseDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function getAIResponse(input) {
    console.log("Sending user input to server:", input); // 输出发送到服务器的数据
    try {
        const response = await fetch('http://localhost:3000/api/get-response', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ conversation, input })
        });
        const data = await response.json();
        console.log("Received response from server:", data); // 输出从服务器返回的数据

        if (data.reply) {
            addMessageToChatBox("KP", data.reply, "kp");
            conversation.push({ sender: "KP", message: data.reply });
        } else {
            console.error("No reply found in server response");
            addMessageToChatBox("KP", "抱歉，我无法响应你的请求。", "kp");
        }
    } catch (error) {
        console.error('Error fetching AI response:', error);
        addMessageToChatBox("KP", "抱歉，我无法响应你的请求。", "kp");
    }
}

