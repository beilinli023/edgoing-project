// 测试 Strapi API 中的 programtype 字段
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
const outputDir = './strapi-programtype';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 测试 programtype 内容类型
async function testProgramType() {
  try {
    console.log('\n===== 测试 programtype 内容类型 =====');
    
    // 1. 获取 programtype 列表
    console.log('获取 programtype 列表...');
    const programtypesUrl = '/api/programtypes';
    
    try {
      const response = await strapiAxios.get(programtypesUrl);
      console.log(`✅ 成功获取 programtype 列表，找到 ${response.data.data.length} 个项目`);
      
      // 保存响应数据
      fs.writeFileSync(
        path.join(outputDir, 'programtypes.json'), 
        JSON.stringify(response.data, null, 2)
      );
      console.log(`响应数据已保存到 ${path.join(outputDir, 'programtypes.json')}`);
      
      // 分析 programtype 结构
      analyzeProgramTypes(response.data);
    } catch (error) {
      console.log(`❌ 获取 programtype 列表失败: ${error.message}`);
      if (error.response) {
        console.log(`状态码: ${error.response.status}`);
      }
    }
    
    console.log('\n===== programtype 测试完成 =====');
  } catch (error) {
    console.error('测试 programtype 失败:', error.message);
  }
}

// 测试博客文章与 programtype 的关联
async function testBlogPostProgramType() {
  try {
    console.log('\n===== 测试博客文章与 programtype 的关联 =====');
    
    // 1. 获取博客文章列表，并填充 programtype 字段
    console.log('获取博客文章列表，并填充 programtype 字段...');
    const blogpostsUrl = '/api/blogposts?populate=programtype';
    
    try {
      const response = await strapiAxios.get(blogpostsUrl);
      console.log(`✅ 成功获取博客文章列表，找到 ${response.data.data.length} 篇文章`);
      
      // 保存响应数据
      fs.writeFileSync(
        path.join(outputDir, 'blogposts-with-programtype.json'), 
        JSON.stringify(response.data, null, 2)
      );
      console.log(`响应数据已保存到 ${path.join(outputDir, 'blogposts-with-programtype.json')}`);
      
      // 分析博客文章与 programtype 的关联
      analyzeBlogPostProgramType(response.data);
    } catch (error) {
      console.log(`❌ 获取博客文章列表失败: ${error.message}`);
      if (error.response) {
        console.log(`状态码: ${error.response.status}`);
      }
    }
    
    console.log('\n===== 博客文章与 programtype 关联测试完成 =====');
  } catch (error) {
    console.error('测试博客文章与 programtype 的关联失败:', error.message);
  }
}

// 分析 programtype 结构
function analyzeProgramTypes(data) {
  if (!data || !data.data || !Array.isArray(data.data) || data.data.length === 0) {
    console.log('没有 programtype 数据可分析');
    return;
  }
  
  console.log('\n分析 programtype 结构:');
  
  const programTypes = data.data;
  console.log(`共有 ${programTypes.length} 个 programtype 项目`);
  
  // 分析第一个 programtype 项目
  const firstProgramType = programTypes[0];
  console.log(`\n第一个 programtype (ID: ${firstProgramType.id}):`);
  
  if (firstProgramType.attributes) {
    console.log('属性:');
    Object.keys(firstProgramType.attributes).forEach(key => {
      const value = firstProgramType.attributes[key];
      const type = Array.isArray(value) ? 'array' : typeof value;
      console.log(`- ${key}: ${type} ${value === null ? '(null)' : ''}`);
      
      // 如果是字符串类型，显示值
      if (typeof value === 'string') {
        console.log(`  值: "${value}"`);
      }
    });
  }
}

// 分析博客文章与 programtype 的关联
function analyzeBlogPostProgramType(data) {
  if (!data || !data.data || !Array.isArray(data.data) || data.data.length === 0) {
    console.log('没有博客文章数据可分析');
    return;
  }
  
  console.log('\n分析博客文章与 programtype 的关联:');
  
  const blogPosts = data.data;
  console.log(`共有 ${blogPosts.length} 篇博客文章`);
  
  // 统计有 programtype 关联的博客文章数量
  let postsWithProgramType = 0;
  
  blogPosts.forEach((post, index) => {
    if (post.attributes && post.attributes.programtype && post.attributes.programtype.data) {
      postsWithProgramType++;
    }
  });
  
  console.log(`有 programtype 关联的博客文章数量: ${postsWithProgramType}`);
  
  // 分析第一篇博客文章的 programtype 关联
  if (blogPosts.length > 0) {
    const firstPost = blogPosts[0];
    console.log(`\n第一篇博客文章 (ID: ${firstPost.id}):"`);
    
    if (firstPost.attributes && firstPost.attributes.programtype) {
      console.log('programtype 关联:');
      const programtype = firstPost.attributes.programtype;
      
      if (programtype.data) {
        console.log(`- data 类型: ${Array.isArray(programtype.data) ? 'array' : typeof programtype.data}`);
        
        if (programtype.data === null) {
          console.log('- 没有关联的 programtype');
        } else if (typeof programtype.data === 'object') {
          console.log(`- 关联的 programtype ID: ${programtype.data.id}`);
          
          if (programtype.data.attributes) {
            console.log('- programtype 属性:');
            Object.keys(programtype.data.attributes).forEach(key => {
              const value = programtype.data.attributes[key];
              const type = Array.isArray(value) ? 'array' : typeof value;
              console.log(`  - ${key}: ${type} ${value === null ? '(null)' : ''}`);
              
              // 如果是字符串类型，显示值
              if (typeof value === 'string') {
                console.log(`    值: "${value}"`);
              }
            });
          }
        }
      } else {
        console.log('- 没有 data 字段');
      }
    } else {
      console.log('- 没有 programtype 字段');
    }
  }
}

// 主函数
async function main() {
  try {
    // 测试 programtype 内容类型
    await testProgramType();
    
    // 测试博客文章与 programtype 的关联
    await testBlogPostProgramType();
    
    console.log('\n所有测试完成');
  } catch (error) {
    console.error('测试失败:', error.message);
  }
}

// 执行主函数
main();
