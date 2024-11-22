import React from 'react';
import { Info } from 'lucide-react';

export const ProfessionCard = ({ profession, onSelect, isSelected }) => (
  <div
    onClick={onSelect}
    className={`relative p-6 rounded-lg shadow-lg cursor-pointer 
                transition-all transform hover:scale-105 border
                backdrop-blur-sm
                ${
                  isSelected 
                  ? "bg-emerald-900/50 text-emerald-400 border-emerald-900/30 shadow-emerald-900/50" 
                  : "bg-slate-800/50 text-gray-100 border-emerald-900/10 shadow-emerald-900/30"
                }
                hover:shadow-emerald-700/50`}
  >
    <h3 className="text-xl font-bold mb-2 font-lovecraft tracking-wide">
      {profession.title}
    </h3>
    <p className="text-sm opacity-80">
      {profession.description}
    </p>
    {isSelected && (
      <div className="absolute top-4 right-4 text-emerald-400">
        <Info className="w-6 h-6" />
      </div>
    )}
  </div>
);