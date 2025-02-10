import React, { useState, useEffect } from "react"; 
import Head from "next/head";
import Link from "next/link";
import Select from "react-select";
import { script } from "@utils/scriptState"; // 全局状态管理对象

const tagOptions = [
  { value: "恐怖", label: "恐怖" },
  { value: "科幻", label: "科幻" },
  { value: "冒险", label: "冒险" },
  { value: "奇幻", label: "奇幻" },
  { value: "赛博朋克", label: "赛博朋克" },
  { value: "神秘学", label: "神秘学" },
  { value: "蒸汽朋克", label: "蒸汽朋克" },
  { value: "克苏鲁", label: "克苏鲁" },
];

const Worldview = () => {
    const [scriptName, setScriptName] = useState(script.scriptName || "");
    const [selectedTags, setSelectedTags] = useState(script.tags || []);
    const [description, setDescription] = useState(script.description || "");
    const [worldview, setWorldview] = useState(script.worldview || "");
    const [validationErrors, setValidationErrors] = useState(new Set(script.validationErrors));

    useEffect(() => {
        script.load("factory-script");
        setScriptName(script.scriptName);
        setSelectedTags(script.tags);
        setDescription(script.description);
        setWorldview(script.worldview);
        setValidationErrors(new Set(script.validationErrors));
    }, []);

    useEffect(() => {
        script.setScriptName(scriptName);
        script.setTags(selectedTags);
        script.setDescription(description);
        script.setWorldview(worldview);
        setValidationErrors(new Set(script.validationErrors));
    }, [scriptName, JSON.stringify(selectedTags), description, worldview]);

    const handleAiGenerate = () => {
        const aiText = `示例：一个融合 ${selectedTags.map(tag => tag.label).join("、")} 的未来世界。`;
        setWorldview(aiText);
        script.setWorldview(aiText);
    };

    const handleSave = () => {
        script.setScriptName(scriptName);
        script.setTags(selectedTags);
        script.setDescription(description);
        script.setWorldview(worldview);
        script.save("factory-script");
    };

  return (
    <>
      <Head>
        <title>剧本创作</title>
        <meta name="description" content="AI Co-Pilot 帮助您创建独特的游戏剧本。" />
      </Head>

      <div className="min-h-screen bg-[#0a0d11] py-10">
        <div className="max-w-5xl mx-auto px-6">
          <Link 
            href="/factory" 
            className="inline-block mb-6 text-emerald-400 hover:text-emerald-300 transition-colors font-lovecraft tracking-wider"
          >
            ← 返回首页
          </Link>

          <h1 className="text-4xl font-bold text-emerald-500 text-center font-lovecraft">
            🎭 创作梦工厂
          </h1>
          <p className="text-center text-emerald-400/80 mt-2 font-lovecraft">
            AI Co-Pilot 辅助您的剧本创作之旅
          </p>

          <div className="mt-10">
            <h2 className="text-2xl text-emerald-400 font-bold font-lovecraft">1. 剧本名称</h2>
            <input
              type="text"
              id="scriptName"
              value={scriptName}
              onChange={(e) => setScriptName(e.target.value)}
              placeholder="输入剧本名称"
              className="mt-2 w-full px-4 py-2 bg-[#1e293b] text-emerald-400 font-lovecraft border border-emerald-900/30 rounded-md focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="mt-6 font-lovecraft">
            <h2 className="text-2xl text-emerald-400 font-bold font-lovecraft">2. 标签</h2>
            <Select
              options={tagOptions}
              isMulti
              placeholder="请选择剧本类型..."
              value={selectedTags}
              onChange={setSelectedTags}
              className="mt-2 font-lovecraft"
              styles={{
                control: (base, state) => ({
                  ...base,
                  backgroundColor: "#1e293b",
                  borderColor: state.isFocused ? "#10b981" : "#065f46",
                  color: "#10b981",
                  boxShadow: state.isFocused ? "0 0 8px rgba(16, 185, 129, 0.8)" : "none",
                  "&:hover": { borderColor: "#10b981" },
                }),
                menu: (base) => ({
                  ...base,
                  backgroundColor: "#1e293b",
                  border: "1px solid #065f46",
                }),
                option: (base, { isFocused, isSelected }) => ({
                  ...base,
                  backgroundColor: isSelected
                    ? " #065f46"
                    : isFocused
                    ? " #10b981"
                    : " #1e293b",
                  color: isSelected ? "#fff" : "#fff",
                  "&:hover": { backgroundColor: "#10b981", color: "#fff" },
                }),
                multiValue: (base) => ({
                    ...base,
                    backgroundColor: " #065f46",
                    color: " #ecfdf5",
                    borderRadius: "4px",
                }),
                multiValueLabel: (base) => ({
                    ...base,
                    fontFamily: "Lovecraft",
                    color: " #ecfdf5",
                }),
                multiValueRemove: (base) => ({
                    ...base,
                    color: "#d1fae5",
                    ":hover": { backgroundColor: "#047857", color: "#fff" },
                }),
                input: (base) => ({
                    ...base,
                    color: "#10b981",
                }),
                placeholder: (base) => ({
                    ...base,
                    color: " #9ca3af",
                }),
              }}
            />
          </div>

          <div className="mt-6">
            <h2 className="text-2xl text-emerald-400 font-bold font-lovecraft">3. 剧本简介</h2>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="简单介绍你的剧本背景、主线故事..."
              className="mt-2 w-full px-4 py-2 bg-[#1e293b] text-emerald-400 font-lovecraft border border-emerald-900/30 rounded-md focus:outline-none focus:border-emerald-500 h-32"
            />
          </div>

          <div className="mt-6">
            <h2 className="text-2xl text-emerald-400 font-bold font-lovecraft">4. 世界观</h2>
            <textarea
              id="worldview"
              name="worldview"
              value={worldview}
              onChange={(e) => setWorldview(e.target.value)}
              placeholder="描述你的剧本世界观，例如设定、规则、时间线..."
              className="mt-2 w-full px-4 py-2 bg-[#1e293b] text-emerald-400 font-lovecraft border border-emerald-900/30 rounded-md focus:outline-none focus:border-emerald-500 h-32"
            />
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={handleAiGenerate}
              className="bg-emerald-900/50 text-emerald-400 px-6 py-2 rounded-lg hover:bg-emerald-800/50 transition-colors border border-emerald-900/30 shadow-lg shadow-emerald-900/30 font-lovecraft tracking-wide"
            >
              🤖 生成世界观
            </button>
          </div>
          <br></br>
          <div className="mb-4 p-4 bg-emerald-900/20 rounded-lg">
            <h3 className="text-lg font-lovecraft text-emerald-400 mb-2">请完成以下内容：</h3>
            <ul className="text-sm text-emerald-400/80 space-y-1">
              {["剧本名称", "至少选择一个标签", "剧本简介", "世界观描述"].map((field) => (
                <li key={field} className={`flex items-center ${validationErrors.has(field) ? "text-red-400" : "text-emerald-500"}`}>
                    {validationErrors.has(field) ? "✗" : "✓"} {field}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 text-center font-lovecraft">
            <button
                onClick={handleSave}
                disabled={validationErrors.size > 0}
                className={`px-8 py-3 rounded-lg border border-emerald-900/30 shadow-lg 
                    text-lg font-lovecraft transition-colors
                    ${
                    validationErrors.size > 0
                        ? 'bg-slate-800/50 text-emerald-700 cursor-not-allowed'
                        : 'bg-emerald-900/50 text-emerald-400 hover:bg-emerald-800/50'
                    }`}
            >
              继续 → 填写角色信息
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Worldview;
