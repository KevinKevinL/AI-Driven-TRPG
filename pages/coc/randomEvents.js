import React, { useState } from 'react';
import { useRandomEventGenerator } from '@/components/mainchat/RandomEventGenerator';
import { DiceSystem } from '@utils/diceSystem';
import DatabaseManager from '@components/coc/DatabaseManager';
import { fetchChatGPTResponse } from '../../utils/chatAPI';
import { calculateDerivedValues } from '@components/coc/AttributeBox';

const RandomEventsPage = () => {
  const [occurredEvents, setOccurredEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const eventGenerator = useRandomEventGenerator();
  const { getAttributeByTestRequired, getCharacterAttributeValue } = DatabaseManager();

  const handleGenerateEvents = async (mapId) => {
    setLoading(true);
    setError(null);
    
    // try {
    //   const events = await eventGenerator.handleGenerateEvents(mapId);
    //   setOccurredEvents(events);
    // } catch (err) {
    //   setError(err.message);
    //   console.error('生成事件时出错:', err);
    // } finally {
    //   setLoading(false);
    // }
    try {
      // 获取随机事件
      const event = await eventGenerator.handleGenerateEvents(mapId);
      if (!event) {
        console.error('未找到任何事件');
        // setOccurredEvents(null);
        return;
      }
      console.log('生成的事件:', event);
      if(event === null) {
        console.warn('未生成事件');
        //----------------------------------
        return;
      }
      // 清理 result 数据，去除不可见字符（如换行符、回车符、制表符）
      const cleanResult = (result) => {
        result = result.replace(/[\n\r\t]+/g, ''); // 替换掉换行符、回车符和制表符
        return result;
      };

      // 解析和处理逻辑
      const processedEvent = await(async () => {
        try {

          if (!event.result) {
            console.warn(`事件 ID: ${event.id} 的 result 字段为空或未定义`);
            return {
              ...event,
              resultData: null,
              testDescription: '事件结果缺失',
              roll: null, // 如果 result 为空，返回 null
              checkResult: null,
            };
          }

          // 清理 result 数据，去除不可见字符
          const cleanedResult = cleanResult(event.result);
          console.log("事件的 result 字段处理后内容:", cleanedResult);

          const resultData = JSON.parse(cleanedResult); // 解析 JSON

          // 生成描述信息
          let testDescription = '无需鉴定';
          let roll = 0;
          let checkResult = null; // 默认为 null
          let chatGPTPrompt = ""; // 用于发送给 chatGPT 的内容

          if (resultData.testRequired > 0) {
            // 进行检定，掷出随机值
            roll = DiceSystem.rollD100(); // 使用现有的 DiceSystem.rollD100()
      
            // 获取属性值并进行比较
            const attribute = getAttributeByTestRequired(resultData.testRequired); // 获取属性对象
            const characterId = resultData.testCharacterId;

            // 获取角色对应的属性值
            const attributeValue = await getCharacterAttributeValue(resultData.testRequired, characterId);
            
            console.log('roll:', roll);
            console.log('attributeValue:', attributeValue);
            
            // 根据属性值进行检定成功或失败的判断
            if (attributeValue !== null) {
              if (roll <= attributeValue) {
                checkResult = '检定成功';
                testDescription = `掷骰结果: ${roll}（需要检定技能: ${attribute.label}）`;
                // 发送成功效果给 chatGPT 生成故事描述
                chatGPTPrompt = `${event.event_info} 成功效果: ${resultData.successEffect}`;
              } else {
                checkResult = '检定失败';
                testDescription = `掷骰结果: ${roll}（需要检定技能: ${attribute.label}）`;
                // 发送失败效果给 chatGPT 生成故事描述
                chatGPTPrompt = `${event.event_info} 失败效果: ${resultData.failEffect}`;
              }
            } else {
              checkResult = '未找到角色的属性值';
              chatGPTPrompt = `${attribute.label} 无法进行检定，因为找不到角色的属性值。`;
            }
          }

          // 调用 fetchChatGPTResponse 生成完整的故事描述
          const chatGPTResponse = await fetchChatGPTResponse([{
            role: "user",
            content: chatGPTPrompt
          }]);

          return {
            ...event,
            resultData, // 解析后的 JSON 数据
            testDescription, // 鉴定逻辑的结果
            roll, // 返回的随机值
            checkResult, // 检定结果（成功/失败/未找到属性）
            chatGPTResponse: chatGPTResponse.reply || "未能生成完整的故事描述", // 获取 GPT 的回应
          };
        } catch (err) {
          console.error('解析 result 字段失败:', err);
          console.log("事件的 result 字段内容:", event.result);

          return {
            ...event,
            resultData: null,
            testDescription: '事件结果解析失败',
            roll: null, // 如果解析失败，返回 null
            checkResult: '检定出错，失败',
          };
        }
      })();

      // 更新状态
      setOccurredEvents(processedEvent);
    } catch (err) {
      setError(err.message);
      console.error('生成事件时出错:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetEvents = async (mapId) => {
    setLoading(true);
    setError(null);
    
    try {
      await eventGenerator.handleResetEvents(mapId);
      setOccurredEvents([]);
    } catch (err) {
      setError(err.message);
      console.error('重置事件时出错:', err);
    } finally {
      setLoading(false);
    }
    
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">随机事件生成器</h1>
      
      {/* 按钮组 */}
      <div className="mb-4 space-x-4">
        <button
          onClick={() => handleGenerateEvents(1)}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? '生成中...' : '生成随机事件'}
        </button>
  
        <button
          onClick={() => handleResetEvents(1)}
          disabled={loading}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          重置事件状态
        </button>
      </div>
  
      {/* 错误提示 */}
      {error && (
        <div className="text-red-500 mb-4">
          错误: {error}
        </div>
      )}
  
      {/* 显示生成的事件 */}
      {occurredEvents && (
        <div>
          <h2 className="text-xl font-semibold mb-2">发生的事件:</h2>
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start justify-between">
              <span className="font-medium text-gray-700">事件 ID: {occurredEvents.id}</span>
              <span className="text-sm text-gray-500">触发概率: {occurredEvents.rate}%</span>
            </div>
            <div className="mt-2">
              <p className="text-gray-800">{occurredEvents.event_info}</p>
            </div>
            <div className="mt-2 text-gray-600">
              <p>{occurredEvents.testDescription}</p>
              {occurredEvents.checkResult && (
                <p className="text-green-600">{occurredEvents.checkResult}</p>
              )}
            </div>
            {/* 显示 GPT 生成的故事描述 */}
            {occurredEvents.chatGPTResponse && (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                <h3 className="font-semibold">生成的故事描述:</h3>
                <p>{occurredEvents.chatGPTResponse}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RandomEventsPage;
