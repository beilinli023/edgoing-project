// 测试 Strapi API 获取博客数据和块结构的脚本
import axios from 'axios';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';

// 加载环境变量
dotenv.config();

// Strapi API 配置
const strapiConfig = {
  apiUrl: process.env.STRAPI_API_URL || 'http://localhost:1337',
  apiToken: process.env.STRAPI_API_TOKEN || '',
  blogPostsEndpoint: '/api/blogposts'
};

console.log(`Strapi API URL: ${strapiConfig.apiUrl}`);
console.log(`API Token 配置: ${strapiConfig.apiToken ? '已配置' : '未配置'}`);

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
    
    // 1. 获取基本数据结构
    console.log('获取基本数据结构...');
    const basicUrl = `${strapiConfig.blogPostsEndpoint}?pagination[limit]=1`;
    console.log(`请求 URL: ${basicUrl}`);
    const basicResponse = await strapiAxios.get(basicUrl);
    console.log('基本数据结构获取成功');
    
    // 2. 获取完整字段数据
    console.log('获取完整字段数据...');
    const fullUrl = `${strapiConfig.blogPostsEndpoint}?populate=*&pagination[limit]=1`;
    console.log(`请求 URL: ${fullUrl}`);
    const fullResponse = await strapiAxios.get(fullUrl);
    console.log('完整字段数据获取成功');
    
    // 3. 获取所有博客数据
    console.log('获取所有博客数据...');
    const allBlogsUrl = `${strapiConfig.blogPostsEndpoint}?populate=*&pagination[limit]=100`;
    console.log(`请求 URL: ${allBlogsUrl}`);
    const allBlogsResponse = await strapiAxios.get(allBlogsUrl);
    const blogCount = allBlogsResponse.data.data ? allBlogsResponse.data.data.length : 0;
    console.log(`成功获取 ${blogCount} 篇博客文章`);
    
    // 创建输出目录
    const outputDir = './strapi-data';
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }
    
    // 保存数据到文件
    fs.writeFileSync(path.join(outputDir, 'strapi-blog-basic.json'), JSON.stringify(basicResponse.data, null, 2));
    fs.writeFileSync(path.join(outputDir, 'strapi-blog-full.json'), JSON.stringify(fullResponse.data, null, 2));
    fs.writeFileSync(path.join(outputDir, 'strapi-blogs-all.json'), JSON.stringify(allBlogsResponse.data, null, 2));
    
    console.log('数据已保存到文件:');
    console.log(`- ${path.join(outputDir, 'strapi-blog-basic.json')} (基本数据结构)`);
    console.log(`- ${path.join(outputDir, 'strapi-blog-full.json')} (完整字段数据)`);
    console.log(`- ${path.join(outputDir, 'strapi-blogs-all.json')} (所有博客数据)`);
    
    // 分析数据结构
    if (fullResponse.data && fullResponse.data.data && fullResponse.data.data.length > 0) {
      analyzeDataStructure(fullResponse.data);
      analyzeContentBlocks(fullResponse.data);
    } else {
      console.log('没有可分析的数据');
    }
    
    return {
      basic: basicResponse.data,
      full: fullResponse.data,
      all: allBlogsResponse.data
    };
  } catch (error) {
    console.error('获取 Strapi 博客数据失败:', error.message);
    if (error.response) {
      console.error('响应状态:', error.response.status);
      console.error('响应数据:', JSON.stringify(error.response.data, null, 2));
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
  const attributes = blog.attributes || {};
  Object.keys(attributes).forEach(key => {
    const value = attributes[key];
    const type = Array.isArray(value) ? 'array' : typeof value;
    
    if (type === 'object' && value !== null) {
      if (value.data) {
        // 关联字段
        if (Array.isArray(value.data)) {
          console.log(`- ${key}: 关联字段 (数组, 包含 ${value.data.length} 项)`);
        } else if (value.data === null) {
          console.log(`- ${key}: 关联字段 (空)`);
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

// 分析内容块结构的函数
function analyzeContentBlocks(data) {
  console.log('\n===== 内容块结构分析 =====');
  
  if (!data || !data.data || !Array.isArray(data.data) || data.data.length === 0) {
    console.log('没有可分析的数据');
    return;
  }
  
  const blog = data.data[0];
  const content = blog.attributes?.content;
  
  if (!content || !Array.isArray(content)) {
    console.log('没有内容块数据或内容块不是数组');
    return;
  }
  
  console.log(`博客 ID ${blog.id} 包含 ${content.length} 个内容块`);
  
  // 分析每个内容块
  content.forEach((block, index) => {
    console.log(`\n内容块 #${index + 1}:`);
    console.log(`- 类型: ${block.type}`);
    
    // 分析块的子元素
    if (block.children && Array.isArray(block.children)) {
      console.log(`- 子元素: ${block.children.length} 个`);
      
      // 分析第一个子元素的结构
      if (block.children.length > 0) {
        const firstChild = block.children[0];
        console.log(`  - 第一个子元素类型: ${firstChild.type}`);
        
        // 列出子元素的所有属性
        Object.keys(firstChild).forEach(key => {
          if (key !== 'type') {
            const value = firstChild[key];
            const valueType = Array.isArray(value) ? 'array' : typeof value;
            console.log(`  - ${key}: ${valueType}`);
          }
        });
      }
    }
    
    // 列出块的其他属性
    Object.keys(block).forEach(key => {
      if (key !== 'type' && key !== 'children') {
        const value = block[key];
        const valueType = Array.isArray(value) ? 'array' : typeof value;
        console.log(`- ${key}: ${valueType}`);
      }
    });
  });
  
  // 保存内容块结构到文件
  const outputDir = './strapi-data';
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }
  
  fs.writeFileSync(
    path.join(outputDir, 'content-blocks-structure.json'), 
    JSON.stringify(content, null, 2)
  );
  
  console.log(`\n内容块结构已保存到 ${path.join(outputDir, 'content-blocks-structure.json')}`);
  console.log('\n===== 内容块分析完成 =====');
}

// 执行函数
fetchBlogData()
  .then(() => {
    console.log('测试完成');
  })
  .catch(error => {
    console.error('测试失败:', error);
  });
