// components/mainchat/DialogueBox.jsx

import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

export default function DialogueBox({ messages, setMessages }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [npcChats, setNpcChats] = useState({}); // Store NPC chat windows

  const handleSend = async () => {
    if (input.trim() === "") return;

    const userMessage = { sender: "Player", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post("/api/chat", {
        input,
        role: "GM", // Default chat with GM
      });

      const replyText = typeof response.data.reply === "object"
        ? JSON.stringify(response.data.reply, null, 2)
        : response.data.reply;

      const gptReply = { sender: "GM", text: replyText };
      setMessages((prev) => [...prev, gptReply]);

      // Handle NPC dialogue if required
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
      const errorMessage = { sender: "System", text: "Error: Unable to connect to server." };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleNpcSend = async (npcName, npcInput) => {
    if (npcInput.trim() === "") return;

    const npcMessage = { sender: "Player", text: npcInput };
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
      const errorMessage = { sender: "System", text: "Error: Unable to connect to server." };
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
      {/* Message display area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-lovecraft">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === "GM" ? "justify-start" : "justify-end"
            }`}
          >
            <div
              className={`p-3 rounded-xl max-w-[70%] shadow-lg ${
                msg.sender === "GM"
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
            <div className="text-emerald-500 text-sm">GM is typing...</div>
          </div>
        )}
      </div>

      {/* NPC chat windows */}
      {Object.keys(npcChats).map((npcName) => (
        <div key={npcName} className="p-4 border-t border-emerald-900/30">
          <h3 className="text-emerald-400">Conversation with {npcName}:</h3>
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
              placeholder={`Say something to ${npcName}...`}
            />
          </div>
        </div>
      ))}

      {/* Input area */}
      <div className="flex items-center p-4 border-t border-emerald-900/30 bg-black/40 backdrop-blur-sm rounded-b-lg">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 bg-emerald-900/20 border border-emerald-900/30 rounded-lg px-4 py-2 text-emerald-400 focus:outline-none"
          placeholder="Enter your message..."
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
          Send
        </button>
      </div>
    </div>
  );
}