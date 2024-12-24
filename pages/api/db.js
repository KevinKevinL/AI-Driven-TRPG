// db.js
import { createPool } from 'mysql2/promise';

const pool = createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'KevinNBNB',
  password: process.env.DB_PASSWORD || 'NBNBKevin',
  database: process.env.DB_NAME || 'characters',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 使用闭包创建一个简单的锁机制
const createLock = () => {
  let isLocked = false;
  let waiting = [];

  return {
    acquire: () => new Promise((resolve) => {
      if (!isLocked) {
        isLocked = true;
        resolve();
      } else {
        waiting.push(resolve);
      }
    }),
    release: () => {
      if (waiting.length > 0) {
        const next = waiting.shift();
        next();
      } else {
        isLocked = false;
      }
    }
  };
};

const lock = createLock();
let tablesInitialized = false;

// 初始化数据库表
async function initTables() {
  if (tablesInitialized) {
    return true;
  }

  const connection = await pool.getConnection();
  
  try {
    await lock.acquire();
    console.log('检查数据库表状态...');

    // 检查表是否存在
    const [tables] = await connection.query(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = DATABASE()
      AND table_name IN ('Professions', 'Characters', 'Attributes', 'Skills')
    `);

    if (tables[0].count === 4) {
      console.log('表已存在，无需初始化');
      tablesInitialized = true;
      return true;
    }

    // 开始事务
    await connection.beginTransaction();

    try {
      // 删除旧表（按依赖关系反序）
      await connection.query('DROP TABLE IF EXISTS Skills');
      await connection.query('DROP TABLE IF EXISTS Attributes');
      await connection.query('DROP TABLE IF EXISTS Characters');
      await connection.query('DROP TABLE IF EXISTS Professions');

      // 创建新表（按依赖关系顺序）
      await connection.query(`
        CREATE TABLE Professions (
          id INT PRIMARY KEY AUTO_INCREMENT,
          title VARCHAR(255) UNIQUE,
          description TEXT
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      console.log('Professions 表创建成功');

      await connection.query(`
        CREATE TABLE Characters (
          id INT PRIMARY KEY AUTO_INCREMENT,
          name VARCHAR(255),
          profession_id INT,
          description TEXT,
          FOREIGN KEY (profession_id) REFERENCES Professions(id) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      console.log('Characters 表创建成功');

      await connection.query(`
        CREATE TABLE Attributes (
          character_id INT,
          strength INT,
          constitution INT,
          size INT,
          dexterity INT,
          appearance INT,
          intelligence INT,
          power INT,
          education INT,
          luck INT,
          credit_rating INT,
          FOREIGN KEY (character_id) REFERENCES Characters(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      console.log('Attributes 表创建成功');

      await connection.query(`
        CREATE TABLE Skills (
          character_id INT,
          Fighting INT,
          Firearms INT,
          Dodge INT,
          Mechanics INT,
          Drive INT,
          Stealth INT,
          Investigate INT,
          Sleight_of_Hand INT,
          Electronics INT,
          History INT,
          Science INT,
          Medicine INT,
          Occult INT,
          Library_Use INT,
          Art INT,
          Persuade INT,
          Psychology INT,
          FOREIGN KEY (character_id) REFERENCES Characters(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      console.log('Skills 表创建成功');

      await connection.commit();
      console.log('数据库初始化完成');
      tablesInitialized = true;
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    }
  } catch (error) {
    console.error('初始化表失败:', error);
    throw error;
  } finally {
    connection.release();
    lock.release();
  }
}

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