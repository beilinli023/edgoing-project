// 测试 Strapi API 获取博客数据的脚本
import axios from 'axios';
import fs from 'fs';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

// Strapi API 配置
const strapiConfig = {
  apiUrl: process.env.STRAPI_API_URL || 'http://localhost:1337',
  apiToken: process.env.STRAPI_API_TOKEN || '',
  blogPostsEndpoint: '/api/blogposts'
};

// 创建 axios 实例
const strapiAxios = axios.create({
  baseURL: strapiConfig.apiUrl,
  headers: {
    'Content-Type': 'application/json',
    ...(strapiConfig.apiToken ? { 'Authorization': `Bearer ${strapiConfig.apiToken}` } : {})
  }
});

// 获取博客数据的函数
async function fetchBlogData() {
  try {
    console.log('正在获取 Strapi 博客数据...');
    console.log(`Strapi API URL: ${strapiConfig.apiUrl}`);
    
    // 1. 获取基本数据结构
    const basicResponse = await strapiAxios.get(`${strapiConfig.blogPostsEndpoint}?pagination[limit]=1`);
    console.log('基本数据结构获取成功');
    
    // 2. 获取完整字段数据
    const fullResponse = await strapiAxios.get(`${strapiConfig.blogPostsEndpoint}?populate=*&pagination[limit]=1`);
    console.log('完整字段数据获取成功');
    
    // 3. 获取所有博客数据
    const allBlogsResponse = await strapiAxios.get(`${strapiConfig.blogPostsEndpoint}?populate=*&pagination[limit]=100`);
    console.log(`成功获取 ${allBlogsResponse.data.data.length} 篇博客文章`);
    
    // 保存数据到文件
    fs.writeFileSync('./strapi-blog-basic.json', JSON.stringify(basicResponse.data, null, 2));
    fs.writeFileSync('./strapi-blog-full.json', JSON.stringify(fullResponse.data, null, 2));
    fs.writeFileSync('./strapi-blogs-all.json', JSON.stringify(allBlogsResponse.data, null, 2));
    
    console.log('数据已保存到文件:');
    console.log('- strapi-blog-basic.json (基本数据结构)');
    console.log('- strapi-blog-full.json (完整字段数据)');
    console.log('- strapi-blogs-all.json (所有博客数据)');
    
    // 分析数据结构
    analyzeDataStructure(fullResponse.data);
    
    return {
      basic: basicResponse.data,
      full: fullResponse.data,
      all: allBlogsResponse.data
    };
  } catch (error) {
    console.error('获取 Strapi 博客数据失败:', error.message);
    if (error.response) {
      console.error('响应状态:', error.response.status);
      console.error('响应数据:', error.response.data);
    }
    throw error;
  }
}

// 分析数据结构的函数
function analyzeDataStructure(data) {
  console.log('\n===== 博客数据结构分析 =====');
  
  if (!data || !data.data || !Array.isArray(data.data) || data.data.length === 0) {
    console.log('没有可分析的数据');
    return;
  }
  
  const blog = data.data[0];
  console.log('博客 ID:', blog.id);
  
  // 分析属性
  console.log('\n博客属性:');
  const attributes = blog.attributes;
  Object.keys(attributes).forEach(key => {
    const value = attributes[key];
    const type = Array.isArray(value) ? 'array' : typeof value;
    
    if (type === 'object' && value !== null) {
      if (value.data) {
        // 关联字段
        if (Array.isArray(value.data)) {
          console.log(`- ${key}: 关联字段 (数组, 包含 ${value.data.length} 项)`);
        } else {
          console.log(`- ${key}: 关联字段 (单个项目)`);
        }
      } else {
        console.log(`- ${key}: 对象`);
      }
    } else {
      console.log(`- ${key}: ${type}`);
    }
  });
  
  // 分析元数据
  console.log('\n元数据:');
  if (data.meta) {
    Object.keys(data.meta).forEach(key => {
      console.log(`- ${key}: ${typeof data.meta[key]}`);
    });
  } else {
    console.log('没有元数据');
  }
  
  console.log('\n===== 分析完成 =====');
}

// 执行函数
fetchBlogData()
  .then(() => {
    console.log('测试完成');
  })
  .catch(error => {
    console.error('测试失败:', error);
  });
