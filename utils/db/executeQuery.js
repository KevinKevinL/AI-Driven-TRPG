export async function executeQuery(query, params = []) {
  try {
    console.log('开始执行查询:', query);
    console.log('查询参数:', params);
    
    const response = await fetch('/api/db', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, params }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('查询失败:', errorData);
      throw new Error(`数据库查询失败: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log('查询结果:', data);

    if (data.error) {
      throw new Error(data.error);
    }

    return data.results;
  } catch (error) {
    console.error('查询执行错误:', error);
    throw error;
  }
}