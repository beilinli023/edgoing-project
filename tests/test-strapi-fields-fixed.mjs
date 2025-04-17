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
    
    // 获取博客列表，使用 * 填充所有关联字段
    const listUrl = `${strapiConfig.blogPostsEndpoint}?populate=*`;
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
      path.join(outputDir, 'blog-list-all-fields.json'), 
      JSON.stringify(listResponse.data, null, 2)
    );
    console.log(`博客列表数据已保存到 ${path.join(outputDir, 'blog-list-all-fields.json')}`);
    
    // 如果有博客文章，获取第一篇博客的详细信息
    if (blogs.length > 0) {
      const firstBlog = blogs[0];
      console.log(`\n分析第一篇博客 (ID: ${firstBlog.id}):`);
      
      // 保存第一篇博客的详细信息
      fs.writeFileSync(
        path.join(outputDir, 'first-blog-all-fields.json'), 
        JSON.stringify(firstBlog, null, 2)
      );
      console.log(`第一篇博客详细信息已保存到 ${path.join(outputDir, 'first-blog-all-fields.json')}`);
      
      // 列出所有属性
      listAllAttributes(firstBlog);
      
      // 搜索所有可能的字段名
      searchForProgramTypeField(firstBlog);
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

// 列出所有属性的函数
function listAllAttributes(blog) {
  console.log('\n===== 博客所有属性列表 =====');
  
  if (!blog) {
    console.log('博客数据无效');
    return;
  }
  
  console.log('博客 ID:', blog.id);
  console.log('\n属性列表:');
  
  // 列出所有顶级属性
  Object.keys(blog).forEach(key => {
    console.log(`- ${key}`);
  });
  
  console.log('\n===== 列表完成 =====');
}

// 搜索所有可能的 program_type 字段
function searchForProgramTypeField(blog) {
  console.log('\n===== 搜索 program_type 字段 =====');
  
  // 将博客对象转换为字符串
  const blogStr = JSON.stringify(blog);
  
  // 搜索可能的字段名
  const possibleFieldNames = [
    'program_type',
    'programtype',
    'programType',
    'program-type',
    'ProgramType'
  ];
  
  possibleFieldNames.forEach(fieldName => {
    if (blogStr.includes(fieldName)) {
      console.log(`找到可能的字段名: ${fieldName}`);
    }
  });
  
  // 搜索 "program" 和 "type" 关键字
  if (blogStr.includes('program')) {
    console.log('找到关键字 "program"');
  }
  
  if (blogStr.includes('type')) {
    console.log('找到关键字 "type"');
  }
  
  console.log('\n===== 搜索完成 =====');
}

// 执行函数
fetchBlogData()
  .then(() => {
    console.log('\n测试完成');
  })
  .catch(error => {
    console.error('\n测试失败:', error);
  });
