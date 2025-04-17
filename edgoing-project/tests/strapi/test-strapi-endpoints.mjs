// 测试 Strapi API 的所有端点
import axios from 'axios';
import fs from 'fs';
import path from 'path';

// Strapi API 配置
const strapiConfig = {
  apiUrl: 'http://localhost:1337',
  apiToken: '', // 如果有令牌，请在这里填写
};

console.log(`Strapi API URL: ${strapiConfig.apiUrl}`);

// 创建 axios 实例
const strapiAxios = axios.create({
  baseURL: strapiConfig.apiUrl,
  headers: {
    'Content-Type': 'application/json',
    ...(strapiConfig.apiToken ? { 'Authorization': `Bearer ${strapiConfig.apiToken}` } : {})
  }
});

// 获取 Strapi API 信息的函数
async function fetchStrapiInfo() {
  try {
    console.log('正在获取 Strapi API 信息...');
    
    // 尝试获取 API 信息
    const infoUrl = '/api';
    console.log(`请求 API 信息 URL: ${infoUrl}`);
    
    try {
      const infoResponse = await strapiAxios.get(infoUrl);
      console.log('成功获取 API 信息');
      
      // 创建输出目录
      const outputDir = './strapi-info';
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      // 保存 API 信息
      fs.writeFileSync(
        path.join(outputDir, 'api-info.json'), 
        JSON.stringify(infoResponse.data, null, 2)
      );
      console.log(`API 信息已保存到 ${path.join(outputDir, 'api-info.json')}`);
      
      // 分析 API 端点
      analyzeApiEndpoints(infoResponse.data);
    } catch (error) {
      console.log('获取 API 信息失败，尝试其他端点...');
    }
    
    // 尝试常见的内容类型端点
    const commonEndpoints = [
      '/api/blogposts',
      '/api/programs',
      '/api/program-types',
      '/api/grades',
      '/api/categories',
      '/api/tags'
    ];
    
    console.log('\n尝试常见的内容类型端点:');
    
    for (const endpoint of commonEndpoints) {
      try {
        console.log(`请求端点: ${endpoint}`);
        const response = await strapiAxios.get(endpoint);
        console.log(`✅ 端点 ${endpoint} 可用`);
        
        // 创建输出目录
        const outputDir = './strapi-info';
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }
        
        // 保存响应数据
        const fileName = endpoint.replace(/^\/api\//, '').replace(/\//g, '-');
        fs.writeFileSync(
          path.join(outputDir, `${fileName}.json`), 
          JSON.stringify(response.data, null, 2)
        );
        console.log(`响应数据已保存到 ${path.join(outputDir, `${fileName}.json`)}`);
        
        // 如果是 programs 或 program-types 端点，分析数据
        if (endpoint.includes('program')) {
          console.log(`\n分析 ${endpoint} 数据:`);
          analyzeProgramData(response.data, endpoint);
        }
      } catch (error) {
        console.log(`❌ 端点 ${endpoint} 不可用 (${error.response?.status || error.message})`);
      }
    }
    
  } catch (error) {
    console.error('获取 Strapi API 信息失败:', error.message);
    if (error.response) {
      console.error('响应状态:', error.response.status);
      console.error('响应数据:', JSON.stringify(error.response.data, null, 2));
    }
    throw error;
  }
}

// 分析 API 端点的函数
function analyzeApiEndpoints(apiInfo) {
  console.log('\n===== API 端点分析 =====');
  
  if (!apiInfo) {
    console.log('API 信息无效');
    return;
  }
  
  // 列出所有端点
  if (Array.isArray(apiInfo)) {
    console.log(`找到 ${apiInfo.length} 个端点:`);
    apiInfo.forEach(endpoint => {
      console.log(`- ${endpoint}`);
    });
  } else if (typeof apiInfo === 'object') {
    console.log('API 信息结构:');
    Object.keys(apiInfo).forEach(key => {
      console.log(`- ${key}: ${typeof apiInfo[key]}`);
    });
  }
  
  console.log('\n===== 分析完成 =====');
}

// 分析 program 数据的函数
function analyzeProgramData(data, endpoint) {
  if (!data || !data.data) {
    console.log('数据无效');
    return;
  }
  
  const items = data.data;
  console.log(`找到 ${items.length} 个项目`);
  
  if (items.length > 0) {
    const firstItem = items[0];
    console.log(`第一个项目 ID: ${firstItem.id}`);
    
    if (firstItem.attributes) {
      console.log('属性:');
      Object.keys(firstItem.attributes).forEach(key => {
        const value = firstItem.attributes[key];
        const type = Array.isArray(value) ? 'array' : typeof value;
        console.log(`- ${key}: ${type}`);
      });
    }
  }
}

// 执行函数
fetchStrapiInfo()
  .then(() => {
    console.log('\n测试完成');
  })
  .catch(error => {
    console.error('\n测试失败:', error);
  });
