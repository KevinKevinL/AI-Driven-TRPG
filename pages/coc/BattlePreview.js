import React, { useState, useEffect } from 'react';
import { Shield, Sword, Heart, Target, Gun, User } from 'lucide-react';

// 预设角色数据
const PLAYER_DATA = {
  name: '杰克·邦恩斯',
  attributes: {
    strength: 80,
    constitution: 70,
    size: 55,
    intelligence: 40,
    power: 55,
    dexterity: 50,
    appearance: 45,
    education: 50
  },
  derivedAttributes: {
    hitPoints: 12,
    damageBonus: '+1D4',
    build: 1,
    moveRate: 7,
    sanity: 55
  },
  skills: {
    Fighting: 25,
    Dodge: 35,
    Firearms: 35
  },
  weapons: [
    { name: '拳击', damage: '1D3', skill: 25 },
    { name: '.22左轮枪', damage: '1D6', skill: 35 }
  ]
};

const ENEMY_DATA = {
  name: '玛丽·雷克',
  attributes: {
    strength: 40,
    constitution: 50,
    size: 45,
    intelligence: 80,
    power: 50,
    dexterity: 70,
    appearance: 60,
    education: 85
  },
  derivedAttributes: {
    hitPoints: 9,
    damageBonus: '0',
    build: 0,
    moveRate: 8,
    sanity: 50
  },
  skills: {
    Fighting: 25,
    Dodge: 35,
    Firearms: 35
  },
  weapons: [
    { name: '拳击', damage: '1D3', skill: 25 },
    { name: '.22左轮枪', damage: '1D6', skill: 35 }
  ]
};

// 角色属性面板组件
const CharacterPanel = ({ character, isPlayer }) => {
  return (
    <div className="w-full text-white text-sm">
      <div className="border-b border-gray-600 pb-2 mb-2">
        <div className="font-bold text-lg text-yellow-400">{character.name}</div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div>HP: {character.derivedAttributes.hitPoints}</div>
          <div>DB: {character.derivedAttributes.damageBonus}</div>
          <div>Build: {character.derivedAttributes.build}</div>
          <div>Move: {character.derivedAttributes.moveRate}</div>
          <div>SAN: {character.derivedAttributes.sanity}</div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-1 mb-2">
        <div>STR: {character.attributes.strength}</div>
        <div>CON: {character.attributes.constitution}</div>
        <div>SIZ: {character.attributes.size}</div>
        <div>DEX: {character.attributes.dexterity}</div>
        <div>APP: {character.attributes.appearance}</div>
        <div>INT: {character.attributes.intelligence}</div>
        <div>POW: {character.attributes.power}</div>
        <div>EDU: {character.attributes.education}</div>
      </div>

      <div className="border-t border-gray-600 pt-2">
        <div className="font-bold mb-1">武器:</div>
        {character.weapons.map((weapon, index) => (
          <div key={index} className="flex justify-between items-center mb-1">
            <span>{weapon.name}</span>
            <span className="text-gray-400">{weapon.skill}% ({Math.floor(weapon.skill/2)}%/{Math.floor(weapon.skill/5)}%) {weapon.damage}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// 骨骼角色组件
const SkeletonCharacter = ({ isPlayer, isAttacking, isHurt, direction = 'right' }) => {
  return (
    <div className={`relative w-24 h-32 ${direction === 'left' ? '-scale-x-1' : ''}`}>
      {/* 头部 */}
      <div className={`absolute w-12 h-12 bg-gray-800 rounded-full left-6 
        transition-all duration-300 ${isAttacking ? 'rotate-12' : ''} 
        ${isHurt ? 'bg-red-800 animate-shake' : ''}`}>
        {/* 面具 */}
        <div className="absolute w-8 h-8 bg-gray-700 rounded-full top-2 left-2">
          {/* 眼睛 */}
          <div className={`absolute w-2 h-2 rounded-full top-2 left-2
            ${isHurt ? 'bg-yellow-500' : (isPlayer ? 'bg-blue-500' : 'bg-red-500')}`} />
        </div>
      </div>
      
      {/* 躯干 */}
      <div className={`absolute w-8 h-16 bg-gray-800 left-8 top-10 
        transition-all duration-300 ${isAttacking ? 'rotate-12' : ''}
        ${isHurt ? 'bg-red-800' : ''}`}>
        <div className="absolute w-full h-8 bg-gray-700 top-2" />
      </div>
      
      {/* 武器臂 */}
      <div className={`absolute w-16 h-4 bg-gray-800 left-6 top-12
        origin-left transition-all duration-300
        ${isAttacking ? 'rotate-45' : 'rotate-0'}
        ${isHurt ? 'bg-red-800' : ''}`}>
        <div className={`absolute w-12 h-2 right-0 
          ${isPlayer ? 'bg-blue-600' : 'bg-red-600'}`} />
      </div>
      
      {/* 护盾臂 */}
      <div className={`absolute w-12 h-4 bg-gray-800 left-6 top-16
        origin-left transition-all duration-300
        ${isAttacking ? '-rotate-12' : 'rotate-0'}
        ${isHurt ? 'bg-red-800' : ''}`}>
        <div className={`absolute w-8 h-8 rounded-full left-8 -top-2
          ${isPlayer ? 'bg-blue-600' : 'bg-red-600'}`} />
      </div>
      
      {/* 腿部 */}
      <div className="absolute w-full h-8 left-0 top-24">
        <div className={`absolute w-4 h-12 bg-gray-800 left-8
          origin-top transition-all duration-300 animate-leg-left
          ${isHurt ? 'bg-red-800' : ''}`} />
        <div className={`absolute w-4 h-12 bg-gray-800 left-12
          origin-top transition-all duration-300 animate-leg-right
          ${isHurt ? 'bg-red-800' : ''}`} />
      </div>
    </div>
  );
};

const BattlePreview = () => {
  const [selectedWeapon, setSelectedWeapon] = useState(PLAYER_DATA.weapons[0]);
  const [battleState, setBattleState] = useState({
    round: 1,
    turnCount: 0,
    playerTurn: null, // 初始设置为 null，表示回合尚未开始
    playerHealth: PLAYER_DATA.derivedAttributes.hitPoints,
    enemyHealth: ENEMY_DATA.derivedAttributes.hitPoints,
    lastRoll: null,
    message: '战斗开始！',
    gameOver: false,
    enemyAction: 'attack',
    processingAction: false,
    playerAction: null,
    isNewRound: true, // 新增状态，标记是否是新回合
    battleLog: ['[战斗开始] 准备开始战斗！']
  });

  // 处理回合开始和先手判断
  useEffect(() => {
    // 如果是新回合且没有正在处理的动作
    if (battleState.isNewRound && !battleState.processingAction && !battleState.gameOver) {
      const playerFirst = PLAYER_DATA.attributes.dexterity >= ENEMY_DATA.attributes.dexterity;
      setBattleState(prev => ({
        ...prev,
        playerTurn: playerFirst,
        isNewRound: false, // 标记回合已开始
        message: `第${prev.round}回合开始！${playerFirst ? '你' : '敌人'}先手！`,
        battleLog: [...prev.battleLog, `[回合${prev.round}] ${playerFirst ? '你' : '敌人'}先手！`]
      }));
    }
  }, [battleState.isNewRound, battleState.processingAction, battleState.gameOver]);

  const [playerAnimation, setPlayerAnimation] = useState({
    isAttacking: false,
    isHurt: false
  });
  
  const [enemyAnimation, setEnemyAnimation] = useState({
    isAttacking: false,
    isHurt: false
  });

  // COC规则的技能检定
  const skillCheck = (skillValue) => {
    const roll = Math.floor(Math.random() * 100) + 1;
    if (roll === 1) return { success: true, type: '大成功', value: roll };
    if (roll === 100) return { success: false, type: '大失败', value: roll };
    if (roll <= skillValue / 5) return { success: true, type: '极难成功', value: roll };
    if (roll <= skillValue / 2) return { success: true, type: '困难成功', value: roll };
    if (roll <= skillValue) return { success: true, type: '常规成功', value: roll };
    return { success: false, type: '失败', value: roll };
  };

  const opposedCheck = (attackerSkill, defenderSkill, isDefenderDodging = false) => {
    const attackRoll = skillCheck(attackerSkill);
    const defendRoll = skillCheck(defenderSkill);
    
    const result = {
      winner: null,
      roll: attackRoll,
      defenderRoll: defendRoll,
      details: {
        defenseType: isDefenderDodging ? '闪避' : '格挡',
        desc: ''
      },
      partialHit: false
    };
   
    // 双方失败 
    if (!attackRoll.success && !defendRoll.success) {
      result.winner = 'none';
      result.details.desc = `攻击者${attackRoll.type}(D100=${attackRoll.value})，防守者${defendRoll.type}(D100=${defendRoll.value})，双方都失败！`;
      return result;
    }
   
    // 大成功/大失败优先判定
    if (attackRoll.value === 1 && defendRoll.value !== 1) {
      result.winner = 'attacker';
      result.details.desc = `攻击者大成功！防守者${defendRoll.type}(D100=${defendRoll.value})`;
      return result;
    }
    if (defendRoll.value === 1 && attackRoll.value !== 1) {
      result.winner = 'defender';
      result.details.desc = `防守者大成功，${result.details.defenseType}完美成功！攻击者${attackRoll.type}(D100=${attackRoll.value})`;
      return result;
    }
    if (attackRoll.value === 100 && defendRoll.value !== 100) {
      result.winner = 'defender';
      result.details.desc = `攻击者大失败！防守者${defendRoll.type}(D100=${defendRoll.value})`;
      return result;
    }
    if (defendRoll.value === 100 && attackRoll.value !== 100) {
      result.winner = 'attacker';
      result.details.desc = `防守者大失败，${result.details.defenseType}彻底失败！攻击者${attackRoll.type}(D100=${attackRoll.value})`;
      return result;
    }
   
    // 攻击失败，防守自动胜利
    if (!attackRoll.success) {
      result.winner = 'defender';
      result.details.desc = `攻击${attackRoll.type}(D100=${attackRoll.value})，${result.details.defenseType}成功防御！`;
      return result;
    }
   
    // 防守失败但攻击成功，攻击者胜利
    if (!defendRoll.success && attackRoll.success) {
      result.winner = 'attacker';
      result.details.desc = `攻击${attackRoll.type}(D100=${attackRoll.value})，${result.details.defenseType}${defendRoll.type}(D100=${defendRoll.value})失败！`;
      return result;
    }
   
    // 双方都成功时，比较成功等级
    const getSuccessLevel = (result) => {
      if (result.type === '极难成功') return 3;
      if (result.type === '困难成功') return 2;
      if (result.type === '常规成功') return 1;
      return 0;
    };
   
    const attackLevel = getSuccessLevel(attackRoll);
    const defendLevel = getSuccessLevel(defendRoll);
   
    // 成功等级比较
    if (attackLevel > defendLevel) {
      result.winner = 'attacker';
      result.details.desc = `攻击${attackRoll.type}(D100=${attackRoll.value})优于防守者${defendRoll.type}(D100=${defendRoll.value})，${result.details.defenseType}失败！`;
      return result;
    }
    if (defendLevel > attackLevel) {
      result.winner = 'defender';
      result.details.desc = `防守${defendRoll.type}(D100=${defendRoll.value})优于攻击者${attackRoll.type}(D100=${attackRoll.value})，${result.details.defenseType}成功！`;
      return result;
    }
   
    // 等级相同时，闪避优先于格挡
    if (isDefenderDodging) {
      result.winner = 'defender';
      result.details.desc = `攻击与闪避势均力敌，闪避成功！`;
    } else {
      result.winner = 'attacker';
      result.partialHit = true;
      result.details.desc = `攻击与格挡势均力敌，攻击部分命中！`;
    }
    return result;
   };
   
   const calculateDamage = (weapon, bonusDamage = '0', armor = 0, isPartialHit = false) => {
    let damage = 0;
    
    // 武器伤害
    const [diceCount, diceSides] = weapon.damage.split('D').map(n => parseInt(n));
    for (let i = 0; i < diceCount; i++) {
      damage += Math.floor(Math.random() * diceSides) + 1;
    }
    
    // 伤害加值
    if (bonusDamage.includes('D')) {
      const [bonusCount, bonusSides] = bonusDamage.split('D').map(n => parseInt(n.replace('+', '')));
      for (let i = 0; i < bonusCount; i++) {
        damage += Math.floor(Math.random() * bonusSides) + 1;
      }
    }
    
    // 护甲减伤
    damage = Math.max(0, damage - armor);
    
    // 部分命中时伤害减半
    if (isPartialHit) {
      damage = Math.floor(damage / 2);
    }
    
    return damage;
   };

  // 战斗动作
  const actions = {
    attack: async () => {
      if (!battleState.playerTurn || battleState.gameOver) return;
      
      const result = opposedCheck(
        selectedWeapon.skill,
        ENEMY_DATA.skills.Fighting,
        battleState.enemyAction === 'dodge'
      );
  
      setPlayerAnimation(prev => ({ ...prev, isAttacking: true }));
  
      if (result.winner === 'none') {
        await new Promise(resolve => setTimeout(resolve, 500));
        setBattleState(prev => ({
          ...prev,
          playerTurn: false,
          turnCount: prev.turnCount + 1,
          message: result.details.desc,
          lastRoll: result.roll,
          battleLog: [...prev.battleLog, `[回合${prev.round}] ${result.details.desc}`]
        }));
      } else if (result.winner === 'attacker') {
        const damage = calculateDamage(
          selectedWeapon,
          PLAYER_DATA.derivedAttributes.damageBonus,
          ENEMY_DATA.armor
        );
        setEnemyAnimation(prev => ({ ...prev, isHurt: true }));
        await new Promise(resolve => setTimeout(resolve, 500));
  
        setBattleState(prev => ({
          ...prev,
          enemyHealth: Math.max(0, prev.enemyHealth - damage),
          playerTurn: false,
          message: `${result.details.desc} 造成 ${damage} 点伤害！`,
          lastRoll: result.roll,
          battleLog: [...prev.battleLog, `[回合${prev.round}] ${result.details.desc} 造成 ${damage} 点伤害！`]
        }));
      } else {
        await new Promise(resolve => setTimeout(resolve, 500));
        setBattleState(prev => ({
          ...prev,
          playerTurn: false,
          message: result.details.desc,
          lastRoll: result.roll,
          battleLog: [...prev.battleLog, `[回合${prev.round}] ${result.details.desc}`]
        }));
      }
  
      setPlayerAnimation(prev => ({ ...prev, isAttacking: false }));
      setEnemyAnimation(prev => ({ ...prev, isHurt: false }));
    },
    
    dodge: async () => {
      if (!battleState.playerTurn || battleState.gameOver) return;
      setBattleState(prev => ({
        ...prev,
        playerTurn: false,
        message: '准备闪避...'
      }));
    }
  };

  // 处理回合结束和新回合开始
  const handleTurnEnd = (state, newMessage) => {
    const newTurnCount = state.turnCount + 1;
    const shouldAdvanceRound = newTurnCount >= 2;
    
    if (shouldAdvanceRound) {
      return {
        ...state,
        turnCount: 0,
        round: state.round + 1,
        // 新回合时重新判定先手
        playerTurn: PLAYER_DATA.attributes.dexterity >= ENEMY_DATA.attributes.dexterity,
        message: newMessage,
        battleLog: [
          ...state.battleLog, 
          newMessage,
          `[新回合] 第${state.round + 1}回合开始！${PLAYER_DATA.attributes.dexterity >= ENEMY_DATA.attributes.dexterity ? '你' : '敌人'}先手！`
        ]
      };
    }
    
    return {
      ...state,
      turnCount: newTurnCount,
      playerTurn: !state.playerTurn,
      message: newMessage,
      battleLog: [...state.battleLog, newMessage]
    };
  };
// AI 回合
useEffect(() => {
  if (
    battleState.playerTurn === null || // 等待回合初始化
    battleState.playerTurn === true || // 玩家回合
    battleState.gameOver || 
    battleState.processingAction ||
    battleState.isNewRound || // 等待新回合初始化
    battleState.enemyHealth <= 0 // 敌人已死亡
  ) return;

  const processEnemyTurn = async () => {
    setBattleState(prev => ({ ...prev, processingAction: true }));

    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // 减少延迟时间
      
      const enemyWeapon = ENEMY_DATA.weapons[Math.floor(Math.random() * ENEMY_DATA.weapons.length)];
      const willDodge = Math.random() < 0.3;

      if (willDodge) {
        setBattleState(prev => ({
          ...prev,
          playerTurn: true, // 设置为玩家回合
          processingAction: false,
          enemyAction: 'dodge',
          turnCount: prev.turnCount + 1,
          message: `[回合${prev.round}] 敌人选择了闪避`,
          battleLog: [...prev.battleLog, `[回合${prev.round}] 敌人选择了闪避`]
        }));
        return;
      }

      const result = opposedCheck(
        enemyWeapon.skill,
        battleState.playerAction === 'dodge' ? PLAYER_DATA.skills.Dodge : PLAYER_DATA.skills.Fighting,
        battleState.playerAction === 'dodge'
      );

      setEnemyAnimation(prev => ({ ...prev, isAttacking: true }));
      await new Promise(resolve => setTimeout(resolve, 500));

      if (result.winner === 'attacker') {
        const damage = calculateDamage(
          enemyWeapon,
          ENEMY_DATA.derivedAttributes.damageBonus,
          PLAYER_DATA.armor
        );

        setPlayerAnimation(prev => ({ ...prev, isHurt: true }));
        await new Promise(resolve => setTimeout(resolve, 500));

        const newMessage = `敌人${result.roll.type}！造成 ${damage} 点伤害！(D100=${result.roll.value})`;
        setBattleState(prev => ({
          ...handleTurnEnd(prev, newMessage),
          playerHealth: Math.max(0, prev.playerHealth - damage),
          lastRoll: result.roll,
          processingAction: false
        }));
      } else {
        const newMessage = `敌人的攻击被${battleState.playerAction === 'dodge' ? '闪避' : '格挡'}了！(D100=${result.roll.value})`;
        setBattleState(prev => ({
          ...handleTurnEnd(prev, newMessage),
          lastRoll: result.roll,
          processingAction: false
        }));
      }

      setEnemyAnimation(prev => ({ ...prev, isAttacking: false }));
      setPlayerAnimation(prev => ({ ...prev, isHurt: false }));

    } catch (error) {
      console.error('Enemy turn error:', error);
      setBattleState(prev => ({
        ...prev,
        processingAction: false,
        message: '敌人行动出错！'
      }));
      setEnemyAnimation({ isAttacking: false, isHurt: false });
      setPlayerAnimation({ isAttacking: false, isHurt: false });
    }
  };

  processEnemyTurn();
}, [battleState.playerTurn, battleState.gameOver, battleState.processingAction, battleState.isNewRound]);
  // 检查战斗结束
  useEffect(() => {
    if (battleState.playerHealth <= 0) {
      setBattleState(prev => ({
        ...prev,
        gameOver: true,
        message: '你被击败了...'
      }));
    } else if (battleState.enemyHealth <= 0) {
      setBattleState(prev => ({
        ...prev,
        gameOver: true,
        message: '胜利！'
      }));
    }
  }, [battleState.playerHealth, battleState.enemyHealth]);


  return (
    <div className="w-full max-w-6xl mx-auto p-4 bg-gray-100 rounded-lg">
      <div className="grid grid-cols-[300px_1fr_300px] gap-4">
        {/* 左侧属性面板 */}
        <div className="bg-gray-800 rounded-lg p-4">
          <CharacterPanel character={PLAYER_DATA} isPlayer={true} />
        </div>

        {/* 中央战斗场景 */}
        <div className="h-[32rem] bg-gray-800 relative rounded-lg overflow-hidden">

        {/* 场景装饰 */}
        <div className="absolute inset-0 bg-opacity-20">
          <div className="absolute bottom-0 w-full h-24 bg-gray-900" />
          <div className="absolute bottom-24 w-full h-px bg-gray-600" />
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-16 bg-gray-700"
              style={{ left: `${i * 25}%`, bottom: '24px' }}
            />
          ))}
        </div>

        {/* 玩家角色 */}
        <div className={`absolute bottom-24 transition-all duration-500 
          ${playerAnimation.isAttacking ? 'translate-x-16' : ''}`}
          style={{ left: '100px' }}
        >
          <SkeletonCharacter 
            isPlayer={true}
            isAttacking={playerAnimation.isAttacking}
            isHurt={playerAnimation.isHurt}
            direction="right"
          />
          <div className="w-24 h-2 bg-gray-200 mt-2">
            <div 
              className="h-full bg-green-600 transition-all duration-300" 
              style={{ width: `${(battleState.playerHealth / PLAYER_DATA.derivedAttributes.hitPoints) * 100}%` }}
            />
          </div>
        </div>

        {/* 敌人角色 */}
        <div className={`absolute bottom-24 transition-all duration-500
          ${enemyAnimation.isAttacking ? '-translate-x-16' : ''}`}
          style={{ left: '300px' }}
        >
          <SkeletonCharacter 
            isPlayer={false}
            isAttacking={enemyAnimation.isAttacking}
            isHurt={enemyAnimation.isHurt}
            direction="left"
          />
          <div className="w-24 h-2 bg-gray-200 mt-2">
            <div 
              className="h-full bg-red-600 transition-all duration-300" 
              style={{ width: `${(battleState.enemyHealth / ENEMY_DATA.derivedAttributes.hitPoints) * 100}%` }}
            />
          </div>
        </div>

        {/* 攻击特效 */}
        {(playerAnimation.isAttacking || enemyAnimation.isAttacking) && (
          <div className="absolute inset-0 bg-yellow-500 bg-opacity-10 animate-flash" />
        )}
        </div>

        {/* 右侧属性面板 */}
        <div className="bg-gray-800 rounded-lg p-4">
          <CharacterPanel character={ENEMY_DATA} isPlayer={false} />
        </div>
      </div>

      {/* 战斗信息 */}
      <div className="bg-gray-700 text-white p-4 rounded-lg mb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <Heart className="text-red-500 mr-2" />
              <span>HP: {battleState.playerHealth}/{PLAYER_DATA.derivedAttributes.hitPoints}</span>
            </div>
            <div className="flex items-center">
              <User className="text-blue-500 mr-2" />
              <span>SAN: {PLAYER_DATA.derivedAttributes.sanity}</span>
            </div>
          </div>
          <div className="flex items-center">
            <Target className="text-yellow-500 mr-2" />
            <span>回合: {battleState.round}</span>
          </div>
        </div>
        
        <div className="text-center p-2 bg-gray-800 rounded">
          {battleState.message}
          {battleState.lastRoll && (
            <div className="text-sm opacity-75 mt-1">
              检定结果: {battleState.lastRoll.type}
            </div>
          )}
        </div>
      </div>

      {/* 武器选择 */}
      <div className="flex justify-center gap-4 mb-4">
        {PLAYER_DATA.weapons.map((weapon, index) => (
          <button
            key={index}
            className={`px-4 py-2 rounded ${
              selectedWeapon === weapon 
                ? 'bg-yellow-500 text-white' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            onClick={() => setSelectedWeapon(weapon)}
          >
            {weapon.name} ({weapon.skill}%)
          </button>
        ))}
      </div>

      {/* 操作按钮 */}
      <div className="flex justify-center gap-4">
        <button
          className="flex items-center px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
          onClick={actions.attack}
          disabled={!battleState.playerTurn || battleState.gameOver}
        >
          <Sword className="mr-2" />
          攻击 ({selectedWeapon.skill}%)
        </button>
        <button
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          onClick={actions.dodge}
          disabled={!battleState.playerTurn || battleState.gameOver}
        >
          <Shield className="mr-2" />
          闪避 ({PLAYER_DATA.skills.Dodge}%)
        </button>
      </div>

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        
        .animate-shake {
          animation: shake 0.2s ease-in-out 3;
        }
        
        @keyframes flash {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        
        .animate-flash {
          animation: flash 0.3s ease-in-out 2;
        }
        
        @keyframes leg-left {
          0%, 100% { transform: rotate(-12deg); }
          50% { transform: rotate(12deg); }
        }
        
        @keyframes leg-right {
          0%, 100% { transform: rotate(12deg); }
          50% { transform: rotate(-12deg); }
        }
        
        .animate-leg-left {
          animation: leg-left 2s ease-in-out infinite;
        }
        
        .animate-leg-right {
          animation: leg-right 2s ease-in-out infinite;
        }
      `}</style>


         {/* 战斗日志 */}
         <div className="bg-gray-700 text-white p-4 rounded-lg mb-4">
         <h3 className="font-bold mb-2 text-yellow-400">战斗记录</h3>
         <div className="h-32 overflow-y-auto bg-gray-800 rounded p-2">
           {battleState.battleLog.map((log, index) => (
             <div 
               key={index} 
               className="mb-1 last:mb-0 text-sm"
             >
               {log}
             </div>
           ))}
         </div>
       </div>
 
       {/* 操作按钮 */}
       <div className="flex justify-center gap-4">
         <button
           className="flex items-center px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
           onClick={actions.attack}
           disabled={!battleState.playerTurn || battleState.gameOver}
         >
           <Sword className="mr-2" />
           攻击 ({selectedWeapon.skill}%)
         </button>
         <button
           className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
           onClick={actions.dodge}
           disabled={!battleState.playerTurn || battleState.gameOver}
         >
           <Shield className="mr-2" />
           闪避 ({PLAYER_DATA.skills.Dodge}%)
         </button>
       </div>
       </div>
  );
};

export default BattlePreview;