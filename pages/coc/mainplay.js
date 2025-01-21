import { useState, useEffect } from 'react';
import DialogueBox from '@components/mainchat/DialogueBox';
import CharacterCard from '@components/mainchat/CharacterCard';
import DicePanel from '@components/mainchat/DicePanel';
import Panel from '@components/mainchat/Panel';
import Image from 'next/image';
import RainEffect from '@components/mainchat/RainEffect';
import { Menu, X } from 'lucide-react';

export default function MainPlay() {
  const [messages, setMessages] = useState([
    { sender: 'KP', text: '在风暴肆虐的黑夜中，调查员正驱车前往阿卡姆...' },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle ESC key press
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  return (
    <div className="flex h-screen bg-slate-950">
      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Left Chat Section */}
        <div className="flex-1 relative">
          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-center">
            <button 
              className="p-2 rounded-lg bg-emerald-800/80 hover:bg-emerald-700/80 transition-colors"
              onClick={() => setIsModalOpen(true)}
            >
              <Menu className="text-white" size={24} />
            </button>
            <div className="text-emerald-700/80 font-lovecraft">CALL OF CTHULHU</div>
          </div>

          {/* Chat Area */}
          <div className="h-full relative pt-16 px-6 pb-6">
            <div className="h-full flex flex-col">
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
        </div>

        {/* Right Panel Section */}
        <div className="w-64 p-4 space-y-4 bg-slate-900/60 backdrop-blur-sm">
          {/* Dice Panel */}
          <div className="bg-emerald-0 rounded-lg">
            <DicePanel />
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-emerald-0 rounded-lg">
            <Panel title="快捷操作" />
          </div>
        </div>
      </div>

      {/* Modal */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-2/5 transition-transform duration-300 ease-in-out transform ${
          isModalOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Modal Content */}
        <div className="relative h-full w-full">
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 z-10 p-1 rounded-full bg-emerald-800/80 hover:bg-emerald-700/80 transition-colors"
            onClick={() => setIsModalOpen(false)}
          >
            <X className="text-white" size={20} />
          </button>

          {/* Paper Background */}
          <div className="absolute inset-0">
            <Image
              src="/images/takingthepad2.png"
              alt="Paper Background"
              fill
              className="object-cover opacity-90"
              priority
              quality={100}
            />
            <div className="absolute inset-0 bg-emerald-10/40" />
          </div>

          {/* Content Container */}
          <div className="relative h-full p-6 pt-4 pl-12 overflow-y-auto">
            {/* Character Status */}
            <div className="mb-8 ml-auto mr-2 pl-12">
              <CharacterCard />
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300"
          onClick={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}