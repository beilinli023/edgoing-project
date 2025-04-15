// 测试 Strapi API 获取所有字段的脚本
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
    
    // 获取博客列表，确保获取所有关联字段
    const listUrl = `${strapiConfig.blogPostsEndpoint}?populate=deep`;
    console.log(`请求博客列表 URL: ${listUrl}`);
    const listResponse = await strapiAxios.get(listUrl);
    
    if (!listResponse.data || !listResponse.data.data) {
      throw new Error('Strapi API 返回无效数据');
    }
    
    const blogs = listResponse.data.data;
    console.log(`成功获取 ${blogs.length} 篇博客文章`);
    
    // 创建输出目录
    const outputDir = './strapi-fields';
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // 保存博客列表数据
    fs.writeFileSync(
      path.join(outputDir, 'blog-list-full.json'), 
      JSON.stringify(listResponse.data, null, 2)
    );
    console.log(`博客列表数据已保存到 ${path.join(outputDir, 'blog-list-full.json')}`);
    
    // 如果有博客文章，获取第一篇博客的详细信息
    if (blogs.length > 0) {
      const firstBlog = blogs[0];
      console.log(`\n分析第一篇博客 (ID: ${firstBlog.id}):`);
      
      // 保存第一篇博客的详细信息
      fs.writeFileSync(
        path.join(outputDir, 'first-blog-full.json'), 
        JSON.stringify(firstBlog, null, 2)
      );
      console.log(`第一篇博客详细信息已保存到 ${path.join(outputDir, 'first-blog-full.json')}`);
      
      // 分析博客字段
      analyzeAllFields(firstBlog);
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

// 分析所有字段的函数
function analyzeAllFields(blog) {
  console.log('\n===== 博客所有字段分析 =====');
  
  if (!blog) {
    console.log('博客数据无效');
    return;
  }
  
  console.log('博客 ID:', blog.id);
  
  // 分析顶级字段
  console.log('\n顶级字段:');
  Object.keys(blog).forEach(key => {
    const value = blog[key];
    const type = Array.isArray(value) ? 'array' : typeof value;
    console.log(`- ${key}: ${type}`);
  });
  
  // 分析属性字段
  if (blog.attributes) {
    console.log('\n属性字段:');
    Object.keys(blog.attributes).forEach(key => {
      const value = blog.attributes[key];
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
            // 检查关联字段的类型
            if (value.data.attributes) {
              console.log(`  类型: ${value.data.attributes.gradename ? 'grade' : (value.data.attributes.name ? 'programtype' : '未知')}`);
            }
          }
        } else {
          console.log(`- ${key}: 对象`);
        }
      } else {
        console.log(`- ${key}: ${type} ${value === null ? '(null)' : ''}`);
      }
    });
  }
  
  // 特别检查 program_type 字段
  if (blog.attributes && blog.attributes.program_type) {
    console.log('\n特别检查 program_type 字段:');
    const programType = blog.attributes.program_type;
    console.log(`- 类型: ${Array.isArray(programType) ? 'array' : typeof programType}`);
    
    if (typeof programType === 'object' && programType !== null) {
      if (programType.data) {
        console.log(`- data 类型: ${Array.isArray(programType.data) ? 'array' : typeof programType.data}`);
        
        if (programType.data && programType.data.attributes) {
          console.log('- 属性:');
          Object.keys(programType.data.attributes).forEach(key => {
            const value = programType.data.attributes[key];
            const type = Array.isArray(value) ? 'array' : typeof value;
            console.log(`  - ${key}: ${type} ${value === null ? '(null)' : (typeof value === 'string' ? `= "${value}"` : '')}`);
          });
        }
      }
    }
  }
  
  console.log('\n===== 分析完成 =====');
}

// 执行函数
fetchBlogData()
  .then(() => {
    console.log('\n测试完成');
  })
  .catch(error => {
    console.error('\n测试失败:', error);
  });
