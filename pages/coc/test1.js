import jsonData from "../../savedResponses/test1.json"; // 直接导入 JSON
import { processSkillAndDialogueCheck } from "../api/skillCheck";
import { useEffect, useState } from "react";

const player = {
    name: "玩家A",
    skills: {
        intelligence: 40,
        investigate: 50,
        persuade: 80
    },
    hp: 10
};

export default function Test1Page() {
    const [result, setResult] = useState(null);

    useEffect(() => {
        // 确保技能检定只在客户端运行
        const skillResult = processSkillAndDialogueCheck(player, jsonData);
        setResult(skillResult);
    }, []); // 只在页面加载时执行一次

    return (
        <div style={{ padding: "20px", fontFamily: "Arial" }}>
            <h1>技能检定结果</h1>
            <pre style={{ background: "#f4f4f4", padding: "10px", borderRadius: "5px" }}>
                {JSON.stringify(result, null, 2)}
            </pre>
        </div>
    );
}
