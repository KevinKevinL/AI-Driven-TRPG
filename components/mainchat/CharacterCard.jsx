import React, { useEffect, useState } from 'react';
import DatabaseManager from '@components/coc/DatabaseManager';
import { List } from 'lucide-react';

// 简单的模态窗口组件
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-slate-900 border border-emerald-900/30 rounded-lg max-w-3xl max-h-[80vh] w-full m-4 overflow-hidden">
        <div className="p-4 border-b border-emerald-900/30 flex justify-between items-center">
          <h2 className="text-xl font-bold text-emerald-400">{title}</h2>
          <button 
            onClick={onClose}
            className="text-emerald-400 hover:text-emerald-300"
          >
            ×
          </button>
        </div>
        <div className="p-4 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default function CharacterCard({ title }) {
  const [characterData, setCharacterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const character_id = 'ad29155d19c9d6a8a744fc1d794aa8c042b75dc4830a85d6ab87656d6f8d81c7';
  const dbManager = DatabaseManager();

  useEffect(() => {
    const loadCharacterData = async () => {
      try {
        const data = await dbManager.loadCharacterAttributes(character_id);
        setCharacterData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCharacterData();
  }, []);

  if (loading) {
    return (
      <div className="p-4 bg-slate-800/50 border border-emerald-900/30 rounded-lg shadow-lg">
        <p className="text-emerald-300">加载中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-slate-800/50 border border-emerald-900/30 rounded-lg shadow-lg">
        <p className="text-red-500">错误: {error}</p>
      </div>
    );
  }

  if (!characterData) {
    return (
      <div className="p-4 bg-slate-800/50 border border-emerald-900/30 rounded-lg shadow-lg">
        <p className="text-emerald-300">未找到角色数据</p>
      </div>
    );
  }

  const { attributes, derivedAttributes, skills, characterInfo } = characterData;

  return (
    <div className="bg-slate-800/50 border border-emerald-900/30 rounded-lg shadow-lg">
      {/* 基础卡片内容 */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-emerald-400">{characterInfo?.name || '未知'}</h2>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <List size={24} />
          </button>
        </div>

        <div className="flex gap-4">
          {/* 人物立绘占位 */}
          <div className="w-32 h-40 bg-slate-700/50 rounded flex items-center justify-center">
            <span className="text-emerald-300/50">立绘</span>
          </div>

          {/* 基础状态信息 */}
          <div className="flex flex-col justify-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-emerald-300">生命值:</span>
              <div className="w-32 h-4 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-500 transition-all duration-300" 
                  style={{width: `${(derivedAttributes?.hitPoints || 0) / derivedAttributes?.hitPoints * 100}%`}}
                ></div>
              </div>
              <span className="text-emerald-300">{derivedAttributes?.hitPoints || 0}/{derivedAttributes?.hitPoints}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-300">理智值:</span>
              <div className="w-32 h-4 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300" 
                  style={{width: `${(derivedAttributes?.sanity || 0) / derivedAttributes?.sanity * 100}%`}}
                ></div>
              </div>
              <span className="text-emerald-300">{derivedAttributes?.sanity || 0}/{derivedAttributes?.sanity}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 详情模态窗口 */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${characterInfo?.name || '未知'} - 角色详情`}
      >
        {/* 基本信息 */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-emerald-400 mb-2">基本信息</h3>
          <div className="grid grid-cols-2 gap-2 text-emerald-300">
            <p>性别: {characterInfo?.gender || '未知'}</p>
            <p>居住地: {characterInfo?.residence || '未知'}</p>
            <p>出生地: {characterInfo?.birthplace || '未知'}</p>
          </div>
        </div>

        {/* 基础属性 */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-emerald-400 mb-2">基础属性</h3>
          <div className="grid grid-cols-3 gap-2 text-emerald-300">
            <p>力量: {attributes?.strength || 0}</p>
            <p>体质: {attributes?.constitution || 0}</p>
            <p>体型: {attributes?.size || 0}</p>
            <p>敏捷: {attributes?.dexterity || 0}</p>
            <p>外貌: {attributes?.appearance || 0}</p>
            <p>智力: {attributes?.intelligence || 0}</p>
            <p>意志: {attributes?.power || 0}</p>
            <p>教育: {attributes?.education || 0}</p>
            <p>幸运: {attributes?.luck || 0}</p>
          </div>
        </div>

        {/* 派生属性 */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-emerald-400 mb-2">派生属性</h3>
          <div className="grid grid-cols-3 gap-2 text-emerald-300">
            <p>魔法值: {derivedAttributes?.magicPoints || 0}</p>
            <p>移动速度: {derivedAttributes?.moveRate || 0}</p>
            <p>伤害加值: {derivedAttributes?.damageBonus || 0}</p>
            <p>体格: {derivedAttributes?.build || 0}</p>
          </div>
        </div>

        {/* 技能 */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-emerald-400 mb-2">技能</h3>
          <div className="grid grid-cols-3 gap-2 text-emerald-300">
            <p>格斗: {skills?.Fighting || 0}</p>
            <p>枪械: {skills?.Firearms || 0}</p>
            <p>闪避: {skills?.Dodge || 0}</p>
            <p>机械: {skills?.Mechanics || 0}</p>
            <p>驾驶: {skills?.Drive || 0}</p>
            <p>潜行: {skills?.Stealth || 0}</p>
            <p>侦查: {skills?.Investigate || 0}</p>
            <p>巧手: {skills?.Sleight_of_Hand || 0}</p>
            <p>电子: {skills?.Electronics || 0}</p>
            <p>历史: {skills?.History || 0}</p>
            <p>科学: {skills?.Science || 0}</p>
            <p>医学: {skills?.Medicine || 0}</p>
            <p>神秘学: {skills?.Occult || 0}</p>
            <p>图书馆使用: {skills?.Library_Use || 0}</p>
            <p>艺术: {skills?.Art || 0}</p>
            <p>交际: {skills?.Persuade || 0}</p>
            <p>心理学: {skills?.Psychology || 0}</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}