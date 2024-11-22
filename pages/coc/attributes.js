import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AttributeBox } from '@components/coc/AttributeBox';
import { DiceAnimation } from '@components/coc/DiceAnimation';
import { generateAttributes } from '@utils/diceSystem';
import { attributeMapping, derivedAttributes } from '@constants/characterConfig';
import { PROFESSIONS } from '@constants/professions';

const AttributesGenerator = () => {
  const [attributes, setAttributes] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [age, setAge] = useState(25);
  const [showAgeError, setShowAgeError] = useState(false);
  const router = useRouter();
  const { profession: professionTitle } = router.query;
  const profession = professionTitle && PROFESSIONS[professionTitle];

  useEffect(() => {
    setIsClient(true);
    setAttributes(generateAttributes(age));
  }, [age]);

  const handleReroll = () => {
    setIsRolling(true);
    setTimeout(() => {
      setAttributes(generateAttributes(age));
      setIsRolling(false);
    }, 800);
  };

  const handleAgeChange = (e) => {
    const value = e.target.value;
    
    // 允许输入框为空，方便用户删除后重新输入
    if (value === '') {
      setAge('');
      return;
    }

    // 转换为数字
    const newAge = parseInt(value);
    
    // 检查是否是有效数字
    if (isNaN(newAge)) {
      return;
    }
    
    // 更新年龄值，但不立即进行范围检查
    setAge(value);
    
    // 如果超出范围，显示错误信息
    if (newAge < 15 || newAge > 90) {
      setShowAgeError(true);
      setTimeout(() => setShowAgeError(false), 3000);
    } else {
      setShowAgeError(false);
    }
  };

  const handleAgeBlur = () => {
    // 当输入框失去焦点时进行范围校正
    const newAge = parseInt(age);
    
    if (isNaN(newAge)) {
      setAge(25); // 如果不是有效数字，重置为默认值
      return;
    }

    if (newAge < 15) {
      setAge(15);
    } else if (newAge > 90) {
      setAge(90);
    } else {
      setAge(newAge); // 确保存储为数字而不是字符串
    }
    
    setShowAgeError(false);
  };

  if (!isClient || !profession) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0d11]">
        <div className="text-xl text-emerald-400 font-lovecraft">加载中...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>COC - {profession.title}属性生成</title>
        <meta name="description" content={`克苏鲁的呼唤 ${profession.title}属性生成`} />
      </Head>
      
      <div className="min-h-screen bg-[#0a0d11] py-10">
        <div className="max-w-4xl mx-auto px-6">
          {/* 返回按钮 */}
          <Link 
            href="/coc"
            className="inline-block mb-6 text-emerald-400 hover:text-emerald-300 
                     transition-colors font-lovecraft tracking-wider"
          >
            ← 返回职业选择
          </Link>

          {/* 职业信息 */}
          <div className="mb-8 p-6 bg-slate-800/50 border border-emerald-900/30 rounded-lg shadow-lg">
            <h1 className="text-4xl font-bold mb-4 text-emerald-500 font-lovecraft 
                         tracking-wider drop-shadow-lg text-center">
              {profession.title}
              <span className="block text-2xl mt-2 text-emerald-400/80">
                属性生成与技能分配
              </span>
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 text-emerald-400/80">
              <div>
                <h3 className="text-lg font-lovecraft mb-2">职业技能：</h3>
                <ul className="list-disc list-inside space-y-1 font-numbers">
                  {profession.skills.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="mb-4">
                  <h3 className="text-lg font-lovecraft mb-2">信用评级：</h3>
                  <p className="font-numbers">{profession.creditRating}</p>
                </div>
                <div>
                  <h3 className="text-lg font-lovecraft mb-2">技能点数：</h3>
                  <p className="font-numbers">{profession.skillPoints}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 年龄选择 */}
          <div className="mb-8 text-center">
             <div className="mb-6 relative">
               <label className="mr-2 text-gray-300 font-lovecraft">年龄 (15-90):</label>
               <input
                 type="text" // 改为 text 类型以支持更自由的输入
                 inputMode="numeric" // 在移动设备上显示数字键盘
                 pattern="[0-9]*" // 限制只能输入数字
                 value={age}
                 onChange={handleAgeChange}
                 onBlur={handleAgeBlur}
                 className={`bg-slate-800 text-emerald-400 border 
                           rounded px-2 py-1 w-20 text-center font-numbers
                           ${showAgeError ? 'border-red-500' : 'border-emerald-900'}
                           focus:outline-none focus:border-emerald-500
                           transition-colors`}
               />
               {showAgeError && (
                 <div className="absolute w-full text-red-500 text-sm mt-1 font-lovecraft">
                   年龄必须在15-90岁之间
                 </div>
               )}
             </div>
            <button
              onClick={handleReroll}
              disabled={isRolling}
              className="bg-emerald-900/50 text-emerald-400 px-8 py-3 rounded-lg 
                       hover:bg-emerald-800/50 transition-colors
                       flex items-center justify-center gap-2 mx-auto 
                       disabled:bg-slate-800/50 disabled:text-emerald-700
                       min-w-[160px] border border-emerald-900/30
                       shadow-lg shadow-emerald-900/30
                       font-lovecraft tracking-wide"
            >
              <DiceAnimation isRolling={isRolling} />
              {isRolling ? "正在探索未知..." : "重投命运骰"}
            </button>
          </div>

          {/* 属性显示 */}
          <div className={`transition-opacity duration-300 ${isRolling ? 'opacity-50' : 'opacity-100'}`}>
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-emerald-400 font-lovecraft">基础属性</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {attributeMapping.map(attr => (
                  <AttributeBox
                    key={attr.key}
                    label={attr.label}
                    englishLabel={attr.englishLabel}
                    value={attributes?.[attr.key]}
                  />
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 text-emerald-400 font-lovecraft">派生属性</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {derivedAttributes.map(attr => (
                  <AttributeBox
                    key={attr.key}
                    label={attr.label}
                    englishLabel={attr.englishLabel}
                    value={attributes?.[attr.key]}
                    showDerived={false}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* 继续按钮 */}
          <div className="mt-8 text-center">
            <button
              className="bg-emerald-900/50 text-emerald-400 px-8 py-3 rounded-lg 
                       hover:bg-emerald-800/50 transition-colors
                       inline-flex items-center gap-2
                       min-w-[160px] border border-emerald-900/30
                       shadow-lg shadow-emerald-900/30
                       font-lovecraft tracking-wide"
            >
              继续分配技能点 →
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AttributesGenerator;