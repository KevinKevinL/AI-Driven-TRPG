import { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

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
    }
  };

  return (
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
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
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
            className="flex-1 bg-slate-900/50 border border-emerald-900/30 rounded-lg px-4 py-2 text-emerald-400 focus:outline-none focus:border-emerald-700/50"
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