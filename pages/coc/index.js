import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ProfessionCard } from '@components/coc/ProfessionCard';
import { ProfessionInfoModal } from '@components/coc/ProfessionInfoModal';
import { PROFESSIONS } from '@constants/professions';

const COCCharacterCreator = () => {
  const [selectedProfession, setSelectedProfession] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentProfession, setCurrentProfession] = useState(null);
  const router = useRouter();

  const handleCardClick = (profession) => {
    setCurrentProfession(profession);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setCurrentProfession(null);
  };

  const handleProfessionSelect = (profession) => {
    setSelectedProfession(profession);
  };

  const handleContinue = () => {
    if (selectedProfession) {
      router.push({
        pathname: '/coc/attributes',
        query: { profession: selectedProfession.key }  // 使用 key 而不是 title
      });
    }
  };

  return (
    <>
      <Head>
        <title>COC - 调查员创建</title>
        <meta name="description" content="克苏鲁的呼唤 调查员创建" />
      </Head>
      
      <div className="min-h-screen bg-[#0a0d11] bg-gradient-radial-emerald py-10">
        <div className="max-w-6xl mx-auto px-6">
          {/* 标题 */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-emerald-500 font-lovecraft 
                         tracking-wider drop-shadow-lg">
              克苏鲁的呼唤
              <span className="block text-2xl mt-2 text-emerald-400/80">
                调查员创建
              </span>
            </h1>
          </div>

          {/* 选中职业提示 */}
          {selectedProfession && (
            <div className="text-center mb-4">
              <p className="text-emerald-400 font-lovecraft">
                已选择: {selectedProfession.title}
              </p>
            </div>
          )}
          
          {/* 职业卡片网格 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(PROFESSIONS).map(([key, profession]) => (
              <ProfessionCard
                key={key}
                profession={profession}
                isSelected={selectedProfession?.title === profession.title}
                onCardClick={handleCardClick}
              />
            ))}
          </div>

          {/* 继续按钮 */}
          {selectedProfession && (
            <div className="mt-8 text-center">
              <button
                onClick={handleContinue}
                className="bg-emerald-900/50 text-emerald-400 px-8 py-3 rounded-lg 
                         hover:bg-emerald-800/50 transition-colors
                         inline-flex items-center gap-2
                         min-w-[160px] border border-emerald-900/30
                         shadow-lg shadow-emerald-900/30
                         font-lovecraft tracking-wide"
              >
                继续创建角色 →
              </button>
            </div>
          )}
          
          <ProfessionInfoModal
            profession={showModal ? currentProfession : null}
            onClose={handleModalClose}
            onSelect={handleProfessionSelect}
          />
        </div>
      </div>
    </>
  );
};

export default COCCharacterCreator;