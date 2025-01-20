import { useState } from 'react';
import DialogueBox from '@components/mainchat/DialogueBox';
import CharacterCard from '@components/mainchat/CharacterCard';
import DicePanel from '@components/mainchat/DicePanel';
import Panel from '@components/mainchat/Panel';
import Image from 'next/image';
import RainEffect from '@components/mainchat/RainEffect';

export default function MainPlay() {
  const [messages, setMessages] = useState([
    { sender: 'KP', text: '在风暴肆虐的黑夜中，调查员正驱车前往阿卡姆...' },
  ]);

  return (
    <div className="flex h-screen bg-slate-950">
      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/*        
        <Image
          src="/images/forest-background.png"
          alt="Forest Background"
          fill
          className="object-cover opacity-100"
          priority
          quality={100}
        /> 
        */}

        {/* Left Side - Chat Area (2/3 width) */}
        <div className="w-4/5 h-full relative p-6">
          
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-emerald-900 font-lovecraft tracking-wider"></h2>
              <div className="text-emerald-700/80 font-lovecraft">CALL OF CTHULHU</div>
            </div>

            {/* Chat Interface with Background */}
            <div className="flex-1 relative rounded-lg overflow-hidden">
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src="/images/forest-background.png"
                  alt="Forest Background"
                  fill
                  className="object-cover opacity-100"
                  priority
                  quality={100}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 to-slate-950/60" />
                {/* Add Rain Effect */}
                <RainEffect intensity={3} color="rgba(204, 230, 255, 0.4)" speed={70} />
              </div>

              {/* DialogueBox with transparent background */}
              <div className="relative h-full bg-slate-90/60 backdrop-blur-sm">
                <DialogueBox
                  messages={messages}
                  setMessages={setMessages}
                  className="h-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Status Panels (1/3 width) */}
        <div className="w-1/3 h-full relative">
          {/* Paper Background */}
          <div className="absolute inset-0">
            <Image
              src="/images/paperPad.png"
              alt="Paper Background"
              fill
              className="object-cover opacity-90"
              priority
              quality={100}
            />
            <div className="absolute inset-0 bg-emerald-10/40" />
          </div>

          {/* Content Container */}
          <div className="relative h-full p-12 pt-12 overflow-y-auto">
            {/* Character Status */}
            <div className="mb-4 transform scale-90 origin-top">
              <CharacterCard />
            </div>

            {/* Dice Panel */}
            <div className="mb-7 bg-emerald-0 rounded-lg">
              <DicePanel />
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-emerald-0 rounded-lg">
              <Panel title="快捷操作" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}