// utils/chatAPI.js

import axios from "axios";

/**
 * 原有的 fetchChatGPTResponse (如有其他用途) 保留不变
 */
export async function fetchChatGPTResponse(prompt) {
  try {
    const response = await axios.post("/api/chat", {
      input: prompt,
      role: "KP"
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching ChatGPT response:", error);
    throw error;
  }
}

/**
 * 新增：调用 /api/characterDescription 接口生成角色描述
 */
export async function fetchCharacterDescription(prompt) {
  try {
    const response = await axios.post("/api/characterDescription", { prompt });
    return response.data;
  } catch (error) {
    console.error("Error fetching character description:", error);
    throw error;
  }
}
