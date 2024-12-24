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
      
      // 保存新的角色ID到localStorage
      localStorage.setItem('currentCharacterId', newId.toString());
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
    if (professionInitComplete || isInitializing) {
      return;
    }

    isInitializing = true;

    try {
      const checkQuery = `SELECT COUNT(*) as count FROM Professions`;
      const result = await executeQuery(checkQuery);
      
      if (result[0].count === 0) {
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
      }

      professionInitComplete = true;
    } catch (err) {
      setError(`初始化职业数据失败: ${err.message}`);
    } finally {
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

  // 保存基础属性
  const saveAttributes = async (characterId, attributes) => {
    try {
      const attributesSql = `
        INSERT INTO Attributes (
          character_id, strength, constitution, size, dexterity,
          appearance, intelligence, power, education, luck
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          strength = VALUES(strength),
          constitution = VALUES(constitution),
          size = VALUES(size),
          dexterity = VALUES(dexterity),
          appearance = VALUES(appearance),
          intelligence = VALUES(intelligence),
          power = VALUES(power),
          education = VALUES(education),
          luck = VALUES(luck)
      `;
  
      await executeQuery(attributesSql, [
        characterId,
        attributes.strength,
        attributes.constitution,
        attributes.size,
        attributes.dexterity,
        attributes.appearance,
        attributes.intelligence,
        attributes.power,
        attributes.education,
        attributes.luck
      ]);
  
      return true;
    } catch (error) {
      console.error('保存属性失败:', error);
      throw error;
    }
  };

  // 保存技能
  const saveSkills = async (characterId, skills) => {
    try {
      // 先保存技能
      const skillsSql = `
        INSERT INTO Skills (
          character_id, Fighting, Firearms, Dodge, Mechanics,
          Drive, Stealth, Investigate, Sleight_of_Hand,
          Electronics, History, Science, Medicine, Occult,
          Library_Use, Art, Persuade, Psychology
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          Fighting = VALUES(Fighting),
          Firearms = VALUES(Firearms),
          Dodge = VALUES(Dodge),
          Mechanics = VALUES(Mechanics),
          Drive = VALUES(Drive),
          Stealth = VALUES(Stealth),
          Investigate = VALUES(Investigate),
          Sleight_of_Hand = VALUES(Sleight_of_Hand),
          Electronics = VALUES(Electronics),
          History = VALUES(History),
          Science = VALUES(Science),
          Medicine = VALUES(Medicine),
          Occult = VALUES(Occult),
          Library_Use = VALUES(Library_Use),
          Art = VALUES(Art),
          Persuade = VALUES(Persuade),
          Psychology = VALUES(Psychology)
      `;

      await executeQuery(skillsSql, [
        characterId,
        skills.fighting || 0,
        skills.firearms || 0,
        skills.dodge || 0,
        skills.mechanics || 0,
        skills.drive || 0,
        skills.stealth || 0,
        skills.investigate || 0,
        skills.sleightOfHand || 0,
        skills.electronics || 0,
        skills.history || 0,
        skills.science || 0,
        skills.medicine || 0,
        skills.occult || 0,
        skills.libraryUse || 0,
        skills.art || 0,
        skills.persuade || 0,
        skills.psychology || 0
      ]);

      // 然后更新信用评级
      const updateCreditSql = `
        UPDATE Attributes 
        SET credit_rating = ?
        WHERE character_id = ?
      `;
      
      await executeQuery(updateCreditSql, [
        skills.creditRating || 0,
        characterId
      ]);

      return true;
    } catch (error) {
      console.error('保存技能失败:', error);
      throw error;
    }
  };

  // 组件加载时初始化
  useEffect(() => {
    const initialize = async () => {
      await initializeProfessions();
      
      // 从localStorage获取当前角色ID
      const storedId = localStorage.getItem('currentCharacterId');
      if (storedId) {
        setCurrentCharacterId(parseInt(storedId));
      }
    };
    
    initialize();
  }, []);

  return {
    currentCharacterId,
    dbStatus,
    error,
    createNewCharacter,
    saveProfessionChoice,
    saveAttributes,
    saveSkills
  };
};

export default DatabaseManager;