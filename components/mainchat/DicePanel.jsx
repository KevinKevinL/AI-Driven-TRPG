import React, { useState } from 'react';
import { DiceAnimation } from '@components/coc/DiceAnimation';

const DicePanel = () => {
  const [isRolling, setIsRolling] = useState(false);
  const [result, setResult] = useState(null);
  
  const rollDice = (sides = 100) => {
    setIsRolling(true);
    setResult(null);
    
    setTimeout(() => {
      const roll = Math.floor(Math.random() * sides) + 1;
      setResult(roll);
      setIsRolling(false);
    }, 1000);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-emerald-900 mb-4">骰子面板</h2>
      
      <div className="flex flex-col items-center space-y-4">
        <div className="flex items-center justify-center w-16 h-16 bg-emerald-950/50 rounded-lg">
          <DiceAnimation isRolling={isRolling} />
        </div>
        
        {result && !isRolling && (
          <div className="text-2xl font-bold text-emerald-900">
            {result}
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-2 w-full">
          <button
            onClick={() => rollDice(100)}
            className="px-4 py-2 bg-emerald-950/90 hover:bg-emerald-900/90 text-emerald-400 rounded-lg transition-colors"
          >
            D100
          </button>
          <button
            onClick={() => rollDice(20)}
            className="px-4 py-2 bg-emerald-950/90 hover:bg-emerald-900/90 text-emerald-400 rounded-lg transition-colors"
          >
            D20
          </button>
        </div>
      </div>
    </div>
  );
};

export default DicePanel;