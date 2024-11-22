import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ProfessionCard } from '@components/coc/ProfessionCard';
import { ProfessionInfoModal } from '@components/coc/ProfessionInfoModal';
import { PROFESSIONS } from '@constants/professions';

const ProfessionSelect = () => {
  const [selectedProfession, setSelectedProfession] = useState(null);

  return (
    <>
      <Head>
        <title>COC - 选择调查员职业</title>
        <meta name="description" content="克苏鲁的呼唤 调查员职业选择" />
      </Head>
      
      <div className="min-h-screen bg-[#0a0d11] bg-gradient-radial-emerald py-10">
        <div className="max-w-6xl mx-auto px-6">
          {/* 返回按钮 */}
          <Link 
            href="/coc"
            className="inline-block mb-6 text-emerald-400 hover:text-emerald-300 
                     transition-colors font-lovecraft tracking-wider"
          >
            ← 返回属性生成
          </Link>
          
          {/* 标题 */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-emerald-500 font-lovecraft 
                         tracking-wider drop-shadow-lg">
              克苏鲁的呼唤
              <span className="block text-2xl mt-2 text-emerald-400/80">
                调查员职业选择
              </span>
            </h1>
          </div>
          
          {/* 职业卡片网格 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(PROFESSIONS).map(([key, profession]) => (
              <ProfessionCard
                key={key}
                profession={profession}
                isSelected={selectedProfession?.title === profession.title}
                onSelect={() => setSelectedProfession(profession)}
              />
            ))}
          </div>
          
          <ProfessionInfoModal
            profession={selectedProfession}
            onClose={() => setSelectedProfession(null)}
          />
        </div>
      </div>
    </>
  );
};

export default ProfessionSelect;