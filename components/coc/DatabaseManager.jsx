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

  // 创建新角色id和name
  const createNewCharacter = async () => {
    try {
      // 生成64位的随机十六进制字符串
      const array = new Uint8Array(32); // 32 bytes = 64 hex chars
      crypto.getRandomValues(array);
      const newId = Array.from(array)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      
      const createCharacterQuery = `
        INSERT INTO Characters (id, name)
        VALUES (?, "NewMan")
      `;
      
      const result = await executeQuery(createCharacterQuery, [newId]);
      localStorage.setItem('currentCharacterId', newId);
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

  // 保存派生属性
  const saveDerivedAttributes = async (characterId, derivedAttributes) => {
    try {
      const derivedattributessql = `
          INSERT INTO DerivedAttributes (
              character_id, sanity, magicPoints, interestPoints,
              hitPoints, moveRate, damageBonus, build, professionalPoints
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
              sanity = VALUES(sanity),
              magicPoints = VALUES(magicPoints),
              interestPoints = VALUES(interestPoints),
              hitPoints = VALUES(hitPoints),
              moveRate = VALUES(moveRate),
              damageBonus = VALUES(damageBonus),
              build = VALUES(build),
              professionalPoints = VALUES(professionalPoints)
      `;
      const params = [
          characterId,
          derivedAttributes.sanity,
          derivedAttributes.magicPoints,
          derivedAttributes.interestPoints,
          derivedAttributes.hitPoints,
          derivedAttributes.moveRate,
          derivedAttributes.damageBonus,
          derivedAttributes.build,
          derivedAttributes.professionalPoints
      ];
      await executeQuery(derivedattributessql, params);
      return true;
    } catch (error) {
      console.error('保存派生属性失败:', error);
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
  
 //保存人物描述
 const saveDetailedDescription = async (characterId, name, gender, residence, birthplace, description, if_npc) => {
  try {
    const query = `
      UPDATE Characters
      SET name = ?,gender = ?,residence = ?,birthplace = ?,description = ?,if_npc = ? WHERE id = ?
    `;

    const params = [
      name,
      gender,
      residence,
      birthplace,
      description,
      if_npc,
      characterId,
    ];
    
    const result = await executeQuery(query, params);
    console.log('数据库更新结果:', result);
    
    return true;
  } catch (error) {
    console.error('保存描述数据失败:', error);
    throw new Error('保存描述数据失败');
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
      SELECT *
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

// 更新一个发生的事件状态
const updateEventStatus = async (eventId, happened = true) => {
  try {
    if (!eventId || eventId.length === 0) return;

    const query = `
      UPDATE Events 
      SET if_happened = ?
      WHERE id=?
    `;
    await executeQuery(query, [happened ? 1 : 0,eventId]);
    
    return true;
  } catch (error) {
    console.error('更新事件状态失败:', error);
    throw error;
  }
};

// 更新多个事件状态
const updateEventStatuses = async (eventId, happened = true) => {
  try {
    if (!eventId || eventId.length === 0) return;

    const query = `
      UPDATE Events 
      SET if_happened = ?
      WHERE id IN (${eventId.join(',')})
    `;
    await executeQuery(query, [happened ? 1 : 0]);
    
    return true;
  } catch (error) {
    console.error('更新事件状态失败:', error);
    throw error;
  }
};

// 生成随机事件,只发生一个
const generateRandomEvents = async (mapId) => {
  
  try {
    console.log('生成随机事件!!!!!!!!');
    // 1. 获取地图关联的事件ID
    const eventIds = await getMapEvents(mapId);
    
    // 2. 获取事件详情
    const events = await getEvents(eventIds);
    
    // 3. 根据概率判断事件是否发生
    const occurredEvents = events.filter(event => {
      const probability = event.rate / 100;
      return Math.random() < probability && !event.if_happened;//唯一事件发生过就不发生
    });
    
    // 4. 更新发生的事件状态
    if (occurredEvents.length > 0) {
      occurredEvents.sort((a, b) => b.rate - a.rate || a.id - b.id);
      const selectedEvent = occurredEvents[0];
      console.log('选择的事件:', selectedEvent);
      const selectedEventId = selectedEvent.id;
      console.log('事件ID:', selectedEventId);
      await updateEventStatus(selectedEventId, true);
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
    await updateEventStatuses(eventIds, false);
    return true;
  } catch (error) {
    console.error('重置事件状态失败:', error);
    throw error;
  }
};

// 根据 testRequired 返回对应的属性对象
const getAttributeByTestRequired = (testRequired) => {
  if (testRequired >= 1 && testRequired <= 9) {
    // 返回 attributes 表中对应的属性
    const attributes = [
      { test_id: 1, key: 'strength', label: '力量', englishLabel: 'STR' },
      { test_id: 2, key: 'constitution', label: '体质', englishLabel: 'CON' },
      { test_id: 3, key: 'size', label: '体型', englishLabel: 'SIZ' },
      { test_id: 4, key: 'dexterity', label: '敏捷', englishLabel: 'DEX' },
      { test_id: 5, key: 'appearance', label: '外貌', englishLabel: 'APP' },
      { test_id: 6, key: 'intelligence', label: '智力', englishLabel: 'INT' },
      { test_id: 7, key: 'power', label: '意志', englishLabel: 'POW' },
      { test_id: 8, key: 'education', label: '教育', englishLabel: 'EDU' },
      { test_id: 9, key: 'luck', label: '幸运', englishLabel: 'Luck' }
    ];

    return attributes[testRequired - 1]; // 返回对应的属性对象
  } else if (testRequired >= 10 && testRequired <= 17) {
    // 返回 derivedAttributes 表中对应的属性
    const derivedAttributes = [
      { test_id: 10, key: 'sanity', label: '理智值', englishLabel: 'SAN' },
      { test_id: 11, key: 'magicPoints', label: '魔法值', englishLabel: 'MP' },
      { test_id: 12, key: 'interestPoints', label: '兴趣点数', englishLabel: 'Interest' },
      { test_id: 13, key: 'hitPoints', label: '生命值', englishLabel: 'HP' },
      { test_id: 14, key: 'moveRate', label: '移动速度', englishLabel: 'MOV' },
      { test_id: 15, key: 'damageBonus', label: '伤害加值', englishLabel: 'DB' },
      { test_id: 16, key: 'build', label: '体格', englishLabel: 'Build' },
      { test_id: 17, key: 'professionalPoints', label: '职业技能点', englishLabel: 'Profession Points' }
    ];

    return derivedAttributes[testRequired - 10]; // 返回对应的派生属性对象
  } else {
    // 返回 skills 表中对应的技能
    const skills = [
      { test_id: 18, key: 'fighting', label: '格斗', englishLabel: 'Fighting' },
      { test_id: 19, key: 'firearms', label: '枪械', englishLabel: 'Firearms' },
      { test_id: 20, key: 'dodge', label: '闪避', englishLabel: 'Dodge' },
      { test_id: 21, key: 'mechanics', label: '机械', englishLabel: 'Mechanics' },
      { test_id: 22, key: 'drive', label: '驾驶', englishLabel: 'Drive' },
      { test_id: 23, key: 'stealth', label: '潜行', englishLabel: 'Stealth' },
      { test_id: 24, key: 'investigate', label: '侦查', englishLabel: 'Investigate' },
      { test_id: 25, key: 'sleightOfHand', label: '巧手', englishLabel: 'Sleight of Hand' },
      { test_id: 26, key: 'electronics', label: '电子', englishLabel: 'Electronics' },
      { test_id: 27, key: 'history', label: '历史', englishLabel: 'History' },
      { test_id: 28, key: 'science', label: '科学', englishLabel: 'Science' },
      { test_id: 29, key: 'medicine', label: '医学', englishLabel: 'Medicine' },
      { test_id: 30, key: 'occult', label: '神秘学', englishLabel: 'Occult' },
      { test_id: 31, key: 'library', label: '图书馆使用', englishLabel: 'Library Use' },
      { test_id: 32, key: 'art', label: '艺术', englishLabel: 'Art' },
      { test_id: 33, key: 'persuade', label: '交际', englishLabel: 'Persuade' },
      { test_id: 34, key: 'psychology', label: '心理学', englishLabel: 'Psychology' }
    ];

    return skills[testRequired - 18]; // 返回对应的技能对象
  }
};

// 根据 testRequired 返回对应的表
const getTableForTestRequired = (testRequired) => {
  if (testRequired >= 1 && testRequired <= 9) {
    return 'Attributes'; // 对应属性表
  } else if (testRequired >= 10 && testRequired <= 17) {
    return 'DerivedAttributes'; // 对应派生属性表
  } else {
    return 'Skills'; // 对应技能表
  }
};

// 根据 testRequired 和 testCharacterId 查找角色属性值
const getCharacterAttributeValue = async (testRequired, testCharacterId) => {
  const attribute = getAttributeByTestRequired(testRequired);
  const table = getTableForTestRequired(testRequired);  // 获取相应的表（属性、派生属性、技能）

  let query = '';
  if (table === 'Attributes') {
    query = `SELECT ${attribute.key} FROM Attributes WHERE character_id = ?`;
  } else if (table === 'DerivedAttributes') {
    query = `SELECT ${attribute.key} FROM DerivedAttributes WHERE character_id = ?`;
  } else if (table === 'Skills') {
    query = `SELECT ${attribute.key} FROM Skills WHERE character_id = ?`;
  }

  try {
    const result = await executeQuery(query, [testCharacterId]);
    if (result && result.length > 0) {
      return result[0][attribute.key];  // 返回对应属性的值
    } else {
      console.log('没有找到该角色的属性');
      return null;
    }
  } catch (err) {
    console.error('数据库查询失败:', err);
    return null;
  }
};


  // 组件加载时初始化
  useEffect(() => {
    const initialize = async () => {
      //待优化————————————————————————————————————————————————————————————
      await initializeProfessions();
      
      // 从localStorage获取当前角色ID
      const storedId = localStorage.getItem('currentCharacterId');
      if (storedId) {
        setCurrentCharacterId(storedId);
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
    saveDerivedAttributes,
    saveSkills,
    loadBackground,
    saveBackground,
    saveDetailedDescription,
    generateRandomEvents,
    getMapEvents,
    getEvents,
    resetEventStatus,
    getAttributeByTestRequired,
    getTableForTestRequired,
    getCharacterAttributeValue,
  };
};

export default DatabaseManager;
