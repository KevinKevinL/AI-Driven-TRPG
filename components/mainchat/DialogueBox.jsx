import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

export default function DialogueBox({ messages, setMessages }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("TA");

  const handleSend = async () => {
    if (input.trim() === "") return;

    const userMessage = { sender: "玩家", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post("/api/chat", {
        input,
        role,
      });

      const aiSender = role === "TA" ? "KP (TA)" : role === "KP" ? "KP" : "NPC";
      const replyText = typeof response.data.reply === "object"
        ? JSON.stringify(response.data.reply, null, 2)
        : response.data.reply;

      const gptReply = { sender: aiSender, text: replyText };
      setMessages((prev) => [...prev, gptReply]);
    } catch (error) {
      console.error("Error calling ChatGPT API:", error);
      const errorMessage = { sender: "系统", text: "错误：无法连接到服务器。" };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full rounded-lg">
      {/* 角色选择区域 */}
      <div className="p-4 border-b border-emerald-900/30 bg-black/40 backdrop-blur-sm rounded-t-lg">
        <label className="text-emerald-400">
          选择对话角色:
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="ml-2 bg-emerald-900/20 border border-emerald-900/30 rounded-lg px-2 py-1 text-emerald-400 focus:outline-none"
          >
            <option value="TA">TA (Test Assistant)</option>
            <option value="KP">KP (游戏主持人)</option>
            <option value="NPC">NPC (游戏角色)</option>
          </select>
        </label>
      </div>

      {/* 消息显示区域 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-lovecraft">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === "KP" || msg.sender === "KP (TA)" || msg.sender === "NPC"
                ? "justify-start"
                : "justify-end"
            }`}
          >
            <div
              className={`p-3 rounded-xl max-w-[70%] shadow-lg ${
                msg.sender === "KP" || msg.sender === "KP (TA)" || msg.sender === "NPC"
                  ? "bg-emerald-950/60 text-emerald-400 backdrop-blur-sm"
                  : "bg-emerald-900/60 text-emerald-300 backdrop-blur-sm"
              }`}
            >
              <strong className="block mb-1">{msg.sender}:</strong>
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="text-emerald-500 text-sm">KP 正在输入...</div>
          </div>
        )}
      </div>

      {/* 输入区域 */}
      <div className="flex items-center p-4 border-t border-emerald-900/30 bg-black/40 backdrop-blur-sm rounded-b-lg">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 bg-emerald-900/20 border border-emerald-900/30 rounded-lg px-4 py-2 text-emerald-400 focus:outline-none"
          placeholder="输入内容..."
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className={`ml-4 px-4 py-2 rounded-lg font-semibold tracking-wide transition-all
            ${
              loading
                ? "bg-slate-800/50 text-slate-500 cursor-not-allowed"
                : "bg-emerald-900/50 text-emerald-400 hover:bg-emerald-800/50"
            }`}
        >
          发送
        </button>
      </div>
    </div>
  );
}