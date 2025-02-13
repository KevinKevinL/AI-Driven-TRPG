// ai/generateCharacterDescription.js

import { ChatOpenAI } from "@langchain/openai";
import { StructuredOutputParser } from "langchain/output_parsers";
import { characterDescriptionSchema } from "./schemas.js";

export async function generateCharacterDescription(prompt) {
  try {
    // 定义用于生成角色描述的系统提示
    const baseSystemPrompt = `
你是一个帮助跑团玩家创建角色描述的助手。请根据以下角色信息生成一个完整的人物描述，用于克苏鲁的呼唤跑团游戏。要求：
1. 内容分为若干段落，包括角色的背景、性格、特质、技能等，并突出关键细节。
2. 风格沉浸、有理有据，且不得脱离角色已有信息。
3. 请严格返回下面的 JSON 格式，不要包含任何额外文本：
{
  "description": "<完整的人物描述>"
}
    `;

    const parser = new StructuredOutputParser(characterDescriptionSchema);
    const formatInstructions = parser.getFormatInstructions();

    const finalPrompt = `${baseSystemPrompt}

角色信息:
${prompt}

${formatInstructions}`;

    console.log("Final character description prompt:", finalPrompt);

    const llm = new ChatOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      model: "gpt-4o-mini",
      temperature: 0.7,
    });

    const messages = [
      { role: "system", content: finalPrompt },
      { role: "user", content: prompt },
    ];

    const llmResponse = await llm.call(messages);
    console.log("LLM character description response:", llmResponse);

    const parsed = await parser.parse(llmResponse.content);
    return parsed;
  } catch (err) {
    console.error("Error in generateCharacterDescription:", err);
    throw new Error("Failed to generate character description.");
  }
}
