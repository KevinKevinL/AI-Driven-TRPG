// 定义 Attributes（基本属性）
export const ATTRIBUTES = [
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
  
  // 定义 Derived Attributes（派生属性）
  export const DERIVED_ATTRIBUTES = [
    { test_id: 10, key: 'sanity', label: '理智值', englishLabel: 'SAN' },
    { test_id: 11, key: 'magicPoints', label: '魔法值', englishLabel: 'MP' },
    { test_id: 12, key: 'interestPoints', label: '兴趣点数', englishLabel: 'Interest' },
    { test_id: 13, key: 'hitPoints', label: '生命值', englishLabel: 'HP' },
    { test_id: 14, key: 'moveRate', label: '移动速度', englishLabel: 'MOV' },
    { test_id: 15, key: 'damageBonus', label: '伤害加值', englishLabel: 'DB' },
    { test_id: 16, key: 'build', label: '体格', englishLabel: 'Build' },
    { test_id: 17, key: 'professionalPoints', label: '职业技能点', englishLabel: 'Profession Points' }
  ];
  
  // 定义 Skills（技能）
  export const SKILLS = [
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
  
  // 统一导出
  export default {
    ATTRIBUTES,
    DERIVED_ATTRIBUTES,
    SKILLS
  };
  