import { useState } from 'react';
import DialogueBox from '@components/mainchat/DialogueBox';
import CharacterCard from '@components/mainchat/CharacterCard';
import DicePanel from '@components/mainchat/DicePanel';
import Panel from '@components/mainchat/Panel';
import Image from 'next/image';

export default function MainPlay() {
  const [messages, setMessages] = useState([
    { sender: 'KP', text: '在风暴肆虐的黑夜中，调查员正驱车前往阿卡姆...' },
  ]);

  return (
    <div className="flex h-screen bg-slate-950">
      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Left Side - Chat Area (2/3 width) */}
        <div className="w-2/3 h-full relative">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image 
              src="/images/forest-background.png"
              alt="Forest Background"
              fill
              className="object-cover opacity-90"
              priority
              quality={100}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 to-slate-950/40" />
          </div>

          {/* Chat Interface */}
          <div className="relative h-full flex flex-col p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-emerald-400 font-lovecraft tracking-wider">游戏对话</h2>
              <div className="text-emerald-500/60 font-lovecraft">CALL OF CTHULHU</div>
            </div>
            
            <div className="flex-1 bg-slate-950/40 backdrop-blur-sm rounded-lg border border-emerald-900/20 shadow-lg">
              <DialogueBox 
                messages={messages} 
                setMessages={setMessages}
                className="h-full"
              />
            </div>
          </div>
        </div>

        {/* Right Side - Status Panels (1/3 width) */}
        <div className="w-1/3 h-full bg-slate-950/80 border-l border-emerald-900/20 p-6 overflow-y-auto">
          {/* Character Status */}
          <div className="mb-6">
            <CharacterCard />
          </div>

          {/* Dice Panel */}
          <div className="mb-6">
            <DicePanel />
          </div>

          {/* Quick Actions Panel */}
          <div className="mb-6">
            <Panel title="快捷操作" />
          </div>
        </div>
      </div>
    </div>
  );
}