import { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

export default function DialogueBox({ messages, setMessages }) {
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
              content: msg.text || '', // 确保 content 非空
            })),
            { role: 'user', content: input.trim() }, // 添加用户输入
        ];
        
        setInput('');
        setLoading(true);
    
        try {
          // 调用 ChatGPT API
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
        <div className="flex flex-col h-full bg-slate-800/50 border border-emerald-900/30 rounded-lg shadow-lg">
        {/* 对话框标题 */}
        {/* <h2 className="text-2xl font-bold text-emerald-400 text-center font-lovecraft py-4">
          克苏鲁的呼唤
        </h2> */}
  
        {/* 消息显示区域 */}
        <div className="flex-1 overflow-y-auto max-h-[400px] bg-[#0a0d11] p-4 border-t border-emerald-900/20 space-y-4 font-lovecraft">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === 'KP' ? 'justify-start' : 'justify-end'
              }`}
            >
              <div
                className={`p-3 rounded-xl max-w-[70%] shadow-lg ${
                  msg.sender === 'KP'
                    ? 'bg-emerald-800/30 text-emerald-400'
                    : 'bg-emerald-900/30 text-emerald-300'
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
        <div className="flex items-center p-4 bg-[#0a0d11] border-t border-emerald-900/30">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-emerald-900/20 border border-emerald-900/30 rounded-lg px-4 py-2 text-emerald-400 focus:outline-none"
            placeholder="输入内容..."
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className={`ml-4 px-4 py-2 rounded-lg font-semibold tracking-wide transition-all
              ${
                loading
                  ? 'bg-slate-800/50 text-slate-500 cursor-not-allowed'
                  : 'bg-emerald-900/50 text-emerald-400 hover:bg-emerald-800/50'
              }`}
          >
            发送
          </button>
        </div>
      </div>
    );
  }
  
