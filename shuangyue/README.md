# AI module

## main mechanism
 - LSTM
 - RAG


## next steps
 - api
 - test memory performance
    - 短期记忆测试：输入多轮对话，确保AI在每次回答时参考了之前的所有对话内容
    - 长期记忆测试：输入一段涉及角色背景或游戏设定的内容，确保AI可以根据之前的设定给出一致的回答
 - optimize
    - 减少检索次数：可以对同一对话中的重复问题减少检索次数，以优化性能
    - 缓存策略：对长期记忆中的常见问题实现缓存，减少频繁的数据库访问