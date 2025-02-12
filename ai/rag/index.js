// ai/rag/index.js

import { ChatOpenAI } from "@langchain/openai";
import { RetrievalQAChain } from "langchain/chains";
import { getMechanismRetriever, getModuleRetriever } from "./loader.js";

let mechanismChain = null;
let moduleChain = null;

/**
 * 只用于查询游戏机制
 */
export async function getMechanismChain() {
  if (mechanismChain) return mechanismChain;

  const retriever = await getMechanismRetriever();
  const llm = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: "gpt-4o-mini",
    temperature: 0.7,
  });

  mechanismChain = RetrievalQAChain.fromLLM(llm, retriever, {
    returnSourceDocuments: false,
  });

  return mechanismChain;
}

/**
 * 只用于查询剧本 dead_light.pdf
 */
export async function getModuleChain() {
  if (moduleChain) return moduleChain;

  const retriever = await getModuleRetriever();
  const llm = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: "gpt-4o-mini",
    temperature: 0.7,
  });

  moduleChain = RetrievalQAChain.fromLLM(llm, retriever, {
    returnSourceDocuments: false,
  });

  return moduleChain;
}
