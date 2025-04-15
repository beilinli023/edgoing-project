import pg from 'pg';
const { Pool } = pg;

// 数据库连接配置
// 实际项目中应从环境变量获取这些值
const pool = new Pool({
  // 无需指定user，使用当前系统用户
  host: 'localhost',
  database: 'cms_db',
  // 空密码或使用环境变量
  password: '',
  port: 5432,
});

// 测试数据库连接
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected successfully at:', res.rows[0].now);
  }
});

// 包装查询函数，便于使用
export const query = (text, params) => pool.query(text, params);

// 添加获取客户端的方法，用于事务处理
query.getClient = async () => {
  return await pool.connect();
};

// 事务支持函数 - 为了兼容性保留
export const getClient = async () => {
  const client = await pool.connect();
  
  // 包装事务操作函数
  const transactionQuery = async (queryText, params) => {
    return client.query(queryText, params);
  };
  
  // 开始事务
  const beginTransaction = async () => {
    await client.query('BEGIN');
  };
  
  // 提交事务
  const commitTransaction = async () => {
    await client.query('COMMIT');
  };
  
  // 回滚事务
  const rollbackTransaction = async () => {
    await client.query('ROLLBACK');
  };
  
  // 释放客户端
  const release = () => {
    client.release();
  };
  
  return {
    query: transactionQuery,
    beginTransaction,
    commitTransaction,
    rollbackTransaction,
    release
  };
};

// 简化的事务方法，返回一个已开始事务的客户端
export const transaction = async () => {
  const client = await pool.connect();
  await client.query('BEGIN');
  return client;
};

export default {
  query,
  getClient,
  transaction
};
