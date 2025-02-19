// components/coc/SkillCheck.jsx
import { executeQuery } from "../../utils/db/executeQuery";
import { processSkillAndDialogueCheck } from "../../pages/api/skillCheck";

// 获取角色信息
export async function fetchCharacterData(character_id) {
    try {
        const character = await executeQuery(
            "SELECT * FROM characters WHERE id = ?", [character_id]
        );

        if (!character.length) {
            throw new Error("角色不存在");
        }

        const attributes = await executeQuery(
            "SELECT * FROM attributes WHERE character_id = ?", [character_id]
        );

        const derivedAttributes = await executeQuery(
            "SELECT * FROM derivedattributes WHERE character_id = ?", [character_id]
        );

        const skills = await executeQuery(
            "SELECT * FROM skills WHERE character_id = ?", [character_id]
        );

        return {
            name: character[0].name,
            hp: derivedAttributes[0]?.hitPoints || 0, // 生命值
            skills: { 
                ...attributes[0], 
                ...derivedAttributes[0], 
                ...skills[0] 
            }, // 合并 attributes, derivedAttributes, skills
            description: character[0].description || "" // 角色描述
        };
    } catch (error) {
        console.error("数据库查询失败:", error);
        throw new Error("无法获取角色数据");
    }
}

// 执行技能检定
export async function skillCheck(character_id, aiResponse) {
    try {
        const player = await fetchCharacterData(character_id);
        const checkResult = processSkillAndDialogueCheck(player, aiResponse);

        return {
            ...checkResult,
            description: player.description 
        };
    } catch (error) {
        console.error("技能检定失败:", error);
        throw new Error("无法进行技能检定");
    }
}
