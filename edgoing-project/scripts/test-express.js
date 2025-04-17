/**
 * 测试 Express 后端脚本
 * 
 * 这个脚本测试前端到 Express 后端的连接
 */

const axios = require('axios');

// Express 后端 URL
const expressUrl = 'http://localhost:3001';

console.log(`测试连接到 Express 后端: ${expressUrl}`);

// 测试连接
async function testConnection() {
  try {
    const response = await axios.get(expressUrl);
    console.log('连接成功!');
    console.log('响应状态:', response.status);
    console.log('响应数据长度:', response.data.length);
    return true;
  } catch (error) {
    console.error('连接失败:', error.message);
    if (error.response) {
      console.error('响应状态:', error.response.status);
      console.error('响应数据:', error.response.data);
    }
    return false;
  }
}

// 执行测试
testConnection().finally(() => {
  console.log('\n测试完成');
});
