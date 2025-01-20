import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

<<<<<<< HEAD
export default function DialogueBox({ messages, setMessages }) {
  const [input, setInput] = useState(""); // 用户输入的内容
  const [loading, setLoading] = useState(false); // 加载状态
  const [role, setRole] = useState("TA"); // 默认角色为 Test Assistant (TA)

  const handleSend = async () => {
    if (input.trim() === "") return; // 禁止发送空消息

    // 添加用户消息到对话框
    const userMessage = { sender: "玩家", text: input };
    setMessages((prev) => [...prev, userMessage]);

    setInput(""); // 清空输入框
    setLoading(true); // 设置加载状态

    try {
      // 调用后端 API
      const response = await axios.post("/api/chat", {
        input, // 用户输入内容
        role, // 当前选择的角色
      });

      // 根据角色生成回复身份
      const aiSender = role === "TA" ? "KP (TA)" : role === "KP" ? "KP" : "NPC";

      // 检查回复是否是对象，转换为字符串
      const replyText =
        typeof response.data.reply === "object"
          ? JSON.stringify(response.data.reply, null, 2) // 格式化 JSON 为字符串
          : response.data.reply;

      const gptReply = { sender: aiSender, text: replyText };

      // 添加 AI 回复到对话框
      setMessages((prev) => [...prev, gptReply]);
    } catch (error) {
      console.error("Error calling ChatGPT API:", error);
      const errorMessage = { sender: "系统", text: "错误：无法连接到服务器。" };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false); // 结束加载状态
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // 阻止默认行为（换行）
      handleSend(); // 发送消息
=======
export default function DialogueBox({ messages, setMessages, className = '' }) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage = { sender: '玩家', text: input };
    setMessages((prev) => [...prev, userMessage]);
    
    const limitedMessages = [
      { role: 'system', content: 'You are a helpful assistant for a role-playing game.' },
      ...messages.map((msg) => ({
        role: msg.sender === 'KP' ? 'assistant' : 'user',
        content: msg.text || '',
      })),
      { role: 'user', content: input.trim() },
    ];
    
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('/api/chat', { messages: limitedMessages });
      const gptReply = { sender: 'KP', text: response.data.reply };
      setMessages((prev) => [...prev, gptReply]);
    } catch (error) {
      console.error('Error calling ChatGPT API:', error);
    } finally {
      setLoading(false);
>>>>>>> 6d065a70eb5e4da086a691f213f138990510b3b6
    }
  };

  return (
<<<<<<< HEAD
    <div className="flex flex-col h-full bg-slate-800/50 border border-emerald-900/30 rounded-lg shadow-lg">
      {/* 角色选择区域 */}
      <div className="p-4 bg-[#0a0d11] border-b border-emerald-900/30">
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
      <div className="flex-1 overflow-y-auto max-h-[400px] bg-[#0a0d11] p-4 border-t border-emerald-900/20 space-y-4 font-lovecraft">
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
                  ? "bg-emerald-800/30 text-emerald-400"
                  : "bg-emerald-900/30 text-emerald-300"
              }`}
            >
              <strong className="block mb-1">{msg.sender}:</strong>
              <ReactMarkdown>{msg.text}</ReactMarkdown>
=======
    <div className={`flex flex-col h-full ${className}`}>
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === 'KP' ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`p-3 rounded-lg max-w-[70%] ${
                msg.sender === 'KP'
                  ? 'bg-slate-950/80 text-emerald-400 border border-emerald-900/30'
                  : 'bg-emerald-900/40 text-emerald-300'
              }`}
            >
              <div className="text-sm opacity-75 mb-1">{msg.sender}</div>
              <ReactMarkdown className="prose prose-sm prose-invert max-w-none">
                {msg.text}
              </ReactMarkdown>
>>>>>>> 6d065a70eb5e4da086a691f213f138990510b3b6
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
<<<<<<< HEAD
            <div className="text-emerald-500 text-sm">KP 正在输入...</div>
          </div>
        )}
      </div>

      {/* 输入区域 */}
      <div className="flex items-center p-4 bg-[#0a0d11] border-t border-emerald-900/30">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress} // 添加回车发送功能
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
=======
            <div className="text-emerald-500 text-sm animate-pulse">KP 正在输入...</div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-950/60 border-t border-emerald-900/20">
        <div className="flex gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-slate-700/50 border border-emerald-900/30 rounded-lg px-4 py-2 text-emerald-500 focus:outline-none focus:border-emerald-700/50"
            placeholder="输入内容..."
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className={`px-6 rounded-lg font-medium transition-all ${
              loading
                ? 'bg-slate-800/50 text-slate-500 cursor-not-allowed'
                : 'bg-emerald-900/50 text-emerald-400 hover:bg-emerald-800/50'
            }`}
          >
            发送
          </button>
        </div>
      </div>
    </div>
  );
}
>>>>>>> 6d065a70eb5e4da086a691f213f138990510b3b6
