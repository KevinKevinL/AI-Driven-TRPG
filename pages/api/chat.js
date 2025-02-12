// pages/api/chat.js

export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Only POST requests are allowed" });
    }
  
    const { input, role, module } = req.body;
  
    try {
      const { getResponse } = await import("../../ai/getResponse.js");
  
      console.log("[API/Chat] Input:", input);
      console.log("[API/Chat] Role:", role);
      if (module) {
        console.log("[API/Chat] Module:", module);
      }
  
      // 调用
      const result = await getResponse({ input, role, module });
  
      return res.status(200).json({ reply: result });
    } catch (error) {
      console.error("Error in /api/chat:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
  