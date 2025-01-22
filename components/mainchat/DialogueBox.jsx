import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

export default function DialogueBox({ messages, setMessages }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [npcChats, setNpcChats] = useState({}); // 用于存储 NPC 的聊天窗口

  const handleSend = async () => {
    if (input.trim() === "") return;

    const userMessage = { sender: "玩家", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post("/api/chat", {
        input,
        role: "KP", // 默认与 KP 聊天
      });

      const replyText = typeof response.data.reply === "object"
        ? JSON.stringify(response.data.reply, null, 2)
        : response.data.reply;

      const gptReply = { sender: "KP", text: replyText };
      setMessages((prev) => [...prev, gptReply]);

      // 如果需要与 NPC 对话，处理 talkRequired
      const replyData = typeof response.data.reply === "object" ? response.data.reply : {};
      if (replyData.talkRequired && Array.isArray(replyData.talkRequired)) {
        replyData.talkRequired.forEach((npcName) => {
          if (!npcChats[npcName]) {
            setNpcChats((prev) => ({
              ...prev,
              [npcName]: [],
            }));
          }
        });
      }
    } catch (error) {
      console.error("Error calling ChatGPT API:", error);
      const errorMessage = { sender: "系统", text: "错误：无法连接到服务器。" };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleNpcSend = async (npcName, npcInput) => {
    if (npcInput.trim() === "") return;

    const npcMessage = { sender: "玩家", text: npcInput };
    setNpcChats((prev) => ({
      ...prev,
      [npcName]: [...prev[npcName], npcMessage],
    }));

    try {
      const response = await axios.post("/api/chat", {
        input: npcInput,
        role: "NPC",
      });

      const replyText = typeof response.data.reply === "object"
        ? JSON.stringify(response.data.reply, null, 2)
        : response.data.reply;

      const gptReply = { sender: npcName, text: replyText };
      setNpcChats((prev) => ({
        ...prev,
        [npcName]: [...prev[npcName], gptReply],
      }));
    } catch (error) {
      console.error("Error calling ChatGPT API:", error);
      const errorMessage = { sender: "系统", text: "错误：无法连接到服务器。" };
      setNpcChats((prev) => ({
        ...prev,
        [npcName]: [...prev[npcName], errorMessage],
      }));
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
      {/* 消息显示区域 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-lovecraft">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === "KP" ? "justify-start" : "justify-end"
            }`}
          >
            <div
              className={`p-3 rounded-xl max-w-[70%] shadow-lg ${
                msg.sender === "KP"
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

      {/* NPC 聊天窗口 */}
      {Object.keys(npcChats).map((npcName) => (
        <div key={npcName} className="p-4 border-t border-emerald-900/30">
          <h3 className="text-emerald-400">与 {npcName} 对话:</h3>
          <div className="space-y-2">
            {npcChats[npcName].map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.sender === npcName ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`p-3 rounded-xl max-w-[70%] shadow-lg ${
                    msg.sender === npcName
                      ? "bg-emerald-950/60 text-emerald-400 backdrop-blur-sm"
                      : "bg-emerald-900/60 text-emerald-300 backdrop-blur-sm"
                  }`}
                >
                  <strong className="block mb-1">{msg.sender}:</strong>
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center mt-2">
            <input
              type="text"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleNpcSend(npcName, e.target.value);
                  e.target.value = "";
                }
              }}
              className="flex-1 bg-emerald-900/20 border border-emerald-900/30 rounded-lg px-4 py-2 text-emerald-400 focus:outline-none"
              placeholder={`对 ${npcName} 说点什么...`}
            />
          </div>
        </div>
      ))}

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
