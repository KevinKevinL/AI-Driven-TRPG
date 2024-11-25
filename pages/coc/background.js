import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { DiceSystem } from "@utils/diceSystem"; // 引用骰子逻辑
import { BACKGROUND_OPTIONS } from "@constants/backgroundList";
import { AttributeBox } from '@components/coc/AttributeBox';
import { skillCategories } from '@constants/skills';
import { PROFESSIONS } from '@constants/professions';
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
  const [keyConnection, setKeyConnection] = useState(null); // 关键背景连接
  const [isRolling, setIsRolling] = useState(false);
  const router = useRouter();
  const { profession: professionTitle } = router.query;
  const profession = professionTitle && PROFESSIONS[professionTitle]; 

  // Load background from character state on mount
  useEffect(() => {
    if (!profession) return;

    const savedBackground = character.backstory
      ? parseBackstory(character.backstory)
      : {};
    setSelectedBackground(savedBackground);
    setKeyConnection(character.keyConnection || null);
  }, [profession]);
  console.log("router.query:", router.query);
  console.log("professionTitle:", professionTitle);
  console.log("profession:", profession);

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
    character.keyConnection = keyConnection; // Save key connection
    character.save(); // 保存背景数据
    console.log("Finalized Background:", character.backstory);
    console.log("Key Connection:", keyConnection);
    router.push("/coc/summary"); // 跳转到下一页面
  };

  // Handle key connection selection
  const handleKeyConnectionSelect = (category) => {
    if (keyConnection === category) {
      setKeyConnection(null); // Unselect if already selected
    } else {
      setKeyConnection(category);
    }
  };

  return (
    <>
      <Head>
        <title>COC - {profession?.title}背景选择</title>
        <meta name="description" content={`克苏鲁的呼唤 ${profession?.title}背景选择`} />
      </Head>
  
      <div className="min-h-screen bg-[#0a0d11] py-10">
        <div className="max-w-4xl mx-auto px-6">
          <Link
            href="/coc/skills"
            className="inline-block mb-6 text-emerald-400 hover:text-emerald-300 
                     transition-colors font-lovecraft tracking-wider"
          >
            ← 返回技能点数分配
          </Link>
  
          <div className="mb-8 p-6 bg-slate-800/50 border border-emerald-900/30 rounded-lg shadow-lg">
            <h1 className="text-4xl font-bold text-emerald-500 font-lovecraft 
                         tracking-wider drop-shadow-lg text-center mb-4">
              {profession?.title || "调查员"}
              <span className="block text-2xl mt-2 text-emerald-400/80">
                选择或随机生成背景信息
              </span>
            </h1>
            <div className="text-center text-emerald-400 font-lovecraft">
              <button
                onClick={rollAll}
                disabled={isRolling}
                className="px-6 py-3 bg-emerald-900/30 hover:bg-emerald-800/30 
                         rounded-lg border border-emerald-900/30 
                         transition-colors text-emerald-400 text-lg font-bold 
                         disabled:bg-slate-800 disabled:text-emerald-700"
              >
                {isRolling ? "Rolling..." : "随机生成所有背景"}
              </button>
            </div>
          </div>
          <div>
            {/* 提示语 */}
            <p className="mt-4 text-left text-sm text-emerald-400 font-lovecraft">
              点击星星按钮选择该信息成为关键链接!
            </p><br></br>
          </div>
  
           {/* 背景条目展示 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.keys(BACKGROUND_OPTIONS).map((category) => (
              <div
                key={category}
                className={`p-4 rounded-lg border shadow-lg 
                  ${
                    keyConnection === category
                      ? "border-emerald-500"
                      : "border-slate-700"
                  }`}
              >
                {/* 标题 */}
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-bold text-emerald-400 font-lovecraft capitalize">
                    {category === "beliefs" && "信念"}
                    {category === "importantPeople" && "重要之人"}
                    {category === "reasons" && "原因"}
                    {category === "places" && "意义非凡之地"}
                    {category === "possessions" && "宝贵之物"}
                    {category === "traits" && "特质"}
                  </h2>
                  {/* 星星标记 */}
                  <button
                    className={`w-6 h-6 rounded-full flex items-center justify-center 
                      ${
                        keyConnection === category
                          ? "bg-emerald-400 text-black"
                          : "bg-slate-600 text-emerald-400"
                      }`}
                    onClick={() => handleKeyConnectionSelect(category)}
                  >
                    ★
                  </button>
                </div>

                {/* 条目选择 */}
                <select
                  className="w-full bg-slate-700 text-emerald-400 rounded px-2 py-1"
                  value={selectedBackground[category] || ""}
                  onChange={(e) =>
                    setSelectedBackground((prev) => {
                      const newBackground = { ...prev, [category]: e.target.value };
                      character.setBackground(newBackground);
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
            ))}
          </div>

          {/* 确认按钮 */}
          <div className="text-center mt-10">
            <button
              onClick={handleFinalize}
              className="bg-emerald-900/50 text-emerald-400 px-8 py-3 rounded-lg 
                       hover:bg-emerald-800/50 transition-colors
                       inline-flex items-center gap-2
                       min-w-[160px] border border-emerald-900/30
                       shadow-lg shadow-emerald-900/30
                       font-lovecraft tracking-wide"
            >
              背景和关键链接的选择完成
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BackgroundPage;
