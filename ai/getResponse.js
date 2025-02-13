// ai/getResponse.js

import { ChatOpenAI } from "@langchain/openai";
import { StructuredOutputParser } from "langchain/output_parsers";
import { getMechanismRetriever, getModuleRetriever } from "./rag/loader.js";
import { systemPrompts } from "./prompts.js";
import { taSchema } from "./schemas.js";
import { saveJSONToFile } from "../utils/saveJSON.js";

export async function getResponse({ input, role, module }) {
  try {
    // Retrieve additional context from PDFs
    const mechanismRetriever = await getMechanismRetriever();
    const mechanismDocs = await mechanismRetriever.getRelevantDocuments(input);
    let additionalContext = mechanismDocs.map(doc => doc.pageContent).join("\n\n");

    if (module) {
      const moduleRetriever = await getModuleRetriever();
      const moduleDocs = await moduleRetriever.getRelevantDocuments(input);
      additionalContext += "\n\n" + moduleDocs.map(doc => doc.pageContent).join("\n\n");
    }

    if (role === "KP") {
      // KP: natural conversation with extra JSON line for talkRequired
      const baseSystemPromptKP = systemPrompts["KP"];
      const finalSystemPromptKP = `${baseSystemPromptKP}\n\nAdditional reference info (from PDF):\n${additionalContext}`;
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

      // Split response into lines and try to parse the last line as JSON for talkRequired
      const responseLines = llmResponseKP.content
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
      let talkRequired = [];
      let freeText = llmResponseKP.content;
      try {
        const lastLine = responseLines[responseLines.length - 1];
        const parsedJSON = JSON.parse(lastLine);
        if (parsedJSON && Array.isArray(parsedJSON.talkRequired)) {
          talkRequired = parsedJSON.talkRequired;
          freeText = responseLines.slice(0, responseLines.length - 1).join('\n');
        }
      } catch (e) {
        console.error("Failed to parse talkRequired JSON:", e);
      }
      return { text: freeText, talkRequired };
    } else if (role === "NPC") {
      // NPC: natural chat without structured JSON
      const baseSystemPromptNPC = systemPrompts["NPC"];
      const finalSystemPromptNPC = `${baseSystemPromptNPC}\n\nAdditional reference info (from PDF):\n${additionalContext}`;
      console.log("Final NPC system prompt:", finalSystemPromptNPC);

      const llm = new ChatOpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        model: "gpt-4o-mini",
        temperature: 0.7,
      });
      const messagesNPC = [
        { role: "system", content: finalSystemPromptNPC },
        { role: "user", content: input },
      ];
      const llmResponseNPC = await llm.call(messagesNPC);
      console.log("LLM NPC raw response:", llmResponseNPC);
      return llmResponseNPC.content;
    } else {
      // For TA or others, use structured output parser
      let schema = taSchema;
      let baseSystemPrompt = systemPrompts[role] || systemPrompts["KP"];
      const parser = new StructuredOutputParser(schema);
      const formatInstructions = parser.getFormatInstructions();
      const finalSystemPrompt = `${baseSystemPrompt}\n\nAdditional reference info (from PDF):\n${additionalContext}\n\n${formatInstructions}`;
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
