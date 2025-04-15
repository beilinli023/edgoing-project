// 测试 Strapi 的 program API 和前端应用的集成
import axios from 'axios';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

// 配置
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const EXPRESS_URL = process.env.EXPRESS_URL || 'http://localhost:3001';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8083';

// 创建 axios 实例
const strapiAxios = axios.create({
  baseURL: STRAPI_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

const expressAxios = axios.create({
  baseURL: EXPRESS_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

const frontendAxios = axios.create({
  baseURL: FRONTEND_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 测试 Strapi 的 program API
async function testStrapiProgramAPI() {
  console.log('\n--- 测试 Strapi 的 program API ---');
  try {
    // 获取中文程序列表
    console.log('\n获取中文程序列表:');
    const zhResponse = await strapiAxios.get('/api/programs?locale=zh');
    console.log(`状态码: ${zhResponse.status}`);
    console.log(`找到 ${zhResponse.data.data.length} 个中文程序`);

    if (zhResponse.data.data.length > 0) {
      const firstProgram = zhResponse.data.data[0];
      console.log(`第一个程序 ID: ${firstProgram.id}`);
      console.log(`第一个程序数据结构:`, JSON.stringify(firstProgram, null, 2).substring(0, 200) + '...');

      // 检查数据结构
      if (firstProgram.attributes) {
        console.log(`第一个程序标题: ${firstProgram.attributes.title}`);
        console.log(`第一个程序 documentId: ${firstProgram.attributes.documentId}`);
      } else {
        console.log(`第一个程序标题: ${firstProgram.title}`);
        console.log(`第一个程序 documentId: ${firstProgram.documentId}`);
      }
    }

    // 获取英文程序列表
    console.log('\n获取英文程序列表:');
    const enResponse = await strapiAxios.get('/api/programs?locale=en');
    console.log(`状态码: ${enResponse.status}`);
    console.log(`找到 ${enResponse.data.data.length} 个英文程序`);

    if (enResponse.data.data.length > 0) {
      const firstProgram = enResponse.data.data[0];
      console.log(`第一个程序 ID: ${firstProgram.id}`);
      console.log(`第一个程序数据结构:`, JSON.stringify(firstProgram, null, 2).substring(0, 200) + '...');

      // 检查数据结构
      if (firstProgram.attributes) {
        console.log(`第一个程序标题: ${firstProgram.attributes.title}`);
        console.log(`第一个程序 documentId: ${firstProgram.attributes.documentId}`);
      } else {
        console.log(`第一个程序标题: ${firstProgram.title}`);
        console.log(`第一个程序 documentId: ${firstProgram.documentId}`);
      }
    }

    return true;
  } catch (error) {
    console.error('测试 Strapi 的 program API 失败:', error.message);
    if (error.response) {
      console.error('响应状态码:', error.response.status);
      console.error('响应数据:', error.response.data);
    }
    return false;
  }
}

// 测试 Express 代理服务器的 program API
async function testExpressProgramAPI() {
  console.log('\n--- 测试 Express 代理服务器的 program API ---');
  try {
    // 获取中文程序列表
    console.log('\n获取中文程序列表:');
    const zhResponse = await expressAxios.get('/api/programs?locale=zh');
    console.log(`状态码: ${zhResponse.status}`);
    console.log(`找到 ${zhResponse.data.data.length} 个中文程序`);

    if (zhResponse.data.data.length > 0) {
      const firstProgram = zhResponse.data.data[0];
      console.log(`第一个程序 ID: ${firstProgram.id}`);
      console.log(`第一个程序标题: ${firstProgram.title_zh || firstProgram.title}`);
    }

    // 获取英文程序列表
    console.log('\n获取英文程序列表:');
    const enResponse = await expressAxios.get('/api/programs?locale=en');
    console.log(`状态码: ${enResponse.status}`);
    console.log(`找到 ${enResponse.data.data.length} 个英文程序`);

    if (enResponse.data.data.length > 0) {
      const firstProgram = enResponse.data.data[0];
      console.log(`第一个程序 ID: ${firstProgram.id}`);
      console.log(`第一个程序标题: ${firstProgram.title_en || firstProgram.title}`);
    }

    // 获取程序筛选选项
    console.log('\n获取程序筛选选项:');
    const filtersResponse = await expressAxios.get('/api/programs/filters?locale=zh');
    console.log(`状态码: ${filtersResponse.status}`);
    console.log('筛选选项:', filtersResponse.data);

    return true;
  } catch (error) {
    console.error('测试 Express 代理服务器的 program API 失败:', error.message);
    if (error.response) {
      console.error('响应状态码:', error.response.status);
      console.error('响应数据:', error.response.data);
    }
    return false;
  }
}

// 测试前端应用的 program API
async function testFrontendProgramAPI() {
  console.log('\n--- 测试前端应用的 program API ---');
  try {
    // 获取中文程序列表
    console.log('\n获取中文程序列表:');
    const zhResponse = await frontendAxios.get('/api/programs?locale=zh');
    console.log(`状态码: ${zhResponse.status}`);
    console.log(`找到 ${zhResponse.data.data.length} 个中文程序`);

    if (zhResponse.data.data.length > 0) {
      const firstProgram = zhResponse.data.data[0];
      console.log(`第一个程序 ID: ${firstProgram.id}`);
      console.log(`第一个程序标题: ${firstProgram.title_zh || firstProgram.title}`);
    }

    // 获取英文程序列表
    console.log('\n获取英文程序列表:');
    const enResponse = await frontendAxios.get('/api/programs?locale=en');
    console.log(`状态码: ${enResponse.status}`);
    console.log(`找到 ${enResponse.data.data.length} 个英文程序`);

    if (enResponse.data.data.length > 0) {
      const firstProgram = enResponse.data.data[0];
      console.log(`第一个程序 ID: ${firstProgram.id}`);
      console.log(`第一个程序标题: ${firstProgram.title_en || firstProgram.title}`);
    }

    // 获取程序筛选选项
    console.log('\n获取程序筛选选项:');
    const filtersResponse = await frontendAxios.get('/api/programs/filters?locale=zh');
    console.log(`状态码: ${filtersResponse.status}`);
    console.log('筛选选项:', filtersResponse.data);

    return true;
  } catch (error) {
    console.error('测试前端应用的 program API 失败:', error.message);
    if (error.response) {
      console.error('响应状态码:', error.response.status);
      console.error('响应数据:', error.response.data);
    }
    return false;
  }
}

// 主函数
async function main() {
  console.log('开始测试 Strapi 的 program API 和前端应用的集成...');
  console.log(`Strapi URL: ${STRAPI_URL}`);
  console.log(`Express URL: ${EXPRESS_URL}`);
  console.log(`Frontend URL: ${FRONTEND_URL}`);

  // 测试 Strapi 的 program API
  const strapiResult = await testStrapiProgramAPI();

  // 测试 Express 代理服务器的 program API
  const expressResult = await testExpressProgramAPI();

  // 测试前端应用的 program API
  const frontendResult = await testFrontendProgramAPI();

  // 输出测试结果
  console.log('\n--- 测试结果 ---');
  console.log(`Strapi 的 program API: ${strapiResult ? '成功' : '失败'}`);
  console.log(`Express 代理服务器的 program API: ${expressResult ? '成功' : '失败'}`);
  console.log(`前端应用的 program API: ${frontendResult ? '成功' : '失败'}`);
}

// 执行主函数
main().catch(console.error);
