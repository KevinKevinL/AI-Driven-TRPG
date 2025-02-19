//  pages/api/skillCheck.js
// 生成 1d100 掷骰结果
function rollD100() {
    return Math.floor(Math.random() * 100) + 1;
}

// 获取技能检定阈值
function getSkillCheckThreshold(skillValue, hardLevel) {
    switch (hardLevel) {
        case 1: return skillValue;           // 普通难度（全值）
        case 2: return Math.floor(skillValue / 2); // 困难难度（半值）
        case 3: return Math.floor(skillValue / 5); // 极难难度（五分之一）
        default: return 0;
    }
}

// 进行技能检定
function checkSkill(player, skillName, hardLevel) {
    const skillValue = player.skills[skillName] || 0; // 获取技能值（没有默认 0）
    const threshold = getSkillCheckThreshold(skillValue, hardLevel);
    const diceRoll = rollD100();

    console.log(`掷骰: ${diceRoll} / 阈值: ${threshold} (技能: ${skillName}, 难度: ${hardLevel})`);

    return diceRoll <= threshold ? 1 : 0; // 1 = 成功, 0 = 失败
}

// 进行对话检定（需要交际技能成功 & HP > 0）
function checkDialogue(player, hardLevel, talkRequiredList) {
    if (talkRequiredList.length === 0) return "";

    const persuadeSuccess = checkSkill(player, "Persuade", hardLevel);
    return (persuadeSuccess && player.hp > 0) ? talkRequiredList[0] : "";
}

// 处理 AI 响应，进行技能 & 对话检定
export function processSkillAndDialogueCheck(player, aiResponse) {
    const hardLevel = aiResponse.hardLevel || 1; // 默认难度 1（普通）
    const testRequiredList = aiResponse.testRequired || []; // 需要检定的技能
    const talkRequiredList = aiResponse.talkRequired || []; // 需要对话的 NPC

    console.log("AI 解析技能检定请求:", aiResponse);
    console.log("玩家数据:", player);

    // 进行技能检定
    const skillCheckResults = {};
    testRequiredList.forEach(skill => {
        skillCheckResults[skill] = checkSkill(player, skill, hardLevel);
    });

    // 进行对话检定
    const dialogueCheckResult = checkDialogue(player, hardLevel, talkRequiredList);
    
    console.log("技能检定结果:", skillCheckResults);
    console.log("对话检定结果:", dialogueCheckResult);

    return {
        skillCheck: skillCheckResults,
        dialogueCheck: dialogueCheckResult
    };
}
