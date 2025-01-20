import { useState } from 'react';
import DialogueBox from '@components/mainchat/DialogueBox';
import CharacterCard from '@components/mainchat/CharacterCard';
import Panel from '@components/mainchat/Panel';
import DicePanel from '@components/mainchat/DicePanel';

export default function MainPlay() {
  const [messages, setMessages] = useState([
    { sender: 'KP', text: '欢迎来到克苏鲁的呼唤...' },
    { sender: '玩家', text: '我想调查这个房间' },
  ]);

  return (
    <div className="min-h-screen bg-[#0a0d11] py-10 text-emerald-400">
      <div className="max-w-6xl mx-auto px-6">
        {/* 页面标题 */}
        <h1 className="text-4xl font-bold text-center font-lovecraft tracking-wider mb-8">
          克苏鲁的呼唤 PLAY
        </h1>

        {/* 主布局 */}
        <div className="grid grid-cols-3 gap-6">
          {/* 左侧：对话区域 */}
          <div className="col-span-2">
            <DialogueBox messages={messages} setMessages={setMessages} />
          </div>

          {/* 右侧：人物卡和功能面板 */}
          <div className="col-span-1 space-y-4">
            <CharacterCard title="当前人物卡" />
            <DicePanel />
            <Panel title="快捷操作" />
          </div>
        </div>
      </div>
    </div>
  );
}