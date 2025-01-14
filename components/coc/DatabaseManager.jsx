// DatabaseManager.jsx
import React, { useEffect, useState } from 'react';
import { PROFESSIONS } from '@constants/professions';
import { executeQuery } from '@utils/db/executeQuery';

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

  //加载角色背景
  const loadBackground = async (characterId) => {
    try {
      const query = `
        SELECT 
          beliefs, beliefs_details, 
          important_people, important_people_details, 
          reasons, reasons_details, 
          places, places_details, 
          possessions, possessions_details, 
          traits, traits_details, 
          keylink, keylink_details 
        FROM Backgrounds 
        WHERE character_id = ?
      `;
      const results = await executeQuery(query, [characterId]);
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      console.error('加载背景数据失败:', error);
      throw new Error('加载背景数据失败');
    }
  };
  
  //保存背景
  const saveBackground = async (characterId, background) => {
    try {
      const query = `
        INSERT INTO Backgrounds (
          character_id, 
          beliefs, beliefs_details, 
          important_people, important_people_details, 
          reasons, reasons_details, 
          places, places_details, 
          possessions, possessions_details, 
          traits, traits_details, 
          keylink, keylink_details
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
          beliefs = VALUES(beliefs),
          beliefs_details = VALUES(beliefs_details),
          important_people = VALUES(important_people),
          important_people_details = VALUES(important_people_details),
          reasons = VALUES(reasons),
          reasons_details = VALUES(reasons_details),
          places = VALUES(places),
          places_details = VALUES(places_details),
          possessions = VALUES(possessions),
          possessions_details = VALUES(possessions_details),
          traits = VALUES(traits),
          traits_details = VALUES(traits_details),
          keylink = VALUES(keylink),
          keylink_details = VALUES(keylink_details)
      `;
      const params = [
        characterId,
        background.beliefs, background.beliefs_details,
        background.important_people, background.important_people_details,
        background.reasons, background.reasons_details,
        background.places, background.places_details,
        background.possessions, background.possessions_details,
        background.traits, background.traits_details,
        background.keylink, background.keylink_details, // 新增 keylink_details
      ];
      await executeQuery(query, params);
      return true;
    } catch (error) {
      console.error('保存背景数据失败:', error);
      throw new Error('保存背景数据失败');
    }
  };
  
// 获取地图相关的事件
const getMapEvents = async (mapId) => {
  try {
    const query = `
      SELECT event_ids 
      FROM Maps 
      WHERE id = ?
    `;
    const results = await executeQuery(query, [mapId]);
    
    if (!results || results.length === 0) {
      throw new Error(`未找到地图ID: ${mapId}`);
    }
    
    // 将逗号分隔的字符串转换为数组
    const eventIdsString = results[0].event_ids;
    return eventIdsString ? eventIdsString.split(',').map(id => parseInt(id)) : [];
  } catch (error) {
    console.error('获取地图事件失败:', error);
    throw error;
  }
};

// 获取事件详情
const getEvents = async (eventIds) => {
  try {
    if (!eventIds || eventIds.length === 0) {
      return [];
    }

    const query = `
      SELECT id, event_info, rate, if_happened
      FROM Events 
      WHERE id IN (${eventIds.join(',')})
    `;
    const results = await executeQuery(query, []);
    
    if (!results || results.length === 0) {
      return [];
    }
    
    return results;
  } catch (error) {
    console.error('获取事件详情失败:', error);
    throw error;
  }
};

// 更新事件状态
const updateEventStatus = async (eventIds, happened = true) => {
  try {
    if (!eventIds || eventIds.length === 0) return;

    const query = `
      UPDATE Events 
      SET if_happened = ?
      WHERE id IN (${eventIds.join(',')})
    `;
    await executeQuery(query, [happened ? 1 : 0]);
    
    return true;
  } catch (error) {
    console.error('更新事件状态失败:', error);
    throw error;
  }
};

// 生成随机事件
const generateRandomEvents = async (mapId) => {
  try {
    // 1. 获取地图关联的事件ID
    const eventIds = await getMapEvents(mapId);
    
    // 2. 获取事件详情
    const events = await getEvents(eventIds);
    
    // 3. 根据概率判断事件是否发生
    const occurredEvents = events.filter(event => {
      const probability = event.rate / 100;
      return Math.random() < probability;
    });
    
    // 4. 更新发生的事件状态
    if (occurredEvents.length > 0) {
      const occurredEventIds = occurredEvents.map(event => event.id);
      await updateEventStatus(occurredEventIds, true);
    }
    
    return occurredEvents;
  } catch (error) {
    console.error('生成随机事件失败:', error);
    throw error;
  }
};

// 重置事件状态
const resetEventStatus = async (mapId) => {
  try {
    const eventIds = await getMapEvents(mapId);
    await updateEventStatus(eventIds, false);
    return true;
  } catch (error) {
    console.error('重置事件状态失败:', error);
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
    saveSkills,
    loadBackground,
    saveBackground,
    generateRandomEvents,
    getMapEvents,
    getEvents,
    resetEventStatus,
  };
};

export default DatabaseManager;
