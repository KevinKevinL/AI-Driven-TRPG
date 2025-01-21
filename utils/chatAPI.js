import axios from 'axios';

// GPT-4o-mini API 配置
const GPT_API_URL = "https://api.openai.com/v1/chat/completions";
const GPT_API_KEY = process.env.OPENAI_API_KEY; // 从环境变量读取 API 密钥

export const fetchChatGPTResponse = async (messages) => {
  try {
    const response = await axios.post(
      GPT_API_URL,
      {
        model: "gpt-4o-mini", // 或者 'gpt-4o-mini'
        messages: messages,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GPT_API_KEY}`,
        },
      }
    );

    // 返回 GPT 回复内容
    return { success: true, reply: response.data.choices[0].message.content };
  } catch (error) {
    console.error("OpenAI API Error:", error.response?.data || error.message);
    return { success: false, error: "Failed to fetch response from OpenAI API" };
  }
};
