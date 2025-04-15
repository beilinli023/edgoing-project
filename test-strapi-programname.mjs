// 测试 Strapi API 获取 programname 字段的脚本
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
      
      // 搜索所有可能的字段名
      searchForProgramFields(firstBlog);
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

// 搜索所有可能的 program 相关字段
function searchForProgramFields(blog) {
  console.log('\n===== 搜索 program 相关字段 =====');
  
  // 将博客对象转换为字符串
  const blogStr = JSON.stringify(blog);
  
  // 搜索可能的字段名
  const possibleFieldNames = [
    'program_type',
    'programtype',
    'programType',
    'program-type',
    'ProgramType',
    'programname',
    'program_name',
    'programName'
  ];
  
  possibleFieldNames.forEach(fieldName => {
    if (blogStr.includes(fieldName)) {
      console.log(`找到可能的字段名: ${fieldName}`);
    }
  });
  
  // 直接检查顶级字段
  console.log('\n检查顶级字段:');
  Object.keys(blog).forEach(key => {
    if (key.toLowerCase().includes('program')) {
      console.log(`- 找到字段: ${key}`);
    }
  });
  
  // 递归搜索对象中的所有字段
  console.log('\n递归搜索所有字段:');
  const programFields = [];
  searchObjectForProgramFields(blog, '', programFields);
  
  if (programFields.length > 0) {
    console.log('找到以下 program 相关字段:');
    programFields.forEach(field => {
      console.log(`- ${field.path}: ${field.type}`);
    });
  } else {
    console.log('未找到任何 program 相关字段');
  }
  
  console.log('\n===== 搜索完成 =====');
}

// 递归搜索对象中的所有字段
function searchObjectForProgramFields(obj, path, results) {
  if (!obj || typeof obj !== 'object') {
    return;
  }
  
  Object.keys(obj).forEach(key => {
    const newPath = path ? `${path}.${key}` : key;
    
    if (key.toLowerCase().includes('program')) {
      results.push({
        path: newPath,
        type: Array.isArray(obj[key]) ? 'array' : typeof obj[key],
        value: obj[key]
      });
    }
    
    if (obj[key] && typeof obj[key] === 'object') {
      searchObjectForProgramFields(obj[key], newPath, results);
    }
  });
}

// 执行函数
fetchBlogData()
  .then(() => {
    console.log('\n测试完成');
  })
  .catch(error => {
    console.error('\n测试失败:', error);
  });
