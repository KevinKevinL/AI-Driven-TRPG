// components/coc/SkillCheck.jsx
import { executeQuery } from "../../utils/db/executeQuery";
import { processSkillAndDialogueCheck } from "../../pages/api/skillCheck";

// 根据名字获取角色 ID
async function fetchCharacterIdsByNames(names) {
    if (!names.length) return [];

    const placeholders = names.map(() => "?").join(", ");
    const query = `SELECT id, name FROM characters WHERE name IN (${placeholders})`;

    try {
        const characters = await executeQuery(query, names);
        return characters.map(char => ({ id: char.id, name: char.name }));
    } catch (error) {
        console.error("获取角色 ID 失败:", error);
        return [];
    }
}

// 获取角色信息
export async function fetchCharacterData(character_ids) {
    if (!character_ids.length) return [];
    const placeholders = character_ids.map(() => "?").join(", ");
    const query = `SELECT id, name, description FROM characters WHERE id IN (${placeholders})`;

    try {
        const characters = await executeQuery(query, character_ids);
        if (!characters.length) return [];

        // 获取角色的技能、属性信息
        const characterData = await Promise.all(
            characters.map(async (character) => {
                const attributes = await executeQuery(
                    "SELECT * FROM attributes WHERE character_id = ?", 
                    [character.id]
                );
                const derivedAttributes = await executeQuery(
                    "SELECT * FROM derivedattributes WHERE character_id = ?", 
                    [character.id]
                );
                const skills = await executeQuery(
                    "SELECT * FROM skills WHERE character_id = ?", 
                    [character.id]
                );

                return {
                    id: character.id,
                    name: character.name,
                    description: character.description || "无描述", // ✅ 新增 NPC 介绍
                    hp: derivedAttributes[0]?.hitPoints || 0, // 生命值
                    skills: { 
                        ...attributes[0], 
                        ...derivedAttributes[0], 
                        ...skills[0] 
                    }
                };
            })
        );

        return characterData;
    } catch (error) {
        console.error("数据库查询失败:", error);
        return [];
    }
}

// 进行技能检定
export async function skillCheck(player_id, aiResponse) {
    try {
    
        const talkRequiredNames = aiResponse.talkRequired || [];
        const talkRequiredCharacters = await fetchCharacterIdsByNames(talkRequiredNames);
        const talkRequiredIds = talkRequiredCharacters.map(npc => npc.id);

        const character_ids = [player_id, ...talkRequiredIds];
        const characters = await fetchCharacterData(character_ids);

        const player = characters.find(c => c.id === player_id);

        const talkRequiredData = characters.filter(c => c.id !== player_id);

        const checkResult = processSkillAndDialogueCheck(player, aiResponse, talkRequiredData);

        return checkResult;
    } catch (error) {
        console.error("技能检定失败:", error);
        throw new Error("无法进行技能检定");
    }
}