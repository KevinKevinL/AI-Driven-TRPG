// pages/coc/summary.js

import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import DatabaseManager from "@components/coc/DatabaseManager";
import { character } from "@utils/characterState";

import { fetchCharacterDescription } from "../../utils/chatAPI";

const SummaryPage = () => {
  const [characterData, setCharacterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    residence: "",
    birthplace: "",
  });
  const [errors, setErrors] = useState({});
  const [description, setDescription] = useState("");
  const [generating, setGenerating] = useState(false);
  const { currentCharacterId, loadBackground, saveDetailedDescription } = DatabaseManager();

  useEffect(() => {
    const fetchCharacterData = async () => {
      try {
        // 从前端状态管理加载已保存的角色信息
        const savedCharacter = character.export();

        // 加载数据库中的背景信息
        const background = await loadBackground(currentCharacterId);

        // 合并前端保存的角色数据与数据库的背景信息
        const completeCharacterData = {
          ...savedCharacter,
          background,
        };

        setCharacterData(completeCharacterData);

        setLoading(false);
      } catch (error) {
        console.error("加载角色数据失败:", error);
        setLoading(false);
      }
    };

    fetchCharacterData();
  }, [currentCharacterId]);

  const validateForm = () => {
    const newErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (!value || typeof value !== "string" || !value.trim()) {
        newErrors[key] = "此项为必填";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleGenerateDescription = async () => {
    if (!validateForm() || !characterData) return;

    setGenerating(true);

    try {
      const completeCharacterData = {
        ...characterData,
        metadata: formData,
      };

      // 构造用于生成角色描述的提示字符串
      const prompt = `
请根据以下角色信息生成一个完整的人物描述，用于克苏鲁的呼唤跑团游戏。描述应涵盖角色的背景、性格、特质、技能等，并且风格沉浸、有理有据。请确保描述与角色信息匹配，不要添加虚假信息。

角色信息：
${JSON.stringify(completeCharacterData, null, 2)}
      `;

      // 调用独立的 AI 接口生成角色描述
      const result = await fetchCharacterDescription(prompt);

      if (result && result.description) {
        // 保存到数据库
        await saveDetailedDescription(
          currentCharacterId,
          formData.name,
          formData.gender,
          formData.residence,
          formData.birthplace,
          result.description,
          0
        );
        console.log("描述已保存到数据库");

        // 更新状态
        setDescription(result.description);
        console.log("生成描述成功:", result.description);
      } else {
        console.error("生成描述失败:", result.error);
        setDescription("生成描述失败，请稍后再试。");
      }
    } catch (error) {
      console.error("请求生成描述时出错:", error);
      setDescription("生成描述失败，请检查网络连接。");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0d11]">
        <div className="text-xl text-emerald-400 font-lovecraft">加载中...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>COC - 角色总结</title>
        <meta name="description" content="克苏鲁的呼唤角色总结" />
      </Head>

      <div className="min-h-screen bg-[#0a0d11] py-10 font-lovecraft">
        <div className="max-w-4xl mx-auto px-6">
          <Link
            href={{
              pathname: "/coc/background",
              query: {
                profession: characterData?.profession?.key,
                characterId: currentCharacterId,
              },
            }}
            className="inline-block mb-6 text-emerald-400 hover:text-emerald-300 transition-colors font-lovecraft tracking-wider"
          >
            ← 返回背景编辑
          </Link>

          <div className="mb-8 p-6 bg-slate-800/50 border border-emerald-900/30 rounded-lg shadow-lg">
            <h1 className="text-4xl font-bold text-emerald-500 font-lovecraft text-center mb-4">
              人物卡牌
            </h1>

            {/* 填空区域 */}
            <div className="space-y-4">
              {[
                { label: "姓名", field: "name" },
                { label: "性别", field: "gender" },
                { label: "居住地", field: "residence" },
                { label: "出生地", field: "birthplace" },
              ].map(({ label, field }) => (
                <div key={field}>
                  <label className="block text-emerald-400 font-lovecraft mb-1">
                    {label}:
                  </label>
                  <input
                    type="text"
                    className={`w-full p-2 rounded bg-slate-700 text-emerald-400 border ${
                      errors[field] ? "border-red-500" : "border-slate-600"
                    } focus:outline-none focus:ring focus:ring-emerald-500`}
                    value={formData[field]}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                  />
                  {errors[field] && (
                    <p className="text-sm text-red-500 mt-1">{errors[field]}</p>
                  )}
                </div>
              ))}
            </div>

            {/* 按钮 */}
            <div className="text-center mt-6">
              <button
                onClick={handleGenerateDescription}
                disabled={generating}
                className="px-6 py-3 bg-emerald-900/30 hover:bg-emerald-800/30 rounded-lg border border-emerald-900/30 transition-colors text-emerald-400 text-lg font-lovecraft disabled:bg-slate-800 disabled:text-emerald-700 shadow-ld"
              >
                {generating ? "正在生成..." : "生成完整人物描述"}
              </button>
            </div>
          </div>

          {description && (
            <div className="mt-6 p-6 bg-slate-800/50 font-lovecraft border border-emerald-900/30 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-emerald-500 mb-4">
                人物描述
              </h2>
              <div className="text-emerald-400 whitespace-pre-line">
                <ReactMarkdown>{description}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SummaryPage;
