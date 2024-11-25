// characterState.js

class Character {
    constructor() {
      this.profession = null;
      this.attributes = null;
      this.skills = {};
      this.metadata = {
        name: '',
        age: 25,
        gender: '',
        residence: '',
        birthplace: '',
        description: ''
      };
      this.creditRating = 0;
      this.equipment = [];
      this.backstory = '';
      this.notes = '';
    }
  
    // 设置职业
    setProfession(profession) {
      this.profession = profession;
    }
  
    // 设置基础属性和派生属性
    setAttributes(attributes) {
      this.attributes = attributes;
    }
  
    // 设置技能值
    setSkill(skillKey, value) {
      this.skills[skillKey] = value;
    }
  
    // 批量设置技能
    setSkills(skills) {
      this.skills = { ...skills };
    }
  
    // 更新个人信息
    updateMetadata(data) {
      this.metadata = {
        ...this.metadata,
        ...data
      };
    }
  
    // 设置信用评级
    setCreditRating(value) {
      this.creditRating = value;
    }
  
    // 添加装备
    addEquipment(item) {
      this.equipment.push(item);
    }
  
    // 删除装备
    removeEquipment(index) {
      this.equipment = this.equipment.filter((_, i) => i !== index);
    }
  
    // // 设置背景故事
    // setBackstory(story) {
    //   this.backstory = story;
    // }
    // 设置背景信息
    setBackground(background) {
      // 将背景信息拼接成完整的描述写入 backstory
      const { belief, importantPerson, reason, place, possession, trait } = background;
      const backstoryDescription = `
        Belief: ${belief || 'Undefined'}
        Important Person: ${importantPerson || 'Undefined'}
        Reason: ${reason || 'Undefined'}
        Significant Place: ${place || 'Undefined'}
        Treasured Possession: ${possession || 'Undefined'}
        Trait: ${trait || 'Undefined'}
      `;
      this.backstory = backstoryDescription.trim();
    }
  
    // 添加笔记
    setNotes(notes) {
      this.notes = notes;
    }
  
    // 导出角色数据
    export() {
      return {
        profession: this.profession,
        attributes: this.attributes,
        skills: this.skills,
        metadata: this.metadata,
        creditRating: this.creditRating,
        equipment: this.equipment,
        backstory: this.backstory,
        notes: this.notes
      };
    }
  
    // 导入角色数据
    import(data) {
      if (data.profession) this.profession = data.profession;
      if (data.attributes) this.attributes = data.attributes;
      if (data.skills) this.skills = data.skills;
      if (data.metadata) this.metadata = { ...this.metadata, ...data.metadata };
      if (data.creditRating) this.creditRating = data.creditRating;
      if (data.equipment) this.equipment = [...data.equipment];
      if (data.backstory) this.backstory = data.backstory;
      if (data.notes) this.notes = data.notes;
    }
  
    // 将角色数据保存到localStorage
    save(key = 'coc-character') {
      const data = this.export();
      localStorage.setItem(key, JSON.stringify(data));
    }
  
    // 从localStorage加载角色数据
    load(key = 'coc-character') {
      const data = localStorage.getItem(key);
      if (data) {
        this.import(JSON.parse(data));
        return true;
      }
      return false;
    }
  
    // 检查角色是否完整
    validate() {
      const checks = {
        hasProfession: !!this.profession,
        hasAttributes: !!this.attributes,
        hasRequiredSkills: this.profession ? 
          this.profession.skills.every(skill => 
            Object.keys(this.skills).includes(skill)
          ) : false,
        hasValidCreditRating: this.validateCreditRating(),
        hasBasicInfo: !!(this.metadata.name && this.metadata.age)
      };
  
      return {
        isValid: Object.values(checks).every(v => v),
        checks
      };
    }
  
    // 验证信用评级是否在职业允许范围内
    validateCreditRating() {
      if (!this.profession) return false;
      const [min, max] = this.profession.creditRating.split('-').map(Number);
      return this.creditRating >= min && this.creditRating <= max;
    }
  
    // 清除所有数据
    clear() {
      this.profession = null;
      this.attributes = null;
      this.skills = {};
      this.metadata = {
        name: '',
        age: 25,
        gender: '',
        residence: '',
        birthplace: '',
        description: ''
      };
      this.creditRating = 0;
      this.equipment = [];
      this.backstory = '';
      this.notes = '';
    }
  }
  
  // 创建并导出单例实例
  export const characterState = new Character();
  
  // 用于追踪状态变化的事件系统
  const listeners = new Set();
  
  // 添加状态变化监听器
  export const subscribeToCharacter = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  
  // 通知所有监听器状态已改变
  const notifyListeners = () => {
    listeners.forEach(listener => listener(characterState.export()));
  };
  
  // 创建一个代理来自动通知状态变化
  export const character = new Proxy(characterState, {
    set(target, property, value) {
      target[property] = value;
      notifyListeners();
      return true;
    }
  });
  
  // 示例使用:
  // import { character, subscribeToCharacter } from './characterState';
  // 
  // // 监听状态变化
  // useEffect(() => {
  //   return subscribeToCharacter((newState) => {
  //     console.log('Character state updated:', newState);
  //   });
  // }, []);
  // 
  // // 保存数据
  // character.setProfession(selectedProfession);
  // character.setAttributes(generatedAttributes);
  // character.save();
  // 
  // // 读取数据
  // character.load();
