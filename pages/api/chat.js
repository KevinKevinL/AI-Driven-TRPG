// import { fetchChatGPTResponse } from '../../utils/chatAPI';
import { getAIResponse } from "../../test";


export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Only POST requests are allowed' });
    }


    const { input, role } = req.body;
    // const result = await fetchChatGPTResponse(messages);


    let systemPrompt = "You are a tabletop RPG game keeper (KP)."; // default
    if (role === "TA") {
        systemPrompt = `
    You are a tabletop RPG game master (KP). Based on the user's input, analyze the situation and generate a JSON response in the following format:
    {{
      "testRequired": [<list of attributes or skills to test>],
      "hardlevel": <1 | 2 | 3>, // Difficulty: 1=Easy, 2=Hard, 3=Very Hard
      "talkRequired": [<list of NPCs to talk to, if any>],
      "fightRequired": <1 or 0> // 1=Yes, 0=No
    }}
    
    The available attributes and skills are:

    Attributes:
    - strength (力量 / STR): Physical strength.
    - constitution (体质 / CON): Physical endurance and resilience.
    - size (体型 / SIZ): Physical size and mass.
    - dexterity (敏捷 / DEX): Agility and coordination.
    - appearance (外貌 / APP): Physical attractiveness.
    - intelligence (智力 / INT): Reasoning and memory capacity.
    - power (意志 / POW): Willpower and mental fortitude.
    - education (教育 / EDU): Level of formal knowledge and training.
    - luck (幸运 / Luck): Fortuitous outcomes.

    Derived Attributes:
    - sanity (理智值 / SAN): Mental stability and resistance to psychological trauma.
    - magicPoints (魔法值 / MP): Capacity to perform magical or supernatural actions.
    - interestPoints (兴趣点数 / Interest): Points allocated for hobbies and personal interests.
    - hitPoints (生命值 / HP): Physical health and ability to withstand injuries.
    - moveRate (移动速度 / MOV): Ability to move across terrain quickly.
    - damageBonus (伤害加值 / DB): Additional damage in combat based on physical build.
    - build (体格 / Build): Overall physical build and size.
    - professionalPoints (职业技能点 / Profession Points): Points allocated for professional skill development.

    Skills:
    - Fighting (格斗): Hand-to-hand combat or melee weapon proficiency. Base: 25.
    - Firearms (枪械): Proficiency with guns and ranged weapons. Base: 20.
    - Dodge (闪避): Ability to evade attacks. Base: 20.
    - Mechanics (机械): Repair and operate mechanical devices. Base: 10.
    - Drive (驾驶): Operate vehicles effectively. Base: 20.
    - Stealth (潜行): Hide or move silently. Base: 20.
    - Investigate (侦查): Spot clues and analyze environments. Base: 25.
    - Sleight of Hand (巧手): Pick locks and perform manual dexterity tasks. Base: 10.
    - Electronics (电子): Operate and repair electronic equipment. Base: 10.
    - History (历史): Knowledge of history and archaeology. Base: 10.
    - Science (科学): Understanding of basic sciences (physics, chemistry, biology). Base: 10.
    - Medicine (医学): Medical knowledge and surgical skills. Base: 5.
    - Occult (神秘学): Knowledge of occult and mythos-related topics. Base: 5.
    - Library Use (图书馆使用): Ability to locate information in archives and libraries. Base: 20.
    - Art (艺术): Artistic creation and appreciation. Base: 5.
    - Persuade (交际): Social skills for negotiation and building relationships. Base: 15.
    - Psychology (心理学): Understanding and analyzing human behavior. Base: 10.

    Respond only with the JSON object.
        `;
    } else if (role === "KP") {
        systemPrompt = `
        You are a KP.
        `;
    } else if (role === "NPC") {
        systemPrompt = `
        You are a NPC.
        `;
    }


    try {
        const result = await getAIResponse({ input, systemPrompt });
        res.status(200).json({ reply: result });
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
