// ai/rag/loader.js

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { CharacterTextSplitter } from "langchain/text_splitter";
import MiniSearch from "minisearch";

let mechanismRetriever = null;
let moduleRetriever = null;

/**
 * 构建一个可检索对象 (retriever)，实现 getRelevantDocuments(query)：
 * - 内部用 mini-search 做关键词搜索
 * - 返回若干最相关的文档片段
 */
function createMiniSearchRetriever(docs, options = {}) {
  const miniSearch = new MiniSearch({
    fields: ["text"],
    idField: "id",
    searchOptions: {
      prefix: true,
      fuzzy: 0.2,
      ...options.searchOptions,
    },
  });

  const indexedDocs = docs.map((doc, idx) => ({
    id: String(idx),
    text: doc.pageContent,
  }));

  miniSearch.addAll(indexedDocs);

  return {
    async getRelevantDocuments(query) {
      const results = miniSearch.search(query);
      const topResults = results.slice(0, 3);
      return topResults.map((r) => {
        const original = indexedDocs.find((d) => d.id === r.id);
        return {
          pageContent: original.text,
        };
      });
    },
  };
}

/**
 * 加载 mechanism.pdf，并创建一个 local mini-search retriever
 */
export async function getMechanismRetriever() {
  if (mechanismRetriever) {
    return mechanismRetriever;
  }
  console.log("[Loader] Loading mechanism.pdf and building mini-search index...");

  // 1) 读取 PDF
  const loader = new PDFLoader("ai/rag/mechanism.pdf");
  const rawDocs = await loader.load();

  // 2) 切分文本
  const splitter = new CharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const docs = await splitter.splitDocuments(rawDocs);

  // 3) 创建 mini-search 检索器
  mechanismRetriever = createMiniSearchRetriever(docs);

  console.log("[Loader] mechanism retriever built (mini-search).");
  return mechanismRetriever;
}

/**
 * 加载 dead_light.pdf，并创建一个 local mini-search retriever
 */
export async function getModuleRetriever() {
  if (moduleRetriever) {
    return moduleRetriever;
  }
  console.log("[Loader] Loading module/dead_light.pdf and building mini-search index...");

  const loader = new PDFLoader("ai/rag/module/dead_light.pdf");
  const rawDocs = await loader.load();

  const splitter = new CharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const docs = await splitter.splitDocuments(rawDocs);

  moduleRetriever = createMiniSearchRetriever(docs);

  console.log("[Loader] module retriever built (mini-search).");
  return moduleRetriever;
}
