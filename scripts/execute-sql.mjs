import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { query } from '../server/db/index.mjs';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 数据库SQL文件路径
const databaseDir = path.join(__dirname, '..', 'database');
const initSqlPath = path.join(databaseDir, 'init.sql');
const contentTypeSystemSqlPath = path.join(databaseDir, 'content-type-system.sql');
const seedSqlPath = path.join(databaseDir, 'seed.sql');

// 读取SQL文件内容
const readSqlFile = (filePath) => {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`Error reading SQL file ${filePath}:`, error);
    return null;
  }
};

// 将SQL文件分割成单独的语句
const splitSqlStatements = (sqlContent) => {
  // 简单的SQL语句分割，按分号分割但忽略引号内的分号
  const statements = [];
  let currentStatement = '';
  let inQuote = false;
  let quoteChar = '';
  
  for (let i = 0; i < sqlContent.length; i++) {
    const char = sqlContent[i];
    
    // 处理引号
    if ((char === "'" || char === '"') && (i === 0 || sqlContent[i-1] !== '\\')) {
      if (!inQuote) {
        inQuote = true;
        quoteChar = char;
      } else if (char === quoteChar) {
        inQuote = false;
      }
    }
    
    // 处理分号
    if (char === ';' && !inQuote) {
      if (currentStatement.trim()) {
        statements.push(currentStatement + ';');
      }
      currentStatement = '';
    } else {
      currentStatement += char;
    }
  }
  
  // 添加最后一个语句（如果没有分号结尾）
  if (currentStatement.trim()) {
    statements.push(currentStatement);
  }
  
  return statements.filter(stmt => stmt.trim());
};

// 执行单个SQL语句
const executeSingleStatement = async (statement) => {
  try {
    await query(statement);
    return true;
  } catch (error) {
    // 如果是"已存在"的错误，我们可以忽略它
    if (error.code === '42P07' || // 表已存在
        error.code === '42701' || // 列已存在
        error.code === '42P16' || // 触发器已存在
        error.code === '42P13' || // 函数已存在
        error.code === '42P05') { // 索引已存在
      console.log(`- 忽略已存在的对象: ${error.message || error}`);
      return true;
    }
    console.error(`- 执行错误: ${error.message || error}`);
    return false;
  }
};

// 执行SQL文件中的所有语句
const executeSqlFile = async (sqlContent, description) => {
  if (!sqlContent) return false;
  
  console.log(`\n执行 ${description}...`);
  const statements = splitSqlStatements(sqlContent);
  console.log(`共找到 ${statements.length} 条SQL语句`);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i].trim();
    if (!statement) continue;
    
    // 只显示语句的前50个字符作为日志
    const shortStatement = statement.length > 50 
      ? statement.substring(0, 50) + '...' 
      : statement;
    console.log(`[${i+1}/${statements.length}] 执行: ${shortStatement}`);
    
    const success = await executeSingleStatement(statement);
    if (success) {
      successCount++;
    } else {
      errorCount++;
      // 如果是创建表或索引失败，可能会影响后续语句，但我们继续执行
    }
  }
  
  console.log(`${description} 执行完成: 成功 ${successCount}, 失败 ${errorCount}`);
  return errorCount === 0;
};

// 检查数据库表是否存在
const checkTableExists = async (tableName) => {
  try {
    const result = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = $1
      )
    `, [tableName]);
    return result.rows[0].exists;
  } catch (error) {
    console.error(`检查表 ${tableName} 是否存在时出错:`, error);
    return false;
  }
};

// 主函数
const main = async () => {
  console.log('开始更新数据库结构...');
  
  // 读取SQL文件内容
  const initSql = readSqlFile(initSqlPath);
  const contentTypeSystemSql = readSqlFile(contentTypeSystemSqlPath);
  const seedSql = readSqlFile(seedSqlPath);
  
  // 检查内容表是否存在
  const contentsTableExists = await checkTableExists('contents');
  console.log(`内容表(contents)${contentsTableExists ? '已存在' : '不存在'}`);
  
  // 按顺序执行SQL文件
  if (!contentsTableExists) {
    await executeSqlFile(initSql, '数据库初始化');
  } else {
    console.log('跳过数据库初始化，因为内容表已存在');
  }
  
  // 检查内容类型表是否存在
  const contentTypesTableExists = await checkTableExists('content_types');
  if (!contentTypesTableExists) {
    await executeSqlFile(contentTypeSystemSql, '内容类型系统设置');
  } else {
    console.log('跳过内容类型系统设置，因为内容类型表已存在');
  }
  
  // 检查是否有内容数据
  try {
    const contentCount = await query('SELECT COUNT(*) FROM contents');
    if (contentCount.rows[0].count === '0') {
      await executeSqlFile(seedSql, '种子数据插入');
    } else {
      console.log('跳过种子数据插入，因为内容表中已有数据');
    }
  } catch (error) {
    console.error('检查内容数据时出错:', error);
  }
  
  console.log('\n数据库结构更新完成。');
  
  // 验证数据库结构
  console.log('\n验证数据库结构...');
  const tables = ['contents', 'content_types', 'categories', 'tags', 'content_categories', 'content_tags'];
  for (const table of tables) {
    const exists = await checkTableExists(table);
    console.log(`- 表 ${table}: ${exists ? '✅ 存在' : '❌ 不存在'}`);
  }
};

// 执行主函数
main().catch(error => {
  console.error('未处理的错误:', error);
}).finally(() => {
  console.log('脚本执行完毕');
  // 这里不要关闭连接池，因为它可能会导致进程提前退出
});
