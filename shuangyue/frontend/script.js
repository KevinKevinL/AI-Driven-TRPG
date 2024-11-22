document.addEventListener('DOMContentLoaded', function () {
    const inputField = document.getElementById('user-input');
    const sendButton = document.getElementById('send-btn');
    const dialogueContent = document.getElementById('dialogue-content');

    // 添加消息到对话框
    function addMessage(role, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');

        if (role === 'KP') {
            messageElement.classList.add('ai-message');
        } else if (role === '玩家') {
            messageElement.classList.add('player-message');
        }

        messageElement.innerHTML = `<span class="label">${role}:</span> ${message}`;
        dialogueContent.appendChild(messageElement);

        dialogueContent.scrollTop = dialogueContent.scrollHeight;
    }

    // 发送玩家输入到后端
    async function sendMessage() {
        const userMessage = inputField.value.trim();
        if (userMessage) {
            addMessage('玩家', userMessage); // 显示玩家消息
            inputField.value = '';

            try {
                const response = await fetch('http://127.0.0.1:5000/get-response', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: userMessage })
                });

                const data = await response.json();
                const npcResponse = data.npc_response;
                const skillCheck = data.skill_check;

                addMessage('KP', npcResponse); // 显示NPC响应
                addMessage('KP', `技能判定结果: ${skillCheck}`); // 显示技能判定结果
            } catch (error) {
                console.error('请求失败:', error);
                addMessage('KP', 'AI连接失败，请稍后重试。');
            }
        }
    }


    // 点击发送按钮触发
    sendButton.addEventListener('click', sendMessage);

    // 回车键触发发送
    inputField.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});
