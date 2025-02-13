// ai/generateStory.js
import { ChatOpenAI } from "@langchain/openai";
import { StructuredOutputParser } from "langchain/output_parsers";
import { storySchema } from "./schemas.js";

export async function generateStory(prompt) {
  try {
    // 定义专用的系统提示
    const baseSystemPrompt = `
You are a creative storyteller. Based on the following event information, generate a JSON object in strict JSON format with the following structure:

{
  "description": "<A detailed story description>"
}

Respond only with that JSON object, and no extra text.
    `;

    // 构建结构化输出解析器，只需要 description 字段
    const parser = new StructuredOutputParser(storySchema);
    const formatInstructions = parser.getFormatInstructions();

    // 组装最终 prompt
    const finalPrompt = `${baseSystemPrompt}

Event information:
${prompt}

${formatInstructions}`;

    console.log("Final story prompt:", finalPrompt);

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
    console.log("LLM story response:", llmResponse);

    const parsed = await parser.parse(llmResponse.content);
    return parsed;
  } catch (err) {
    console.error("Error in generateStory:", err);
    throw new Error("Failed to generate story.");
  }
}
