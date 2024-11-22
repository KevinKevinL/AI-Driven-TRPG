
function generateAIResponse(input) {
    // 保存当前的对话
    conversation.push({ sender: "玩家", message: input });

    // 简单地生成AI响应，未来可以替换为更复杂的逻辑
    let response = "AI说道: " + input + " 这是个意思...";
    conversation.push({ sender: "KP", message: response });

    // 返回AI的回复
    return response;
}
