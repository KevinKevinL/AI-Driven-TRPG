// db.js
import { createPool } from 'mysql2/promise';

const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// API 路由处理器
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '方法不允许' });
  }

  try {
    const { query, params } = req.body;
    console.log('服务器收到查询:', query);
    console.log('服务器收到参数:', params);

    try {
      const [results] = await pool.execute(query, params);
      console.log('查询执行成功, 结果:', results);
      res.status(200).json({ results });
    } catch (dbError) {
      console.error('SQL执行错误:', {
        message: dbError.message,
        code: dbError.code,
        sqlState: dbError.sqlState,
        sql: dbError.sql,
        values: params
      });
      
      // 返回更详细的错误信息
      res.status(500).json({ 
        error: dbError.message,
        sqlError: {
          code: dbError.code,
          state: dbError.sqlState,
          sql: query,
          params: params
        }
      });
    }
  } catch (error) {
    console.error('服务器错误:', error);
    res.status(500).json({ 
      error: '服务器错误',
      details: error.message,
      stack: error.stack
    });
  }
}