// ai/getResponse.js

import { ChatOpenAI } from "@langchain/openai";
import { StructuredOutputParser } from "langchain/output_parsers";
import { getMechanismRetriever, getModuleRetriever } from "./rag/loader.js";
import { systemPrompts } from "./prompts.js";
import { taSchema, kpSchema, npcSchema } from "./schemas.js";
import { saveJSONToFile } from "../utils/saveJSON.js";  // 注意路径，根据你的项目结构调整

/**
 * getResponse:
 * 1) 从 PDF 中检索额外上下文；
 * 2) 如果角色为 KP，则同时生成 KP 回复与 TA 回复，
 *    - 将 TA 回复保存为 JSON 文件（不返回给前端）；
 *    - 返回 KP 回复给前端；
 * 3) 否则仅生成相应角色的回复返回。
 */
export async function getResponse({ input, role, module }) {
  try {
    // 1) 检索 mechanism.pdf 中的文本片段
    const mechanismRetriever = await getMechanismRetriever();
    const mechanismDocs = await mechanismRetriever.getRelevantDocuments(input);
    let additionalContext = mechanismDocs.map(doc => doc.pageContent).join("\n\n");

    // 如果指定了 module，则从 dead_light.pdf 中检索更多上下文
    if (module) {
      const moduleRetriever = await getModuleRetriever();
      const moduleDocs = await moduleRetriever.getRelevantDocuments(input);
      additionalContext += "\n\n" + moduleDocs.map(doc => doc.pageContent).join("\n\n");
    }

    // 2) 针对 KP 角色同时生成两份回复
    if (role === "KP") {
      // --- 生成 KP 回复（用于前端展示） ---
      const baseSystemPromptKP = systemPrompts["KP"];
      const parserKP = new StructuredOutputParser(kpSchema);
      const formatInstructionsKP = parserKP.getFormatInstructions();
      const finalSystemPromptKP = `${baseSystemPromptKP}

Additional reference info (from PDF):
${additionalContext}

${formatInstructionsKP}`;
      console.log("Final KP system prompt:", finalSystemPromptKP);

      const llm = new ChatOpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        model: "gpt-4o-mini",
        temperature: 0.7,
      });

      const messagesKP = [
        { role: "system", content: finalSystemPromptKP },
        { role: "user", content: input },
      ];
      const llmResponseKP = await llm.call(messagesKP);
      console.log("LLM KP raw response:", llmResponseKP);
      const kpParsed = await parserKP.parse(llmResponseKP.content);

      // --- 生成 TA 回复（用于存储，不显示给前端） ---
      const baseSystemPromptTA = systemPrompts["TA"];
      const parserTA = new StructuredOutputParser(taSchema);
      const formatInstructionsTA = parserTA.getFormatInstructions();
      const finalSystemPromptTA = `${baseSystemPromptTA}

Additional reference info (from PDF):
${additionalContext}

${formatInstructionsTA}`;
      console.log("Final TA system prompt:", finalSystemPromptTA);

      const messagesTA = [
        { role: "system", content: finalSystemPromptTA },
        { role: "user", content: input },
      ];
      const llmResponseTA = await llm.call(messagesTA);
      console.log("LLM TA raw response:", llmResponseTA);
      const taParsed = await parserTA.parse(llmResponseTA.content);

      // 将 TA 回复保存为 JSON 文件（文件夹 "savedResponses" 会在项目根目录下创建）
      saveJSONToFile(taParsed);

      // 返回 KP 回复给前端
      return kpParsed;
    } else {
      // 3) 针对其他角色使用对应的 Schema 与 Prompt 生成回复
      let schema = kpSchema;
      let baseSystemPrompt = systemPrompts[role] || systemPrompts["KP"];
      if (role === "TA") schema = taSchema;
      if (role === "NPC") schema = npcSchema;

      const parser = new StructuredOutputParser(schema);
      const formatInstructions = parser.getFormatInstructions();
      const finalSystemPrompt = `${baseSystemPrompt}

Additional reference info (from PDF):
${additionalContext}

${formatInstructions}`;
      console.log("Final system prompt:", finalSystemPrompt);

      const llm = new ChatOpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        model: "gpt-4o-mini",
        temperature: 0.7,
      });

      const messages = [
        { role: "system", content: finalSystemPrompt },
        { role: "user", content: input },
      ];
      const llmResponse = await llm.call(messages);
      console.log("LLM raw response:", llmResponse);
      const parsed = await parser.parse(llmResponse.content);
      return parsed;
    }
  } catch (err) {
    console.error("Error in getResponse:", err);
    throw new Error("Failed to generate response.");
  }
}
