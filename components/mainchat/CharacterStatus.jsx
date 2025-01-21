import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import DatabaseManager from '@components/coc/DatabaseManager';

export default function CharacterStatus() {
  const [characterData, setCharacterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const character_id = 'ad29155d19c9d6a8a744fc1d794aa8c042b75dc4830a85d6ab87656d6f8d81c7';
  const dbManager = DatabaseManager();

  useEffect(() => {
    const loadCharacterData = async () => {
      try {
        const data = await dbManager.loadCharacterAttributes(character_id);
        setCharacterData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadCharacterData();
  }, []);

  if (loading || !characterData) {
    return null;
  }

  const { derivedAttributes, characterInfo } = characterData;

  return (
    <div className="bg-emerald-950/80 rounded-lg p-4 relative min-h-40">
      {/* Character Portrait and Name - Right side */}
      <div className="absolute top-3 right-3 flex flex-col items-center">
        <div className="relative w-20 h-24 rounded overflow-hidden">
          <Image 
            src="/images/Amilia.png"
            alt="Character Portrait"
            fill
            className="object-cover"
            sizes="80px"
            priority
          />
        </div>
        <h3 className="mt-2 text-sm font-medium text-emerald-400 text-center">
          {characterInfo?.name || '未知'}
        </h3>
      </div>

      {/* Status Bars */}
      <div className="pr-28 space-y-3">
        {/* HP Bar */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between">
            <span className="text-sm text-emerald-400">Hp</span>
            <span className="text-sm text-emerald-400">
              {derivedAttributes?.hitPoints || 0}/{derivedAttributes?.hitPoints}
            </span>
          </div>
          <div className="w-full h-3 bg-slate-700/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-red-500 transition-all duration-300" 
              style={{width: `${(derivedAttributes?.hitPoints || 0) / derivedAttributes?.hitPoints * 100}%`}}
            ></div>
          </div>
        </div>

        {/* MP Bar */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between">
            <span className="text-sm text-emerald-400">Mp</span>
            <span className="text-sm text-emerald-400">
              {derivedAttributes?.magicPoints || 0}/{derivedAttributes?.magicPoints}
            </span>
          </div>
          <div className="w-full h-3 bg-slate-700/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-purple-500 transition-all duration-300" 
              style={{width: `${(derivedAttributes?.magicPoints || 0) / derivedAttributes?.magicPoints * 100}%`}}
            ></div>
          </div>
        </div>

        {/* Sanity Bar */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between">
            <span className="text-sm text-emerald-400">San</span>
            <span className="text-sm text-emerald-400">
              {derivedAttributes?.sanity || 0}/{derivedAttributes?.sanity}
            </span>
          </div>
          <div className="w-full h-3 bg-slate-700/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-300" 
              style={{width: `${(derivedAttributes?.sanity || 0) / derivedAttributes?.sanity * 100}%`}}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}