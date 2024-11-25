import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { DiceSystem } from "@utils/diceSystem"; // 引用骰子逻辑
import { BACKGROUND_OPTIONS } from "@constants/backgroundList";
import { character } from "@utils/characterState"; // 全局状态管理对象

const BackgroundPage = () => {
  const [selectedBackground, setSelectedBackground] = useState({
    belief: null,
    importantPerson: null,
    reason: null,
    place: null,
    possession: null,
    trait: null,
  });
  const [isRolling, setIsRolling] = useState(false);
  const router = useRouter();

  // Load background from character state on mount
  useEffect(() => {
    const savedBackground = character.backstory
      ? parseBackstory(character.backstory)
      : {};
    setSelectedBackground(savedBackground);
  }, []);

  // Parse the backstory string to extract the individual elements
  const parseBackstory = (backstory) => {
    const lines = backstory.split("\n").map((line) => line.trim());
    const keys = ["belief", "importantPerson", "reason", "place", "possession", "trait"];
    const parsed = {};
    lines.forEach((line, index) => {
      parsed[keys[index]] = line.split(":")[1]?.trim() || null;
    });
    return parsed;
  };

  // 为所有类别随机选择选项
  const rollAll = () => {
    setIsRolling(true);
    setTimeout(() => {
      const newBackground = {};
      Object.keys(BACKGROUND_OPTIONS).forEach((category) => {
        const options = BACKGROUND_OPTIONS[category];
        const randomIndex = DiceSystem.roll(1, options.length) - 1;
        newBackground[category] = options[randomIndex];
      });
      setSelectedBackground(newBackground);
      character.setBackground(newBackground); // Save to backstory
      character.save(); // Save to localStorage
      setIsRolling(false);
    }, 1000);
  };

  const handleFinalize = () => {
    character.setBackground(selectedBackground); // 确保背景选择持久化
    character.save(); // 保存背景数据
    console.log("Finalized Background:", character.backstory);
    router.push("/coc/summary"); // 跳转到下一页面
  };

  return (
    <div className="min-h-screen bg-[#0a0d11] py-10 text-emerald-400">
      <Head>
        <title>COC - 背景选择</title>
        <meta name="description" content="角色背景选择" />
      </Head>
      <div className="max-w-4xl mx-auto px-6">
        <Link
          href="/coc/skills"
          className="inline-block mb-6 text-emerald-400 hover:text-emerald-300 transition-colors font-lovecraft tracking-wider"
        >
          ← 返回技能点数分配
        </Link>

        <h1 className="text-4xl font-lovecraft font-bold text-center text-emerald-500 mb-10">
          选择调查员背景
        </h1>

        {/* 全局骰子按钮 */}
        <div className="text-center mb-8">
          <button
            onClick={rollAll}
            disabled={isRolling}
            className="bg-emerald-900 text-emerald-400 px-8 py-3 rounded-lg hover:bg-emerald-800 transition-colors disabled:bg-slate-800 disabled:text-emerald-700"
          >
            {isRolling ? "Rolling..." : "随机生成所有背景"}
          </button>
        </div>

        {/* 背景选项展示 */}
        {Object.keys(BACKGROUND_OPTIONS).map((category) => (
          <div key={category} className="mb-8">
            <h3 className="text-lg  font-bold font-lovecraft text-emerald-500 capitalize">
            {category === "beliefs" && "信念"}
            {category === "importantPeople" && "重要之人"}
            {category === "reasons" && "原因"}
            {category === "places" && "意义非凡之地"}
            {category === "possessions" && "宝贵之物"}
            {category === "traits" && "特质"}
            </h3>
            <div className="mt-4">
              <select
                className="bg-slate-800 text-emerald-400 font-lovecraft border rounded px-2 py-2 w-full"
                value={selectedBackground[category] || ""}
                onChange={(e) =>
                  setSelectedBackground((prev) => {
                    const newBackground = { ...prev, [category]: e.target.value };
                    character.setBackground(newBackground); // 保存到 character
                    return newBackground;
                  })
                }
              >
                <option value="">选择...</option>
                {BACKGROUND_OPTIONS[category].map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              
            </div>
          </div>
        ))}

        {/* 确定背景按钮 */}
        <div className="mt-10 text-center">
          <button
            onClick={handleFinalize}
            className="bg-emerald-900 text-emerald-400 px-8 py-3 rounded-lg hover:bg-emerald-800 transition-colors"
          >
            确定背景
          </button>
        </div>
      </div>
    </div>
  );
};

export default BackgroundPage;
