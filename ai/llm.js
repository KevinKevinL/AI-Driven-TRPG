require('dotenv').config();
// console.log("API Key:", process.env.OPENAI_API_KEY);
const { ChatOpenAI } = require("@langchain/openai");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { z } = require("zod");


const testSchema = z.object({
    test_required: z.array(z.string()).describe("List of attributes or skills to test"),
    talk_required: z.array(z.string()).describe("List of NPCs to talk to, if any"),
    fight_required: z.number().optional().describe("1=Yes, 0=No"),
    hard_level: z.number().optional().describe("Difficulty level: 1=Easy, 2=Hard, 3=Very Hard"),
});


const llm = new ChatOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    model: "gpt-4o-mini",
    temperature: 0.7,
    // other params...
});


const test_llm = llm.withStructuredOutput(testSchema, {
    name: "generate_test_result_json",
    strict: true,
});


// const prompt = ChatPromptTemplate.fromMessages([
//     [
//       "system",
//     `You are a tabletop RPG game master (KP). Based on the user's input, analyze the situation and generate a JSON response in the following format:
//     {{
//       "testRequired": [<list of attributes or skills to test>],
//       "hardlevel": <1 | 2 | 3>, // Difficulty: 1=Easy, 2=Hard, 3=Very Hard
//       "talkRequired": [<list of NPCs to talk to, if any>],
//       "fightRequired": <1 or 0> // 1=Yes, 0=No
//     }}
    
//     The available attributes and skills are:

//     Attributes:
//     - strength (力量 / STR): Physical strength.
//     - constitution (体质 / CON): Physical endurance and resilience.
//     - size (体型 / SIZ): Physical size and mass.
//     - dexterity (敏捷 / DEX): Agility and coordination.
//     - appearance (外貌 / APP): Physical attractiveness.
//     - intelligence (智力 / INT): Reasoning and memory capacity.
//     - power (意志 / POW): Willpower and mental fortitude.
//     - education (教育 / EDU): Level of formal knowledge and training.
//     - luck (幸运 / Luck): Fortuitous outcomes.

//     Derived Attributes:
//     - sanity (理智值 / SAN): Mental stability and resistance to psychological trauma.
//     - magicPoints (魔法值 / MP): Capacity to perform magical or supernatural actions.
//     - interestPoints (兴趣点数 / Interest): Points allocated for hobbies and personal interests.
//     - hitPoints (生命值 / HP): Physical health and ability to withstand injuries.
//     - moveRate (移动速度 / MOV): Ability to move across terrain quickly.
//     - damageBonus (伤害加值 / DB): Additional damage in combat based on physical build.
//     - build (体格 / Build): Overall physical build and size.
//     - professionalPoints (职业技能点 / Profession Points): Points allocated for professional skill development.

//     Skills:
//     - Fighting (格斗): Hand-to-hand combat or melee weapon proficiency. Base: 25.
//     - Firearms (枪械): Proficiency with guns and ranged weapons. Base: 20.
//     - Dodge (闪避): Ability to evade attacks. Base: 20.
//     - Mechanics (机械): Repair and operate mechanical devices. Base: 10.
//     - Drive (驾驶): Operate vehicles effectively. Base: 20.
//     - Stealth (潜行): Hide or move silently. Base: 20.
//     - Investigate (侦查): Spot clues and analyze environments. Base: 25.
//     - Sleight of Hand (巧手): Pick locks and perform manual dexterity tasks. Base: 10.
//     - Electronics (电子): Operate and repair electronic equipment. Base: 10.
//     - History (历史): Knowledge of history and archaeology. Base: 10.
//     - Science (科学): Understanding of basic sciences (physics, chemistry, biology). Base: 10.
//     - Medicine (医学): Medical knowledge and surgical skills. Base: 5.
//     - Occult (神秘学): Knowledge of occult and mythos-related topics. Base: 5.
//     - Library Use (图书馆使用): Ability to locate information in archives and libraries. Base: 20.
//     - Art (艺术): Artistic creation and appreciation. Base: 5.
//     - Persuade (交际): Social skills for negotiation and building relationships. Base: 15.
//     - Psychology (心理学): Understanding and analyzing human behavior. Base: 10.

//     Respond only with the JSON object.`,
//     ],
//     ["human", "{input}"],
// ]);


// const chain = prompt.pipe(llm);
// (async () => {
//     aiMsg = await chain.invoke({
//         input_language: "English",
//         output_language: "German",
//         input: "I will fight the monsters to protect my group.",
//       });
//     console.log(aiMsg.content);
//     console.log(JSON.parse(aiMsg.content));
//   })();


const prompt = ChatPromptTemplate.fromMessages([
    ["system", "{systemPrompt}"],
    ["human", "{input}"],
]);


















// const { PDFLoader } = require("@langchain/community/document_loaders/fs/pdf");
// const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");

// // load docs
// const mechanismLoader = new PDFLoader("./rag/mechanism.pdf");
// const mechanism = await mechanismLoader.load();
// console.log(mechanism[0]);
// console.log(`Total characters: ${mechanism[0].pageContent.length}`);
// // split docs
// const splitter = new RecursiveCharacterTextSplitter({
//     chunkSize: 1000,
//     chunkOverlap: 200,
// });
// const mechanismChunks = await splitter.splitDocuments(mechanism);
// console.log(`Split blog post into ${mechanismChunks.length} sub-documents.`);
// // store docs
// // await vectorStore.addDocuments(mechanismChunks);


// const { OpenAIEmbeddings } = require("@langchain/embeddings/openai");
// const { Chroma } = require("@langchain/vectorstores/chroma");
// const { RetrievalQAChain } = require("@langchain/chains");
// // 初始化嵌入模型
// const embeddings = new OpenAIEmbeddings({
//     openAIApiKey: process.env.OPENAI_API_KEY,
// });
  
// // 创建向量存储
// const vectorStore = await Chroma.fromDocuments(
//     ...mechanismChunks,
//     embeddings
// );
// const retriever = vectorStore.asRetriever();
// const ragChain = RetrievalQAChain.fromLLM(llm, retriever);



// loadMechanism().catch(console.error);







async function getAIResponse({ input, systemPrompt }) {
    try {
      const chain = prompt.pipe(llm);
      const result = await chain.invoke({ input, systemPrompt });
      // const ragChain = RetrievalQAChain.fromLLM(llm, retriever);
      // const result = await ragChain.invoke({ input, systemPrompt });
      return JSON.parse(result.content);
    } catch (err) {
      console.error("Error parsing AI response:", err);
      return { error: "Failed to process input" };
    }
}
module.exports = { getAIResponse };

// I want to persuade the guard to let us pass without fighting.
