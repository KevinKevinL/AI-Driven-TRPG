const { PDFLoader } = require("@langchain/community/document_loaders/fs/pdf");
const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");

// load docs
const mechanismLoader = new PDFLoader("../../ai/rag/mechanism.pdf");
const mechanism = await mechanismLoader.load();
console.log(mechanism[0]);
console.log(`Total characters: ${mechanism[0].pageContent.length}`);
// split docs
const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
});
const mechanismChunks = await splitter.splitDocuments(mechanism);
console.log(`Split blog post into ${allSplits.length} sub-documents.`);
// store docs
await vectorStore.addDocuments(allSplits);


const { OpenAIEmbeddings } = require("@langchain/embeddings/openai");
const { Chroma } = require("@langchain/vectorstores/chroma");
const { RetrievalQAChain } = require("@langchain/chains");
// 初始化嵌入模型
const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
});
  
// 创建向量存储
const vectorStore = await Chroma.fromDocuments(
    ...mechanismChunks,
    embeddings
);
const retriever = vectorStore.asRetriever();
const ragChain = RetrievalQAChain.fromLLM(llm, retriever);



// loadMechanism().catch(console.error);