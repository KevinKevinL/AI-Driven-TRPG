import React, { useState } from 'react';
import { useRandomEventGenerator } from '@/components/mainchat/RandomEventGenerator';

const RandomEventsPage = () => {
  const [occurredEvents, setOccurredEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const eventGenerator = useRandomEventGenerator();

  const handleGenerateEvents = async (mapId) => {
    setLoading(true);
    setError(null);
    
    try {
      const events = await eventGenerator.handleGenerateEvents(mapId);
      setOccurredEvents(events);
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
      {occurredEvents.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">发生的事件:</h2>
          <ul className="space-y-2">
            {occurredEvents.map((event) => (
              <li key={event.id} className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between">
                  <span className="font-medium text-gray-700">事件 ID: {event.id}</span>
                  <span className="text-sm text-gray-500">触发概率: {event.rate}%</span>
                </div>
                <div className="mt-2">
                  <p className="text-gray-800">{event.event_info}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RandomEventsPage;