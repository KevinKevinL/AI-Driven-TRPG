import React from 'react';
import { Info } from 'lucide-react'; // 添加这行导入语句

export const ProfessionCard = ({ profession, onCardClick, isSelected }) => (
  <div
    onClick={() => onCardClick(profession)}
    className={`relative p-6 rounded-lg shadow-lg transition-all 
                backdrop-blur-sm flex flex-col justify-between
                min-h-[200px] border cursor-pointer
                ${
                  isSelected 
                  ? "bg-emerald-900/50 text-emerald-400 border-emerald-900/30 shadow-emerald-900/50" 
                  : "bg-slate-800/50 text-gray-100 border-emerald-900/10 shadow-emerald-900/30 hover:border-emerald-900/30"
                }
                hover:shadow-emerald-700/50`}
  >
    <div>
      <h3 className="text-xl font-bold mb-2 font-lovecraft tracking-wide">
        {profession.title}
      </h3>
      <p className="text-sm opacity-80 mb-4">
        {profession.description}
      </p>
    </div>

    {isSelected && (
      <div className="mt-auto">
        <div className="flex items-center justify-between text-emerald-400/80">
          <span className="font-lovecraft text-sm">已选择此职业</span>
          <Info className="w-5 h-5" />
        </div>
      </div>
    )}
  </div>
);