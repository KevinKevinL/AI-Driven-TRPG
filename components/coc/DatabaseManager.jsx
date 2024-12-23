// DatabaseManager.jsx
import React, { useEffect, useState } from 'react';
import { PROFESSIONS } from '@constants/professions';
import { executeQuery } from '@/utils/db/executeQuery';

// 使用模块级变量来确保在所有组件实例中共享状态
let isInitializing = false;
let professionInitComplete = false;

const DatabaseManager = () => {
  const [currentCharacterId, setCurrentCharacterId] = useState(null);
  const [dbStatus, setDbStatus] = useState('');
  const [error, setError] = useState(null);

  // 创建新角色并获取ID
  const createNewCharacter = async () => {
    try {
      const createCharacterQuery = `
        INSERT INTO Characters (name)
        VALUES ("新调查员")
      `;
      const result = await executeQuery(createCharacterQuery);
      const newId = result.insertId;
      
      setCurrentCharacterId(newId);
      setDbStatus(`创建了新角色，ID: ${newId}`);
      return newId;
    } catch (err) {
      setError(`创建角色失败: ${err.message}`);
      return null;
    }
  };

  // 初始化职业数据
  const initializeProfessions = async () => {
    // 如果已经完成初始化或正在初始化，直接返回
    if (professionInitComplete || isInitializing) {
      return;
    }

    // 标记开始初始化
    isInitializing = true;

    try {
      // 检查职业表是否为空
      const checkQuery = `SELECT COUNT(*) as count FROM Professions`;
      const result = await executeQuery(checkQuery);
      
      if (result[0].count === 0) {
        // 创建按顺序插入职业的 Promise 数组
        const professionEntries = Object.entries(PROFESSIONS);
        
        for (const [key, profession] of professionEntries) {
          const insertQuery = `
            INSERT INTO Professions (title, description)
            VALUES (?, ?)
          `;
          await executeQuery(insertQuery, [
            profession.title,
            profession.description
          ]);
        }
        
        setDbStatus(prevStatus => 
          `${prevStatus}; 成功初始化 ${professionEntries.length} 个职业数据`
        );
      }

      // 标记初始化完成
      professionInitComplete = true;
    } catch (err) {
      setError(`初始化职业数据失败: ${err.message}`);
    } finally {
      // 无论成功失败，都标记初始化结束
      isInitializing = false;
    }
  };

  // 保存职业选择
  const saveProfessionChoice = async (characterId, professionTitle) => {
    try {
      const findProfessionQuery = `
        SELECT id, title FROM Professions 
        WHERE title = ?
        LIMIT 1
      `;
      const professionResults = await executeQuery(findProfessionQuery, [professionTitle]);
      
      if (!professionResults || professionResults.length === 0) {
        throw new Error(`职业 "${professionTitle}" 未找到`);
      }
  
      const updateQuery = `
        UPDATE Characters 
        SET profession_id = ? 
        WHERE id = ?
      `;
      await executeQuery(updateQuery, [professionResults[0].id, characterId]);
      
      console.log(`已将角色 ${characterId} 的职业更新为 ${professionTitle} (ID: ${professionResults[0].id})`);
      return true;
    } catch (err) {
      console.error('保存职业选择失败:', err);
      throw new Error(`保存职业选择失败: ${err.message}`);
    }
  };

  // 组件加载时初始化
  useEffect(() => {
    const initialize = async () => {
      await initializeProfessions();
      const newCharacterId = await createNewCharacter();
      if (newCharacterId) {
        console.log(`新角色已创建，ID: ${newCharacterId}`);
      }
    };
    
    initialize();
  }, []);

  return {
    currentCharacterId,
    dbStatus,
    error,
    saveProfessionChoice
  };
};

export default DatabaseManager;