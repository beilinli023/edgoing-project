/**
 * 测试连接脚本
 * 
 * 这个脚本测试 Express 后端到 Strapi 后端的连接
 */

const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// 加载 Express 后端的环境变量
const expressEnvPath = path.resolve(__dirname, '../backend/express/.env');
if (fs.existsSync(expressEnvPath)) {
  const expressEnv = dotenv.parse(fs.readFileSync(expressEnvPath));
  Object.entries(expressEnv).forEach(([key, value]) => {
    process.env[key] = value;
  });
}

// Strapi API URL
const strapiUrl = process.env.STRAPI_API_URL || 'http://localhost:1337';

console.log(`测试连接到 Strapi 后端: ${strapiUrl}`);

// 测试连接
async function testConnection() {
  try {
    const response = await axios.get(`${strapiUrl}/api/healthcheck`);
    console.log('连接成功!');
    console.log('响应状态:', response.status);
    console.log('响应数据:', response.data);
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
testConnection().then(success => {
  if (!success) {
    console.log('\n尝试连接到 Strapi 根路径...');
    return axios.get(strapiUrl).then(response => {
      console.log('连接到根路径成功!');
      console.log('响应状态:', response.status);
    }).catch(error => {
      console.error('连接到根路径失败:', error.message);
    });
  }
}).finally(() => {
  console.log('\n测试完成');
});
