let shortTermMemory = [];  // 用于保存当前会话的短期记忆

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');  // 引入cors中间件

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());  // 使用cors中间件，允许所有来源访问
app.use(bodyParser.json());
app.use(express.static('public')); // 用于静态文件

// // 引入 Pinecone 并进行初始化
// const { PineconeClient } = require('@pinecone-database/pinecone');
// const pinecone = new PineconeClient();
// pinecone.init({
//     apiKey: process.env.PINECONE_API_KEY,  // 将 Pinecone API Key 存储在 .env 文件中
//     environment: process.env.PINECONE_ENVIRONMENT,  // 使用 Pinecone 环境（如 "us-west1-gcp"）
// });



app.post('/api/get-response', async (req, res) => {
    const { input } = req.body;

    console.log("Received user input from client:");
    console.log("Input:", input);

    // 将玩家输入加入短期记忆
    shortTermMemory.push({ sender: "玩家", message: input });

    // 尝试从知识库中获取回答
    let knowledgeResponse = getKnowledgeResponse(input);

    try {
        let aiResponse;
        if (knowledgeResponse) {
            aiResponse = `根据我的知识库：${knowledgeResponse}`;
        } else {
            // 如果知识库中没有相关内容，则调用AI模型生成
            aiResponse = await getAIResponse(shortTermMemory, input);
        }

        // 将AI的响应加入短期记忆
        shortTermMemory.push({ sender: "KP", message: aiResponse });

        res.json({ reply: aiResponse });
    } catch (error) {
        console.error('Error fetching AI response:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to get AI response' });
    }
});




async function getAIResponse(conversation, input) {
    const apiKey = process.env.OPENAI_API_KEY;
    const endpoint = 'https://api.chatanywhere.tech/v1/chat/completions';

    // 将短期记忆转换为模型能够理解的格式
    const messages = conversation.map(item => ({
        role: item.sender === "KP" ? "assistant" : "user",
        content: item.message
    }));
    messages.push({ role: "user", content: input });

    const data = {
        model: "gpt-3.5-turbo",
        messages: messages,
        max_tokens: 200,
    };

    console.log("Sending request to ChatAnywhere API with data:");
    console.log(JSON.stringify(data, null, 2));

    try {
        const response = await axios.post(endpoint, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            }
        });

        console.log("Received response from ChatAnywhere API:");
        console.log(JSON.stringify(response.data, null, 2));

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Error communicating with ChatAnywhere API:', error.response ? error.response.data : error.message);
        throw new Error('AI request failed');
    }
}


function storeLongTermMemory(content) {
    fs.readFile('long_term_memory.json', (err, data) => {
        if (err) {
            console.error('Error reading memory file:', err);
            return;
        }

        let memories = JSON.parse(data);
        memories.push({ id: `memory-${Date.now()}`, content });

        fs.writeFile('long_term_memory.json', JSON.stringify(memories, null, 2), (err) => {
            if (err) {
                console.error('Error writing memory file:', err);
            } else {
                console.log('Stored long-term memory.');
            }
        });
    });
}


function retrieveLongTermMemory(query, callback) {
    fs.readFile('long_term_memory.json', (err, data) => {
        if (err) {
            console.error('Error reading memory file:', err);
            callback(null);
        } else {
            let memories = JSON.parse(data);
            let relevantMemory = memories.find(memory => memory.content.includes(query));
            callback(relevantMemory ? relevantMemory.content : null);
        }
    });
}



app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

const fs = require('fs');

// 加载游戏知识数据
let gameKnowledge = {};
fs.readFile('game_knowledge.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading game knowledge file:', err);
    } else {
        gameKnowledge = JSON.parse(data);
    }
});

// 根据关键词从游戏知识中检索
function getKnowledgeResponse(input) {
    for (let category in gameKnowledge) {
        for (let key in gameKnowledge[category]) {
            if (input.toLowerCase().includes(key)) {
                return gameKnowledge[category][key];
            }
        }
    }
    return null;
}

