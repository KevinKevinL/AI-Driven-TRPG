export const skillCategories = [
    {
      title: "战斗技能",
      skills: [
        { key: 'fighting', label: '格斗', englishLabel: 'Fighting', description: '空手搏击、使用近战武器的能力', baseValue: 25 },
        { key: 'firearms', label: '枪械', englishLabel: 'Firearms', description: '使用各类枪的能力', baseValue: 20 },
        { key: 'dodge', label: '闪避', englishLabel: 'Dodge', description: '躲避各类攻击的能力', baseValue: 20 }
      ]
    },
    {
      title: "实践技能",
      skills: [
        { key: 'mechanics', label: '机械', englishLabel: 'Mechanics', description: '修理和操作机械设备', baseValue: 10 },
        { key: 'drive', label: '驾驶', englishLabel: 'Drive', description: '驾驶各类交通工具', baseValue: 20 },
        { key: 'stealth', label: '潜行', englishLabel: 'Stealth', description: '隐藏和潜伏的能力', baseValue: 20 },
        { key: 'investigate', label: '侦查', englishLabel: 'Investigate', description: '发现线索和环境细节的能力', baseValue: 25 },
        { key: 'sleightOfHand', label: '巧手', englishLabel: 'Sleight of Hand', description: '开锁和制作钥匙的能力', baseValue: 10 },
        { key: 'electronics', label: '电子', englishLabel: 'Electronics', description: '电子设备操作和维修', baseValue: 10 }
      ]
    },
    {
      title: "知识技能",
      skills: [
        { key: 'history', label: '历史', englishLabel: 'History', description: '历史知识和考古学识', baseValue: 10 },
        { key: 'science', label: '科学', englishLabel: 'Science', description: '基础科学知识(物理、化学、生物)', baseValue: 10 },
        { key: 'medicine', label: '医学', englishLabel: 'Medicine', description: '专业医疗知识和手术能力', baseValue: 5 },
        { key: 'occult', label: '神秘学', englishLabel: 'Occult', description: '克苏鲁神话相关知识', baseValue: 5 },
        { key: 'library', label: '图书馆使用', englishLabel: 'Library Use', description: '查找文献资料的能力', baseValue: 20 },
        { key: 'art', label: '艺术', englishLabel: 'Art', description: '艺术创作和鉴赏能力', baseValue: 5 }
      ]
    },
    {
      title: "社交技能",
      skills: [
        { key: 'persuade', label: '交际', englishLabel: 'Persuade', description: '社交能力和建立人际关系', baseValue: 15 },
        { key: 'psychology', label: '心理学', englishLabel: 'Psychology', description: '理解和分析他人的能力', baseValue: 10 }
      ]
    }
  ];
  
  // 辅助函数：获取所有技能的扁平列表
  export const getAllSkills = () => {
    return skillCategories.reduce((acc, category) => {
      return [...acc, ...category.skills];
    }, []);
  };
  
  // 辅助函数：根据技能key获取技能信息
  export const getSkillByKey = (key) => {
    const allSkills = getAllSkills();
    return allSkills.find(skill => skill.key === key);
  };
  
  // 辅助函数：获取技能的基础值
  export const getSkillBaseValue = (key) => {
    const skill = getSkillByKey(key);
    return skill ? skill.baseValue : 0;
  };