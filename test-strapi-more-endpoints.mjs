// 测试更多 Strapi API 端点
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
async function fetchMoreEndpoints() {
  try {
    console.log('正在测试更多 Strapi API 端点...');
    
    // 尝试更多可能的端点
    const moreEndpoints = [
      '/api/programtypes',
      '/api/program-types',
      '/api/program-type',
      '/api/programtype',
      '/api/program',
      '/api/programs',
      '/api/blog-categories',
      '/api/blog-tags',
      '/api/blog-authors'
    ];
    
    console.log('\n尝试更多可能的端点:');
    
    for (const endpoint of moreEndpoints) {
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
        
        // 分析数据
        analyzeEndpointData(response.data, endpoint);
      } catch (error) {
        console.log(`❌ 端点 ${endpoint} 不可用 (${error.response?.status || error.message})`);
      }
    }
    
  } catch (error) {
    console.error('测试更多端点失败:', error.message);
    throw error;
  }
}

// 分析端点数据的函数
function analyzeEndpointData(data, endpoint) {
  console.log(`\n分析 ${endpoint} 数据:`);
  
  if (!data || !data.data) {
    console.log('数据无效');
    return;
  }
  
  const items = data.data;
  
  if (!Array.isArray(items)) {
    console.log('数据不是数组');
    return;
  }
  
  console.log(`找到 ${items.length} 个项目`);
  
  if (items.length > 0) {
    const firstItem = items[0];
    console.log(`第一个项目 ID: ${firstItem.id}`);
    
    if (firstItem.attributes) {
      console.log('属性:');
      Object.keys(firstItem.attributes).forEach(key => {
        const value = firstItem.attributes[key];
        const type = Array.isArray(value) ? 'array' : typeof value;
        console.log(`- ${key}: ${type} ${value === null ? '(null)' : ''}`);
        
        // 如果是字符串类型，显示值
        if (typeof value === 'string') {
          console.log(`  值: "${value}"`);
        }
      });
    } else {
      console.log('顶级字段:');
      Object.keys(firstItem).forEach(key => {
        if (key !== 'id') {
          const value = firstItem[key];
          const type = Array.isArray(value) ? 'array' : typeof value;
          console.log(`- ${key}: ${type} ${value === null ? '(null)' : ''}`);
          
          // 如果是字符串类型，显示值
          if (typeof value === 'string') {
            console.log(`  值: "${value}"`);
          }
        }
      });
    }
  }
}

// 执行函数
fetchMoreEndpoints()
  .then(() => {
    console.log('\n测试完成');
  })
  .catch(error => {
    console.error('\n测试失败:', error);
  });
