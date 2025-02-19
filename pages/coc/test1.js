// pages/coc/test1.js
import { useEffect, useState } from "react";
import jsonData from "../../savedResponses/test1.json"; // AI 结果
import { skillCheck } from "../../components/coc/SkillCheck";

export default function Test1Page() {
    const [result, setResult] = useState(null);
    const character_id = "92de5b9900c85db83b1f662616efbc19a95728d122b06624825cb51e5d8c8a0e"; // 测试角色 ID

    useEffect(() => {
        async function fetchAndCheckSkills() {
            try {
                const skillResult = await skillCheck(character_id, jsonData);
                setResult(skillResult);
            } catch (error) {
                console.error("技能检定请求失败:", error);
                setResult({ error: "无法加载数据" });
            }
        }

        fetchAndCheckSkills();
    }, []); // 只在页面加载时执行一次

    return (
        <div style={{ padding: "20px", fontFamily: "Arial" }}>
            <h1>技能检定结果</h1>
            {result ? (
                <pre style={{ background: "#f4f4f4", padding: "10px", borderRadius: "5px" }}>
                    {JSON.stringify(result, null, 2)}
                </pre>
            ) : (
                <p>加载中...</p>
            )}
        </div>
    );
}
