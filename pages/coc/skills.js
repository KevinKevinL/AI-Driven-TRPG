import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AttributeBox } from '@components/coc/AttributeBox';
import { skillCategories } from '@constants/skills';
import { PROFESSIONS } from '@constants/professions';
import { character, subscribeToCharacter } from '@utils/characterState';

const STEP_VALUE = 5;
const MAX_SKILL_VALUE = 90;

const SkillsAssignment = () => {
  const router = useRouter();
  const { profession: professionTitle } = router.query;
  const profession = professionTitle && PROFESSIONS[professionTitle];
  const [professionalPoints, setProfessionalPoints] = useState(0);
  const [interestPoints, setInterestPoints] = useState(0);
  const [skills, setSkills] = useState({});
  const [creditRating, setCreditRating] = useState(0);
  const [showError, setShowError] = useState('');
  const [lastCreditPointType, setLastCreditPointType] = useState('professional');
  const [creditPointsTrack, setCreditPointsTrack] = useState({
    professional: 0,
    interest: 0
  });

  // 解析信用评级范围
  const getCreditRange = () => {
    if (!profession?.creditRating) return { min: 0, max: 0 };
    const [min, max] = profession.creditRating.split('-').map(Number);
    return { min, max };
  };

  useEffect(() => {
    if (!profession) return;

    // 尝试加载保存的数据
    const savedCharacter = character.export();
    const savedSkills = savedCharacter.skills || {};
    const initialSkills = {};
    
    skillCategories.forEach(category => {
      category.skills.forEach(skill => {
        initialSkills[skill.key] = savedSkills[skill.key] || skill.baseValue;
      });
    });

    setSkills(initialSkills);
    setCreditRating(savedCharacter.creditRating || 0);
    setProfessionalPoints(savedCharacter.attributes?.professionalPoints || 200);
    setInterestPoints(savedCharacter.attributes?.interestPoints || 100);
    
    // 如果没有保存的数据，保存初始状态
    if (Object.keys(savedSkills).length === 0) {
      character.setSkills(initialSkills);
      character.save();
    }

    setCreditPointsTrack(savedCharacter.creditPointsTrack || { professional: 0, interest: 0 });
    setLastCreditPointType(savedCharacter.lastCreditPointType || 'professional');
  }, [profession]);

  // 更新技能时保存状态
  const updateAndSaveSkills = (newSkills) => {
    setSkills(newSkills);
    character.setSkills(newSkills);
    character.save();
  };

  // 更新信用评级时保存状态
  const updateAndSaveCreditRating = (value) => {
    setCreditRating(value);
    character.setCreditRating(value);
    character.save();
  };

  const handleCreditIncrease = (pointType) => {
    const { max } = getCreditRange();
    if (creditRating >= max) return;
    
    const availablePoints = pointType === 'professional' ? professionalPoints : interestPoints;
    if (availablePoints < STEP_VALUE) return;

    const newValue = Math.min(creditRating + STEP_VALUE, max);
    const pointsUsed = newValue - creditRating;

    updateAndSaveCreditRating(newValue);
    const newCreditPointsTrack = {
      ...creditPointsTrack,
      [pointType]: creditPointsTrack[pointType] + pointsUsed
    };
    setCreditPointsTrack(newCreditPointsTrack);
    setLastCreditPointType(pointType);

    if (pointType === 'professional') {
      setProfessionalPoints(prev => prev - pointsUsed);
    } else {
      setInterestPoints(prev => prev - pointsUsed);
    }

    character.creditPointsTrack = newCreditPointsTrack;
    character.lastCreditPointType = pointType;
    character.save();
  };

  const handleCreditDecrease = () => {
    const { min } = getCreditRange();
    if (creditRating <= min) return;

    let pointType = lastCreditPointType;
    
    if (creditPointsTrack[pointType] === 0) {
      pointType = pointType === 'professional' ? 'interest' : 'professional';
    }

    if (creditPointsTrack[pointType] === 0) return;

    const newValue = Math.max(creditRating - STEP_VALUE, min);
    const pointsReturned = creditRating - newValue;

    const actualPointsReturned = Math.min(pointsReturned, creditPointsTrack[pointType]);

    updateAndSaveCreditRating(newValue);
    const newCreditPointsTrack = {
      ...creditPointsTrack,
      [pointType]: creditPointsTrack[pointType] - actualPointsReturned
    };
    setCreditPointsTrack(newCreditPointsTrack);

    if (pointType === 'professional') {
      setProfessionalPoints(prev => prev + actualPointsReturned);
    } else {
      setInterestPoints(prev => prev + actualPointsReturned);
    }

    character.creditPointsTrack = newCreditPointsTrack;
    character.save();
  };

  const handleIncrease = (skillKey, skillLabel, baseValue) => {
    const isProfessionSkill = isInProfessionSkills(skillLabel);
    const availablePoints = isProfessionSkill ? professionalPoints : interestPoints;
    
    if (availablePoints < STEP_VALUE) return;
    
    const currentValue = skills[skillKey];
    if (currentValue >= MAX_SKILL_VALUE) return;
    
    const newValue = Math.min(currentValue + STEP_VALUE, MAX_SKILL_VALUE);
    const pointsUsed = newValue - currentValue;
    
    updateAndSaveSkills({
      ...skills,
      [skillKey]: newValue
    });

    if (isProfessionSkill) {
      setProfessionalPoints(prev => prev - pointsUsed);
    } else {
      setInterestPoints(prev => prev - pointsUsed);
    }
  };

  const handleDecrease = (skillKey, skillLabel, baseValue) => {
    const isProfessionSkill = isInProfessionSkills(skillLabel);
    const currentValue = skills[skillKey];
    if (currentValue <= baseValue) return;
    
    const newValue = Math.max(currentValue - STEP_VALUE, baseValue);
    const pointsReturned = currentValue - newValue;
    
    updateAndSaveSkills({
      ...skills,
      [skillKey]: newValue
    });

    if (isProfessionSkill) {
      setProfessionalPoints(prev => prev + pointsReturned);
    } else {
      setInterestPoints(prev => prev + pointsReturned);
    }
  };

  const handleReset = () => {
    const initialSkills = {};
    skillCategories.forEach(category => {
      category.skills.forEach(skill => {
        initialSkills[skill.key] = skill.baseValue;
      });
    });
    
    setSkills(initialSkills);
    setProfessionalPoints(character.attributes?.professionalPoints || 200);
    setInterestPoints(character.attributes?.interestPoints || 100);
    setCreditRating(0);
    setCreditPointsTrack({ professional: 0, interest: 0 });
    setLastCreditPointType('professional');
    setShowError('');

    character.setSkills(initialSkills);
    character.setCreditRating(0);
    character.creditPointsTrack = { professional: 0, interest: 0 };
    character.lastCreditPointType = 'professional';
    character.save();
  };

  const validateCreditRating = () => {
    const { min, max } = getCreditRange();
    if (creditRating < min || creditRating > max) {
      setShowError(`信用评级必须在 ${min}-${max} 之间`);
      return false;
    }
    return true;
  };

  const getSkillBaseValue = (skillKey) => {
    // 在所有技能类别中查找对应技能的基础值
    for (const category of skillCategories) {
      const skill = category.skills.find(s => s.key === skillKey);
      if (skill) {
        return skill.baseValue;
      }
    }
    return 0; // 如果找不到技能，返回0作为默认值
  };

  const validateCompletion = () => {
    // 检查所有职业技能是否都达到了最低要求
    const requiredSkillsCheck = profession.skills.every(skillLabel => {
      const skillKey = skillCategories
        .flatMap(category => category.skills)
        .find(s => s.label === skillLabel)?.key;
      
      return skillKey && skills[skillKey] > getSkillBaseValue(skillKey);
    });

    // 检查信用评级是否在范围内
    const { min, max } = getCreditRange();
    const creditCheck = creditRating >= min && creditRating <= max;

    // 检查是否所有兴趣点都已分配
    const pointsCheck = interestPoints === 0;

    // 返回详细的验证结果
    return {
      canComplete: requiredSkillsCheck && creditCheck && pointsCheck,
      errors: {
        requiredSkills: !requiredSkillsCheck ? '请确保所有职业技能都已提升' : null,
        creditRating: !creditCheck ? `信用评级必须在 ${min}-${max} 之间` : null,
        points: !pointsCheck ? '请分配完所有兴趣点数' : null
      }
    };
  };


  const handleComplete = () => {
    const validation = validateCompletion();
    
    if (!validation.canComplete) {
      const errors = Object.values(validation.errors).filter(Boolean);
      if (errors.length > 0) {
        setShowError(errors[0]); // 显示第一个错误
        return;
      }
    }
  
    character.save();
    router.push('/coc/background');
  };

  const isInProfessionSkills = (skillLabel) => {
    return profession.skills.includes(skillLabel);
  };

  if (!profession) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0d11]">
        <div className="text-xl text-emerald-400 font-lovecraft">加载中...</div>
      </div>
    );
  }
  const validation = validateCompletion();
  return (
    <>
      <Head>
        <title>COC - {profession?.title}技能分配</title>
        <meta name="description" content={`克苏鲁的呼唤 ${profession?.title}技能分配`} />
      </Head>

      <div className="min-h-screen bg-[#0a0d11] py-10">
        <div className="max-w-4xl mx-auto px-6">
          <Link 
            href={`/coc/attributes?profession=${professionTitle}`}
            className="inline-block mb-6 text-emerald-400 hover:text-emerald-300 
                     transition-colors font-lovecraft tracking-wider"
          >
            ← 返回属性生成
          </Link>

          <div className="mb-8 p-6 bg-slate-800/50 border border-emerald-900/30 rounded-lg shadow-lg">
            <h1 className="text-4xl font-bold text-emerald-500 font-lovecraft 
                         tracking-wider drop-shadow-lg text-center mb-4">
              {profession.title}
              <span className="block text-2xl mt-2 text-emerald-400/80">
                技能点数分配
              </span>
            </h1>
            <div className="text-center text-emerald-400 font-lovecraft">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-emerald-900/20 rounded-lg">
                  <p className="text-lg mb-1">职业技能点数</p>
                  <p className="text-2xl">{professionalPoints}</p>
                  <p className="text-sm opacity-80">用于提升职业技能</p>
                </div>
                <div className="p-3 bg-emerald-900/20 rounded-lg">
                  <p className="text-lg mb-1">兴趣点数</p>
                  <p className="text-2xl">{interestPoints}</p>
                  <p className="text-sm opacity-80">用于提升其他技能</p>
                </div>
              </div>
              
              {/* 信用评级部分 */}
              <div className="mt-4 p-3 bg-emerald-900/20 rounded-lg">
                <p className="text-lg mb-1">信用评级</p>
                <div className="flex items-center justify-center gap-4">
                  <div className="flex gap-1">
                    <button 
                      className="w-6 h-6 flex items-center justify-center 
                               bg-emerald-900/50 hover:bg-emerald-800/50 
                               text-emerald-400 rounded-full text-sm
                               border border-emerald-900/30"
                      onClick={handleCreditDecrease}
                    >
                      -
                    </button>
                    <span className="text-2xl min-w-[3ch]">{creditRating}</span>
                    <span className="text-sm">
                      (职业: {creditPointsTrack.professional}, 兴趣: {creditPointsTrack.interest})
                    </span>
                  </div>
                  <span className="text-sm opacity-80">
                    要求范围: {profession.creditRating}
                  </span>
                </div>
                <div className="mt-2 text-sm flex justify-center gap-4">
                  <button
                    className={`px-2 py-1 bg-emerald-900/30 hover:bg-emerald-800/30 
                             rounded border border-emerald-900/30
                             transition-colors text-xs
                             ${lastCreditPointType === 'professional' ? 'ring-1 ring-emerald-500' : ''}`}
                    onClick={() => handleCreditIncrease('professional')}
                    disabled={professionalPoints < STEP_VALUE}
                  >
                    使用职业点数 ({professionalPoints})
                  </button>
                  <button
                    className={`px-2 py-1 bg-emerald-900/30 hover:bg-emerald-800/30 
                             rounded border border-emerald-900/30
                             transition-colors text-xs
                             ${lastCreditPointType === 'interest' ? 'ring-1 ring-emerald-500' : ''}`}
                    onClick={() => handleCreditIncrease('interest')}
                    disabled={interestPoints < STEP_VALUE}
                  >
                    使用兴趣点数 ({interestPoints})
                  </button>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="mt-4 px-4 py-1 bg-emerald-900/30 hover:bg-emerald-800/30 
                         rounded border border-emerald-900/30 text-sm
                         transition-colors"
              >
                重置点数
              </button>
            </div>
          </div>

          {/* 错误提示 */}
          {showError && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-900/30 
                          rounded-lg text-red-400 text-center font-lovecraft">
              {showError}
            </div>
          )}

          <div className="mb-8 p-4 bg-emerald-900/20 border border-emerald-900/30 rounded-lg">
            <h3 className="text-lg font-lovecraft text-emerald-400 mb-2">职业技能:</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-emerald-400/80 font-numbers">
              {profession.skills.map((skill, index) => (
                <div key={index} className="px-2 py-1 bg-emerald-900/20 rounded">
                  {skill}
                </div>
              ))}
            </div>
          </div>

          {skillCategories.map((category, index) => (
            <div key={index} className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-emerald-400 font-lovecraft">
                {category.title}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {category.skills.map(skill => {
                  const isProfessionSkill = isInProfessionSkills(skill.label);
                  const currentValue = skills[skill.key];
                  const availablePoints = isProfessionSkill ? professionalPoints : interestPoints;
                  const canIncrease = availablePoints >= STEP_VALUE && currentValue < MAX_SKILL_VALUE;
                  const canDecrease = currentValue > skill.baseValue;

                  return (
                    <div 
                      key={skill.key}
                      className={`relative ${isProfessionSkill ? 'ring-2 ring-emerald-500/50' : ''}`}
                    >
                      <AttributeBox
                        label={skill.label}
                        englishLabel={skill.englishLabel}
                        value={currentValue}
                        description={skill.description}
                        showDerived={false}
                      />
                      <div className="absolute top-2 right-2 flex gap-1">
                        {(isProfessionSkill || (!isProfessionSkill && interestPoints > 0)) && (
                          <button 
                            className={`w-6 h-6 flex items-center justify-center 
                                     text-emerald-400 rounded-full text-sm
                                     border border-emerald-900/30${canIncrease 
                                        ? 'bg-emerald-900/50 hover:bg-emerald-800/50 cursor-pointer' 
                                        : 'bg-slate-800/50 cursor-not-allowed opacity-50'}`}
                             onClick={() => canIncrease && handleIncrease(skill.key, skill.label, skill.baseValue)}
                             disabled={!canIncrease}
                           >
                             +
                           </button>
                         )}
                         <button 
                           className={`w-6 h-6 flex items-center justify-center 
                                    text-emerald-400 rounded-full text-sm
                                    border border-emerald-900/30
                                    ${canDecrease 
                                      ? 'bg-emerald-900/50 hover:bg-emerald-800/50 cursor-pointer' 
                                      : 'bg-slate-800/50 cursor-not-allowed opacity-50'}`}
                           onClick={() => canDecrease && handleDecrease(skill.key, skill.label, skill.baseValue)}
                           disabled={!canDecrease}
                         >
                           -
                         </button>
                       </div>
                     </div>
                   );
                 })}
               </div>
             </div>
           ))}
 
           <div className="mt-8 text-center">
           <button
              onClick={handleComplete}
              disabled={!validation.canComplete}
              className={`px-8 py-3 rounded-lg transition-colors
                       inline-flex items-center gap-2
                       min-w-[160px] border border-emerald-900/30
                       shadow-lg shadow-emerald-900/30
                       font-lovecraft tracking-wide
                       ${!validation.canComplete 
                         ? 'bg-slate-800/50 text-emerald-700 cursor-not-allowed'
                         : 'bg-emerald-900/50 text-emerald-400 hover:bg-emerald-800/50'}`}
            >
              完成角色创建 →
            </button>
                      
            {/* 检查列表 UI */}
            {!validation.canComplete && (
              <div className="mb-4 p-4 bg-emerald-900/20 rounded-lg">
                <h3 className="text-lg font-lovecraft text-emerald-400 mb-2">完成角色创建需要：</h3>
                <ul className="text-sm text-emerald-400/80 space-y-1">
                  {!validation.errors.requiredSkills && (
                    <li className="text-emerald-500">✓ 所有职业技能已提升</li>
                  )}
                  {validation.errors.requiredSkills && (
                    <li className="text-red-400">✗ {validation.errors.requiredSkills}</li>
                  )}
                  {!validation.errors.creditRating && (
                    <li className="text-emerald-500">✓ 信用评级符合要求</li>
                  )}
                  {validation.errors.creditRating && (
                    <li className="text-red-400">✗ {validation.errors.creditRating}</li>
                  )}
                  {!validation.errors.points && (
                    <li className="text-emerald-500">✓ 兴趣技能点已分配完毕</li>
                  )}
                  {validation.errors.points && (
                    <li className="text-red-400">✗ {validation.errors.points}</li>
                  )}
                </ul>
              </div>
            )}
           </div>
         </div>
       </div>
     </>
   );
 };
 
 export default SkillsAssignment;
