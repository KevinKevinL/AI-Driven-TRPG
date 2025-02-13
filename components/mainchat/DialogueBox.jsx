import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

export default function DialogueBox({ messages, setMessages }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  // npcChats 用于存储每个 NPC 的聊天记录，键为 NPC 名称，值为消息数组
  const [npcChats, setNpcChats] = useState({});
  // 用于控制当前激活的 NPC 聊天窗口
  const [activeNpc, setActiveNpc] = useState(null);
  const [showNpcModal, setShowNpcModal] = useState(false);

  const handleSend = async () => {
    if (input.trim() === "") return;

    const userMessage = { sender: "玩家", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post("/api/chat", {
        input,
        role: "KP", // 使用 KP 身份对话
      });

      let reply;
      // 如果回复为对象且含有 text 字段，则认为返回结构为 { text, talkRequired }
      if (typeof response.data.reply === "object" && response.data.reply.text !== undefined) {
        reply = response.data.reply;
      } else {
        reply = { text: response.data.reply, talkRequired: [] };
      }

      const gptReply = { sender: "KP", text: reply.text };
      setMessages((prev) => [...prev, gptReply]);

      // 如果回复中包含 talkRequired 数组，则更新 npcChats 中对应 NPC
      if (reply.talkRequired && Array.isArray(reply.talkRequired)) {
        reply.talkRequired.forEach((npcName) => {
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

      const replyText =
        typeof response.data.reply === "object"
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

  // 打开 NPC 聊天弹窗
  const openNpcModal = (npcName) => {
    setActiveNpc(npcName);
    setShowNpcModal(true);
  };

  // 关闭 NPC 聊天弹窗
  const closeNpcModal = () => {
    setShowNpcModal(false);
    setActiveNpc(null);
  };

  return (
    <div className="flex flex-col h-full rounded-lg">
      {/* 主聊天区域（KP 对话） */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-lovecraft custom-scrollbar">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === "KP" ? "justify-start" : "justify-end"}`}
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

      {/* 如果有 NPC 对话，则显示按钮打开对应 NPC 聊天弹窗 */}
      {Object.keys(npcChats).length > 0 && (
        <div className="p-4 flex space-x-4">
          {Object.keys(npcChats).map((npcName) => (
            <button
              key={npcName}
              onClick={() => openNpcModal(npcName)}
              className="px-4 py-2 bg-emerald-900/50 text-emerald-400 rounded hover:bg-emerald-800/50"
            >
              与 {npcName} 对话
            </button>
          ))}
        </div>
      )}

      {/* NPC 聊天弹窗 */}
      {showNpcModal && activeNpc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-slate-800 p-6 rounded-lg w-11/12 max-w-md relative">
            <button
              onClick={closeNpcModal}
              className="absolute top-2 right-2 text-emerald-400 hover:text-emerald-200"
            >
              关闭
            </button>
            <h3 className="text-2xl font-bold text-emerald-400 mb-4">
              与 {activeNpc} 对话
            </h3>
            <div className="h-64 overflow-y-auto p-2 space-y-2 custom-scrollbar">
              {npcChats[activeNpc].map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === activeNpc ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`p-2 rounded max-w-[80%] shadow ${
                      msg.sender === activeNpc
                        ? "bg-emerald-950/60 text-emerald-400"
                        : "bg-emerald-900/60 text-emerald-300"
                    }`}
                  >
                    <strong className="block mb-1">{msg.sender}:</strong>
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center mt-4">
              <input
                type="text"
                placeholder="输入内容..."
                className="flex-1 bg-emerald-900/20 border border-emerald-900/30 rounded-lg px-4 py-2 text-emerald-400 focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    const inputValue = e.target.value;
                    handleNpcSend(activeNpc, inputValue);
                    e.target.value = "";
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* KP 输入区域 */}
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
          className={`ml-4 px-4 py-2 rounded-lg font-semibold tracking-wide transition-all ${
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
