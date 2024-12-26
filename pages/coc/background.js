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
import DatabaseManager from "@components/coc/DatabaseManager"; // 引入数据库管理

const BackgroundPage = () => {
  const { loadBackground, saveBackground } = DatabaseManager(); // 调用数据库方法
  const [selectedBackground, setSelectedBackground] = useState({
    beliefs: null,
    important_people: null,
    reasons: null,
    places: null,
    possessions: null,
    traits: null,
  });
  const [keyConnection, setKeyConnection] = useState(null); // 关键背景连接
  const [isRolling, setIsRolling] = useState(false);
  const router = useRouter();
  const { profession: professionTitle, characterId } = router.query;
  const profession = professionTitle && PROFESSIONS[professionTitle];
  const [validationErrors, setValidationErrors] = useState([]); 

  // 从数据库加载背景数据
  useEffect(() => {
    // if (!characterId) return;

    const fetchBackground = async () => {
      if(characterId){
        try {
          const background = await loadBackground(characterId);
          if (background) {
            setSelectedBackground({
              beliefs: background.beliefs || "",
              important_people: background.important_people || "",
              reasons: background.reasons || "",
              places: background.places || "",
              possessions: background.possessions || "",
              traits: background.traits || "",
            });
            setKeyConnection(background.keylink || null);
          }
        } catch (error) {
          console.error("加载背景失败:", error);
        }
      }
    };

    fetchBackground();
  }, [characterId]);

  // 验证逻辑
  const validateSelection = () => {
    const allSelected = Object.values(selectedBackground).every(
      (value) => value && value.trim() !== ""
    );
    const hasKeyConnection = keyConnection !== null;
    const errors = [];
    if (!allSelected) errors.push("所有条目必须选择内容");
    if (!hasKeyConnection) errors.push("必须选择一个关键链接");

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  useEffect(() => {
    const validation = validateSelection();
    setValidationErrors(validation.errors); // 更新错误列表
  }, [selectedBackground, keyConnection]);
  // useEffect(() => {
  //   const validation = validateSelection();
  //   setValidationErrors(validation.errors); // 更新错误列表
  // }, [JSON.stringify(selectedBackground), keyConnection]);

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

  const handleFinalize = async() => {
    const validation = validateSelection();
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }
    try {
      const currentCharacterId = characterId || localStorage.getItem('currentCharacterId');
      if (!currentCharacterId) {
        setShowError('找不到角色ID，请重新开始创建角色');
        return;
      }

      await saveBackground(currentCharacterId, {
        beliefs: selectedBackground.beliefs,
        important_people: selectedBackground.important_people,
        reasons: selectedBackground.reasons,
        places: selectedBackground.places,
        possessions: selectedBackground.possessions,
        traits: selectedBackground.traits,
        keylink: keyConnection,
      });
      console.log("背景保存成功");
      router.push("/coc/summary");
    } catch (error) {
      console.error("保存背景失败:", error);
    }
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
            href={`/coc/skills?profession=${professionTitle}&characterId=${characterId}`}
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
                创建背景信息
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
                    {category === "important_people" && "重要之人"}
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
                  className="w-full bg-slate-700 text-emerald-400 font-lovecraft rounded px-2 py-1"
                  value={selectedBackground[category] || ""}
                  onChange={(e) =>
                    setSelectedBackground((prev) => {
                      const newBackground = { ...prev, [category]: e.target.value };
                      setSelectedBackground(newBackground); // 更新本地状态
                      character.setBackground(newBackground);
                      character.save(); // Save to localStorage
                      return newBackground;
                      // // 验证更新后的状态
                      // const validation = validateSelection(newBackground, keyConnection);
                      // setValidationErrors(validation.errors);
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
          <br></br>
          {/* 错误提示 */}
          {validationErrors.length > 0 && (
            <div className="mb-4 p-4 bg-emerald-900/20 rounded-lg">
              <h3 className="text-lg font-lovecraft text-emerald-400 mb-2">完成背景创建需要：</h3>
              <ul className="text-sm text-emerald-400/80 space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index} className={`flex items-center ${error.includes("必须") ? "text-red-400" : "text-emerald-500"}`}>
                    {error.includes("必须") ? "✗" : "✓"} {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 确认按钮 */}
          <div className="text-center mt-10">
            <button
              onClick={handleFinalize}
              disabled={validationErrors.length > 0}
              className={`px-8 py-3 bg-emerald-900/50 hover:bg-emerald-800/50 
                rounded-lg border border-emerald-900/30 shadow-lg shadow-emerald-900/30
                text-emerald-400 text-lg font-lovecraft transition-colors 
                ${
                  validationErrors.length > 0
                    ? 'bg-slate-800/50 text-emerald-700 cursor-not-allowed'
                    : 'bg-emerald-900/50 text-emerald-400 hover:bg-emerald-800/50'
                }`}
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
