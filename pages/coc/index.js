// 修改导入语句
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Dice3 } from 'lucide-react';  // 改用 Dice3

// DiceAnimation 组件定义
const DiceAnimation = ({ isRolling }) => {
    const [rotation, setRotation] = useState(0);

    useEffect(() => {
        let animationFrame;
        let startTime;

        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = currentTime - startTime;

            if (isRolling) {
                setRotation(prev => (prev + 15) % 360);
                animationFrame = requestAnimationFrame(animate);
            }
        };

        if (isRolling) {
            animationFrame = requestAnimationFrame(animate);
        } else {
            setRotation(0);
        }

        return () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
        };
    }, [isRolling]);

    return (
        <div 
            className="inline-block transition-all" 
            style={{ 
                transform: `rotate(${rotation}deg)`,
                transition: isRolling ? 'none' : 'transform 0.3s ease-out' 
            }}
        >
            <Dice3 className="w-6 h-6" />  {/* 使用 Dice3 替代 Dice */}
        </div>
    );
};

const DEFAULT_ATTRIBUTES = {
    strength: 50,
    constitution: 50,
    size: 50,
    dexterity: 50,
    appearance: 50,
    intelligence: 50,
    power: 50,
    education: 50,
    sanity: 50,
    magicPoints: 10,
    interestPoints: 100,
    luck: 50,
    hitPoints: 10,
    moveRate: 8,
    damageBonus: "0",
    build: 0,
    age: 25
};

const DiceSystem = {
    roll: (n, d) => {
        let sum = 0;
        for (let i = 0; i < n; i++) {
            sum += Math.floor(Math.random() * d) + 1;
        }
        return sum;
    },
    roll3D6: function() {
        return this.roll(3, 6);
    },
    roll2D6Plus6: function() {
        return this.roll(2, 6) + 6;
    },
    rollD10: function() {
        return this.roll(1, 10);
    },
    rollD100: function() {
        return this.roll(1, 100);
    }
};

// 年龄调整函数
const applyAgeModifiers = (attributes, age) => {
    let modified = { ...attributes };
    let eduChecks = 0;

    if (age >= 15 && age <= 19) {
        modified.strength -= 5;
        modified.size -= 5;
        modified.education -= 5;
        // 幸运值可以投两次取较好的结果
        const luck1 = DiceSystem.roll3D6() * 5;
        const luck2 = DiceSystem.roll3D6() * 5;
        modified.luck = Math.max(luck1, luck2);
    } else if (age >= 20 && age <= 39) {
        eduChecks = 1;
    } else if (age >= 40 && age <= 49) {
        eduChecks = 2;
        modified.strength -= 2;
        modified.constitution -= 2;
        modified.dexterity -= 1;
        modified.appearance -= 5;
        modified.moveRate -= 1;
    } else if (age >= 50 && age <= 59) {
        eduChecks = 3;
        modified.strength -= 3;
        modified.constitution -= 3;
        modified.dexterity -= 4;
        modified.appearance -= 10;
        modified.moveRate -= 2;
    } else if (age >= 60 && age <= 69) {
        eduChecks = 4;
        modified.strength -= 7;
        modified.constitution -= 7;
        modified.dexterity -= 6;
        modified.appearance -= 15;
        modified.moveRate -= 3;
    } else if (age >= 70 && age <= 79) {
        eduChecks = 4;
        modified.strength -= 13;
        modified.constitution -= 13;
        modified.dexterity -= 14;
        modified.appearance -= 20;
        modified.moveRate -= 4;
    } else if (age >= 80 && age <= 89) {
        eduChecks = 4;
        modified.strength -= 26;
        modified.constitution -= 26;
        modified.dexterity -= 28;
        modified.appearance -= 25;
        modified.moveRate -= 5;
    }

    // 执行教育增强检定
    for (let i = 0; i < eduChecks; i++) {
        if (DiceSystem.rollD100() > modified.education) {
            modified.education += DiceSystem.rollD10();
        }
    }

    // 确保属性不低于0
    Object.keys(modified).forEach(key => {
        if (typeof modified[key] === 'number') {
            modified[key] = Math.max(0, modified[key]);
        }
    });

    return modified;
};



// 计算属性的半值和五分之一值
const calculateDerivedValues = (value) => ({
    full: value,
    half: Math.floor(value / 2),
    fifth: Math.floor(value / 5)
});

const calculateDamageBonusAndBuild = (strength, size) => {
    const total = strength + size;
    
    if (total >= 2 && total <= 64) return { damageBonus: "-2", build: -2 };
    if (total >= 65 && total <= 84) return { damageBonus: "-1", build: -1 };
    if (total >= 85 && total <= 124) return { damageBonus: "0", build: 0 };
    if (total >= 125 && total <= 164) return { damageBonus: "+1D4", build: 1 };
    if (total >= 165 && total <= 204) return { damageBonus: "+1D6", build: 2 };
    if (total >= 205 && total <= 284) return { damageBonus: "+2D6", build: 3 };
    if (total >= 285 && total <= 364) return { damageBonus: "+3D6", build: 4 };
    if (total >= 365 && total <= 444) return { damageBonus: "+4D6", build: 5 };
    if (total >= 445 && total <= 524) return { damageBonus: "+5D6", build: 6 };
    
    if (total > 524) {
        const extraD6 = Math.floor((total - 524) / 80) + 5;
        return { 
            damageBonus: `+${extraD6}D6`, 
            build: 6 + Math.floor((total - 524) / 80) 
        };
    }
    
    return { damageBonus: "0", build: 0 };
};

const calculateMoveRate = (strength, dexterity, size, age) => {
    let baseMove;
    if (strength < size && dexterity < size) baseMove = 7;
    else if (strength >= size || dexterity >= size) baseMove = 8;
    else if (strength > size && dexterity > size) baseMove = 9;
    else baseMove = 8;

    // 年龄对移动速度的影响已在applyAgeModifiers中处理
    return baseMove;
};

const generateAttributes = (age = 25) => {
    let attributes = {
        strength: DiceSystem.roll3D6() * 5,
        constitution: DiceSystem.roll3D6() * 5,
        size: DiceSystem.roll2D6Plus6() * 5,
        dexterity: DiceSystem.roll3D6() * 5,
        appearance: DiceSystem.roll3D6() * 5,
        intelligence: DiceSystem.roll2D6Plus6() * 5,
        power: DiceSystem.roll3D6() * 5,
        education: DiceSystem.roll2D6Plus6() * 5,
        luck: DiceSystem.roll3D6() * 5
    };

    // 应用年龄调整
    attributes = applyAgeModifiers(attributes, age);

    // 计算派生属性
    const { damageBonus, build } = calculateDamageBonusAndBuild(attributes.strength, attributes.size);
    const moveRate = calculateMoveRate(attributes.strength, attributes.dexterity, attributes.size, age);
    const hitPoints = Math.floor((attributes.constitution + attributes.size) / 10);

    return {
        ...attributes,
        age,
        sanity: attributes.power,
        magicPoints: Math.floor(attributes.power / 5),
        interestPoints: attributes.intelligence * 2,
        hitPoints,
        moveRate,
        damageBonus,
        build
    };
};

const AttributeBox = ({ label, value, englishLabel, showDerived = true }) => {
    const derived = calculateDerivedValues(value);
    
    return (
        <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="text-sm text-gray-600">{englishLabel}</div>
            <div className="text-lg font-bold">{label}</div>
            <div className="text-2xl text-blue-600 mt-1">{derived.full}</div>
            {showDerived && typeof value === 'number' && value > 0 && (
                <div className="text-sm text-gray-500 mt-2">
                    <div>半值: {derived.half}</div>
                    <div>五分之一: {derived.fifth}</div>
                </div>
            )}
        </div>
    );
};

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
        // 添加骰子音效
        //const audio = new Audio('/dice-roll.mp3');  // 你需要添加这个音效文件
        //audio.play().catch(e => console.log('Audio play failed:', e));
        
        setTimeout(() => {
            setAttributes(generateAttributes(age));
            setIsRolling(false);
        }, 800); // 延长动画时间
    };

    const handleAgeChange = (e) => {
        const newAge = parseInt(e.target.value) || 15;
        
        if (newAge < 15) {
            setAge(15);
            setShowAgeError(true);
            setTimeout(() => setShowAgeError(false), 3000);
            return;
        }
        
        if (newAge > 90) {
            setAge(90);
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

    const attributeMapping = [
        { key: 'strength', label: '力量', englishLabel: 'STR' },
        { key: 'constitution', label: '体质', englishLabel: 'CON' },
        { key: 'size', label: '体型', englishLabel: 'SIZ' },
        { key: 'dexterity', label: '敏捷', englishLabel: 'DEX' },
        { key: 'appearance', label: '外貌', englishLabel: 'APP' },
        { key: 'intelligence', label: '智力', englishLabel: 'INT' },
        { key: 'power', label: '意志', englishLabel: 'POW' },
        { key: 'education', label: '教育', englishLabel: 'EDU' },
        { key: 'luck', label: '幸运', englishLabel: 'Luck' }
    ];

    const derivedAttributes = [
        { key: 'sanity', label: '理智值', englishLabel: 'SAN' },
        { key: 'magicPoints', label: '魔法值', englishLabel: 'MP' },
        { key: 'interestPoints', label: '兴趣点数', englishLabel: 'Interest' },
        { key: 'hitPoints', label: '生命值', englishLabel: 'HP' },
        { key: 'moveRate', label: '移动速度', englishLabel: 'MOV' },
        { key: 'damageBonus', label: '伤害加值', englishLabel: 'DB' },
        { key: 'build', label: '体格', englishLabel: 'Build' }
    ];

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
                    <h1 className="text-3xl font-bold mb-4">克苏鲁的呼唤 调查员属性生成器</h1>
                    <div className="mb-4 relative">
                        <label className="mr-2">年龄 (15-90):</label>
                        <input
                            type="number"
                            min="15"
                            max="90"
                            value={age}
                            onChange={handleAgeChange}
                            onBlur={handleAgeBlur}
                            className={`border rounded px-2 py-1 w-20 text-center 
                                     ${showAgeError ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {showAgeError && (
                            <div className="absolute w-full text-red-500 text-sm mt-1">
                                年龄必须在15-90岁之间
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleReroll}
                        disabled={isRolling}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg 
                                 hover:bg-blue-700 transition-colors
                                 flex items-center justify-center gap-2 mx-auto 
                                 disabled:bg-blue-400 min-w-[160px]"
                    >
                        <DiceAnimation isRolling={isRolling} />
                        {isRolling ? "投掷中..." : "重新投掷属性"}
                    </button>
                </div>

                <div className={`transition-opacity duration-300 ${isRolling ? 'opacity-50' : 'opacity-100'}`}>
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">基础属性</h2>
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
                        <h2 className="text-xl font-semibold mb-4">派生属性</h2>
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