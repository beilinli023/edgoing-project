// 测试 Strapi API 获取博客数据的脚本
import axios from 'axios';
import fs from 'fs';
import path from 'path';

// Strapi API 配置
const strapiConfig = {
  apiUrl: 'http://localhost:1337',
  apiToken: '', // 如果有令牌，请在这里填写
  blogPostsEndpoint: '/api/blogposts'
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

// 获取博客数据的函数
async function fetchBlogData() {
  try {
    console.log('正在获取 Strapi 博客数据...');
    
    // 获取博客列表
    const listUrl = `${strapiConfig.blogPostsEndpoint}?populate=*`;
    console.log(`请求博客列表 URL: ${listUrl}`);
    const listResponse = await strapiAxios.get(listUrl);
    
    if (!listResponse.data || !listResponse.data.data) {
      throw new Error('Strapi API 返回无效数据');
    }
    
    const blogs = listResponse.data.data;
    console.log(`成功获取 ${blogs.length} 篇博客文章`);
    
    // 创建输出目录
    const outputDir = './strapi-test';
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // 保存博客列表数据
    fs.writeFileSync(
      path.join(outputDir, 'blog-list.json'), 
      JSON.stringify(listResponse.data, null, 2)
    );
    console.log(`博客列表数据已保存到 ${path.join(outputDir, 'blog-list.json')}`);
    
    // 如果有博客文章，获取第一篇博客的详细信息
    if (blogs.length > 0) {
      const firstBlog = blogs[0];
      console.log(`\n分析第一篇博客 (ID: ${firstBlog.id}):`);
      
      // 保存第一篇博客的详细信息
      fs.writeFileSync(
        path.join(outputDir, 'first-blog.json'), 
        JSON.stringify(firstBlog, null, 2)
      );
      console.log(`第一篇博客详细信息已保存到 ${path.join(outputDir, 'first-blog.json')}`);
      
      // 分析博客结构
      analyzeBlogStructure(firstBlog);
    }
    
    return listResponse.data;
  } catch (error) {
    console.error('获取 Strapi 博客数据失败:', error.message);
    if (error.response) {
      console.error('响应状态:', error.response.status);
      console.error('响应数据:', JSON.stringify(error.response.data, null, 2));
    }
    throw error;
  }
}

// 分析博客结构的函数
function analyzeBlogStructure(blog) {
  console.log('\n===== 博客结构分析 =====');
  
  if (!blog) {
    console.log('博客数据无效');
    return;
  }
  
  console.log('博客 ID:', blog.id);
  
  // 分析属性
  console.log('\n博客属性:');
  
  // 列出所有顶级属性
  Object.keys(blog).forEach(key => {
    if (key === 'attributes') {
      console.log(`- ${key}: 对象 (包含博客主要数据)`);
      analyzeAttributes(blog.attributes);
    } else {
      const value = blog[key];
      const type = Array.isArray(value) ? 'array' : typeof value;
      console.log(`- ${key}: ${type}`);
    }
  });
  
  console.log('\n===== 分析完成 =====');
}

// 分析博客属性的函数
function analyzeAttributes(attributes) {
  if (!attributes) {
    console.log('  属性数据无效');
    return;
  }
  
  console.log('  属性列表:');
  
  Object.keys(attributes).forEach(key => {
    const value = attributes[key];
    const type = Array.isArray(value) ? 'array' : typeof value;
    
    if (key === 'content') {
      if (Array.isArray(value)) {
        console.log(`  - ${key}: 内容块数组 (${value.length} 个块)`);
        analyzeContentBlocks(value);
      } else if (typeof value === 'object' && value !== null) {
        console.log(`  - ${key}: 内容对象`);
      } else {
        console.log(`  - ${key}: ${type}`);
      }
    } else if (type === 'object' && value !== null) {
      if (value.data) {
        // 关联字段
        if (Array.isArray(value.data)) {
          console.log(`  - ${key}: 关联字段 (数组, 包含 ${value.data.length} 项)`);
        } else if (value.data === null) {
          console.log(`  - ${key}: 关联字段 (空)`);
        } else {
          console.log(`  - ${key}: 关联字段 (单个项目)`);
        }
      } else {
        console.log(`  - ${key}: 对象`);
      }
    } else {
      console.log(`  - ${key}: ${type} ${value === null ? '(null)' : ''}`);
    }
  });
}

// 分析内容块的函数
function analyzeContentBlocks(blocks) {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    console.log('    没有内容块');
    return;
  }
  
  // 统计不同类型的块
  const blockTypes = {};
  blocks.forEach(block => {
    if (block.type) {
      blockTypes[block.type] = (blockTypes[block.type] || 0) + 1;
    }
  });
  
  console.log('    内容块类型统计:');
  Object.keys(blockTypes).forEach(type => {
    console.log(`    - ${type}: ${blockTypes[type]} 个`);
  });
  
  // 分析第一个块的详细结构
  if (blocks.length > 0) {
    const firstBlock = blocks[0];
    console.log('\n    第一个内容块详细分析:');
    console.log(`    - 类型: ${firstBlock.type}`);
    
    // 分析块的属性
    Object.keys(firstBlock).forEach(key => {
      if (key !== 'type') {
        const value = firstBlock[key];
        const valueType = Array.isArray(value) ? 'array' : typeof value;
        
        if (key === 'children' && Array.isArray(value)) {
          console.log(`    - ${key}: 子元素数组 (${value.length} 个)`);
          
          // 分析第一个子元素
          if (value.length > 0) {
            const firstChild = value[0];
            console.log('      第一个子元素:');
            Object.keys(firstChild).forEach(childKey => {
              const childValue = firstChild[childKey];
              const childType = Array.isArray(childValue) ? 'array' : typeof childValue;
              console.log(`      - ${childKey}: ${childType}`);
            });
          }
        } else {
          console.log(`    - ${key}: ${valueType}`);
        }
      }
    });
  }
  
  // 保存内容块结构到文件
  const outputDir = './strapi-test';
  fs.writeFileSync(
    path.join(outputDir, 'content-blocks.json'), 
    JSON.stringify(blocks, null, 2)
  );
  console.log(`\n内容块结构已保存到 ${path.join(outputDir, 'content-blocks.json')}`);
}

// 执行函数
fetchBlogData()
  .then(() => {
    console.log('\n测试完成');
  })
  .catch(error => {
    console.error('\n测试失败:', error);
  });
