import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { AttributeBox } from '@components/coc/AttributeBox';
import { DiceAnimation } from '@components/coc/DiceAnimation';
import { generateAttributes } from '@utils/diceSystem';
import { attributeMapping, derivedAttributes } from '@constants/characterConfig';

const COCCharacterCreator = () => {
    const [attributes, setAttributes] = useState(null);
    const [isRolling, setIsRolling] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [age, setAge] = useState(25);
    const [showAgeError, setShowAgeError] = useState(false);

    useEffect(() => {
        setIsClient(true);
        setAttributes(generateAttributes(age));
    }, []);

    const handleReroll = () => {
        setIsRolling(true);
        setTimeout(() => {
            setAttributes(generateAttributes(age));
            setIsRolling(false);
        }, 800);
    };

    const handleAgeChange = (e) => {
        const newAge = parseInt(e.target.value) || 15;
        
        if (newAge < 15 || newAge > 90) {
            setAge(newAge < 15 ? 15 : 90);
            setShowAgeError(true);
            setTimeout(() => setShowAgeError(false), 3000);
            return;
        }
        
        setAge(newAge);
        setAttributes(generateAttributes(newAge));
    };

    const handleAgeBlur = () => {
        if (age < 15) setAge(15);
        if (age > 90) setAge(90);
        setAttributes(generateAttributes(age));
    };

    if (!isClient) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl">加载中...</div>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>COC 调查员属性生成器</title>
                <meta name="description" content="克苏鲁的呼唤 调查员属性生成器" />
            </Head>
            
            <div className="max-w-4xl mx-auto p-6">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold mb-4 text-emerald-500 font-lovecraft 
                                 tracking-wider drop-shadow-lg">
                        克苏鲁的呼唤
                        <span className="block text-2xl mt-2 text-emerald-400/80">
                            调查员属性生成器
                        </span>
                    </h1>
                    <Link 
                        href="/coc/profession"
                        className="inline-block mb-6 text-emerald-400 hover:text-emerald-300 
                        underline decoration-dotted underline-offset-4"
                    >
                        选择调查员职业 →
                    </Link>
                    
                    <div className="mb-6 relative">
                        <label className="mr-2 text-gray-300 font-lovecraft">年龄 (15-90):</label>
                        <input
                            type="number"
                            min="15"
                            max="90"
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

                <div className={`transition-opacity duration-300 ${isRolling ? 'opacity-50' : 'opacity-100'}`}>
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4 text-emerald-400 font-lovecraft">基础属性</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {attributeMapping.map(attr => (
                                <AttributeBox
                                    key={attr.key}
                                    label={attr.label}
                                    englishLabel={attr.englishLabel}
                                    value={attributes[attr.key]}
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
                                    value={attributes[attr.key]}
                                    showDerived={false}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default COCCharacterCreator;