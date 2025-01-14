import React from 'react';
import DatabaseManager from '@components/coc/DatabaseManager';

export const useRandomEventGenerator = () => {
  const {
    generateRandomEvents,
    getMapEvents,
    getEvents,
    resetEventStatus,
  } = DatabaseManager();

  // 用于生成随机事件的逻辑
  const handleGenerateEvents = async (mapId) => {
    try {
      // 获取并返回生成的事件
      const events = await generateRandomEvents(mapId);
      return events;
    } catch (error) {
      console.error('生成随机事件失败:', error);
      throw error;
    }
  };

  // 用于重置事件状态的逻辑
  const handleResetEvents = async (mapId) => {
    try {
      await resetEventStatus(mapId);
    } catch (error) {
      console.error('重置事件状态失败:', error);
      throw error;
    }
  };

  // 返回需要的方法
  return {
    handleGenerateEvents,
    handleResetEvents,
  };
};