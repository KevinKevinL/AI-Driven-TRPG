import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { DiceSystem } from "@utils/diceSystem"; // 引用您之前的骰子逻辑
import { BACKGROUND_OPTIONS } from "@constants/backgroundList";

const BackgroundPage = () => {
  const [selectedBackground, setSelectedBackground] = useState({
    belief: null,
    importantPerson: null,
    place: null,
    possession: null,
    trait: null,
  });
  const [isRolling, setIsRolling] = useState(false);

  const rollAndSelect = (category) => {
    setIsRolling(true);
    setTimeout(() => {
      const options = BACKGROUND_OPTIONS[category];
      const randomIndex = DiceSystem.roll(1, options.length) - 1;
      setSelectedBackground((prev) => ({
        ...prev,
        [category]: options[randomIndex],
      }));
      setIsRolling(false);
    }, 800);
  };

  const handleFinalize = () => {
    console.log("Finalized Background:", selectedBackground);
    // 可在这里保存数据或跳转下一步
  };

  return (
    <div className="min-h-screen bg-[#0a0d11] py-10 text-emerald-400">
      <Head>
        <title>COC - 背景选择</title>
        <meta name="description" content="角色背景选择" />
      </Head>
      <div className="max-w-4xl mx-auto px-6">
        <Link
          href="/coc"
          className="inline-block mb-6 text-emerald-400 hover:text-emerald-300 transition-colors font-lovecraft tracking-wider"
        >
          ← 返回
        </Link>

        <h1 className="text-4xl font-bold text-center text-emerald-500 mb-10">
          选择调查员背景
        </h1>

        {Object.keys(BACKGROUND_OPTIONS).map((category) => (
          <div key={category} className="mb-8">
            <h3 className="text-lg font-bold text-emerald-500 capitalize">
              {category}
            </h3>
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => rollAndSelect(category)}
                disabled={isRolling}
                className="bg-emerald-900 text-emerald-400 px-4 py-2 rounded-lg hover:bg-emerald-800 transition-colors disabled:bg-slate-800 disabled:text-emerald-700"
              >
                {isRolling ? "Rolling..." : "Roll for Random"}
              </button>
              <select
                className="bg-slate-800 text-emerald-400 border rounded px-2 py-2 w-full"
                value={selectedBackground[category] || ""}
                onChange={(e) =>
                  setSelectedBackground((prev) => ({
                    ...prev,
                    [category]: e.target.value,
                  }))
                }
              >
                <option value="">Choose...</option>
                {BACKGROUND_OPTIONS[category].map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            {selectedBackground[category] && (
              <p className="mt-2 text-emerald-400 font-lovecraft">
                Selected: {selectedBackground[category]}
              </p>
            )}
          </div>
        ))}

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
