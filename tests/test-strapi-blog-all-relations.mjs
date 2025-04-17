// 测试 Strapi API 中博客文章的所有关联字段
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

// 创建输出目录
const outputDir = './strapi-blog-relations';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 测试博客文章的所有关联字段
async function testBlogPostAllRelations() {
  try {
    console.log('\n===== 测试博客文章的所有关联字段 =====');
    
    // 1. 获取博客文章列表，并填充所有字段
    console.log('获取博客文章列表，并填充所有字段...');
    const blogpostsUrl = '/api/blogposts?populate=*';
    
    try {
      const response = await strapiAxios.get(blogpostsUrl);
      console.log(`✅ 成功获取博客文章列表，找到 ${response.data.data.length} 篇文章`);
      
      // 保存响应数据
      fs.writeFileSync(
        path.join(outputDir, 'blogposts-all-relations.json'), 
        JSON.stringify(response.data, null, 2)
      );
      console.log(`响应数据已保存到 ${path.join(outputDir, 'blogposts-all-relations.json')}`);
      
      // 分析博客文章的所有关联字段
      analyzeBlogPostRelations(response.data);
    } catch (error) {
      console.log(`❌ 获取博客文章列表失败: ${error.message}`);
      if (error.response) {
        console.log(`状态码: ${error.response.status}`);
      }
    }
    
    console.log('\n===== 博客文章关联字段测试完成 =====');
  } catch (error) {
    console.error('测试博客文章关联字段失败:', error.message);
  }
}

// 分析博客文章的所有关联字段
function analyzeBlogPostRelations(data) {
  if (!data || !data.data || !Array.isArray(data.data) || data.data.length === 0) {
    console.log('没有博客文章数据可分析');
    return;
  }
  
  console.log('\n分析博客文章的所有关联字段:');
  
  const blogPosts = data.data;
  console.log(`共有 ${blogPosts.length} 篇博客文章`);
  
  // 分析第一篇博客文章的所有字段
  if (blogPosts.length > 0) {
    const firstPost = blogPosts[0];
    console.log(`\n第一篇博客文章 (ID: ${firstPost.id}):`);
    
    if (firstPost.attributes) {
      console.log('所有属性:');
      Object.keys(firstPost.attributes).forEach(key => {
        const value = firstPost.attributes[key];
        const type = Array.isArray(value) ? 'array' : typeof value;
        
        if (type === 'object' && value !== null) {
          if (value.data) {
            // 关联字段
            if (Array.isArray(value.data)) {
              console.log(`- ${key}: 关联字段 (数组, 包含 ${value.data.length} 项)`);
              
              // 分析第一个关联项
              if (value.data.length > 0) {
                const firstItem = value.data[0];
                console.log(`  第一个关联项 (ID: ${firstItem.id}):`);
                
                if (firstItem.attributes) {
                  Object.keys(firstItem.attributes).forEach(attrKey => {
                    const attrValue = firstItem.attributes[attrKey];
                    const attrType = Array.isArray(attrValue) ? 'array' : typeof attrValue;
                    console.log(`  - ${attrKey}: ${attrType} ${attrValue === null ? '(null)' : ''}`);
                    
                    // 如果是字符串类型，显示值
                    if (typeof attrValue === 'string') {
                      console.log(`    值: "${attrValue}"`);
                    }
                  });
                }
              }
            } else if (value.data === null) {
              console.log(`- ${key}: 关联字段 (空)`);
            } else {
              console.log(`- ${key}: 关联字段 (单个项目)`);
              
              // 分析关联项
              const item = value.data;
              console.log(`  关联项 (ID: ${item.id}):`);
              
              if (item.attributes) {
                Object.keys(item.attributes).forEach(attrKey => {
                  const attrValue = item.attributes[attrKey];
                  const attrType = Array.isArray(attrValue) ? 'array' : typeof attrValue;
                  console.log(`  - ${attrKey}: ${attrType} ${attrValue === null ? '(null)' : ''}`);
                  
                  // 如果是字符串类型，显示值
                  if (typeof attrValue === 'string') {
                    console.log(`    值: "${attrValue}"`);
                  }
                });
              }
            }
          } else {
            console.log(`- ${key}: 对象`);
          }
        } else {
          console.log(`- ${key}: ${type} ${value === null ? '(null)' : ''}`);
          
          // 如果是字符串类型，显示值
          if (typeof value === 'string') {
            console.log(`  值: "${value}"`);
          }
        }
      });
      
      // 特别检查是否有 programtype 或类似字段
      const programFields = Object.keys(firstPost.attributes).filter(key => 
        key.toLowerCase().includes('program')
      );
      
      if (programFields.length > 0) {
        console.log('\n找到与 program 相关的字段:');
        programFields.forEach(field => {
          console.log(`- ${field}`);
        });
      } else {
        console.log('\n未找到与 program 相关的字段');
      }
    } else {
      console.log('没有 attributes 字段');
    }
  }
}

// 执行函数
testBlogPostAllRelations()
  .then(() => {
    console.log('\n测试完成');
  })
  .catch(error => {
    console.error('\n测试失败:', error);
  });
