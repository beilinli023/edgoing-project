// 测试 Strapi API 中英文版本的 programtype 字段
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
const outputDir = './strapi-en-programtype';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 获取英文版本的博客文章
async function getEnglishBlogPosts() {
  try {
    console.log('\n===== 获取英文版本的博客文章 =====');
    
    // 获取英文版本的博客文章列表
    console.log('获取英文版本的博客文章列表...');
    const blogpostsUrl = '/api/blogposts?populate=*&locale=en';
    
    try {
      const response = await strapiAxios.get(blogpostsUrl);
      console.log(`✅ 成功获取英文版本的博客文章列表，找到 ${response.data.data.length} 篇文章`);
      
      // 保存响应数据
      fs.writeFileSync(
        path.join(outputDir, 'en-blogposts.json'), 
        JSON.stringify(response.data, null, 2)
      );
      console.log(`响应数据已保存到 ${path.join(outputDir, 'en-blogposts.json')}`);
      
      // 分析英文版本的博客文章
      const blogPosts = response.data.data;
      
      if (blogPosts.length > 0) {
        const firstPost = blogPosts[0];
        
        // 检查是否有 programtype 字段
        if (firstPost.programtype) {
          console.log('\n找到英文版本的 programtype 字段:');
          console.log(JSON.stringify(firstPost.programtype, null, 2));
          
          // 保存 programtype 字段
          fs.writeFileSync(
            path.join(outputDir, 'en-programtype.json'), 
            JSON.stringify(firstPost.programtype, null, 2)
          );
          console.log(`英文版本的 programtype 字段已保存到 ${path.join(outputDir, 'en-programtype.json')}`);
        } else {
          console.log('\n未找到英文版本的 programtype 字段');
        }
      }
    } catch (error) {
      console.log(`❌ 获取英文版本的博客文章列表失败: ${error.message}`);
      if (error.response) {
        console.log(`状态码: ${error.response.status}`);
      }
    }
    
    // 获取 programtypes 内容类型的英文版本
    console.log('\n获取 programtypes 内容类型的英文版本...');
    const programtypesUrl = '/api/programtypes?locale=en';
    
    try {
      const response = await strapiAxios.get(programtypesUrl);
      console.log(`✅ 成功获取 programtypes 内容类型的英文版本，找到 ${response.data.data.length} 个项目`);
      
      // 保存响应数据
      fs.writeFileSync(
        path.join(outputDir, 'en-programtypes.json'), 
        JSON.stringify(response.data, null, 2)
      );
      console.log(`响应数据已保存到 ${path.join(outputDir, 'en-programtypes.json')}`);
      
      // 分析 programtypes 内容类型的英文版本
      const programTypes = response.data.data;
      
      if (programTypes.length > 0) {
        console.log('\nprogramtypes 内容类型的英文版本:');
        
        programTypes.forEach((programType, index) => {
          console.log(`\n项目 #${index + 1} (ID: ${programType.id}):`);
          
          if (programType.attributes) {
            Object.keys(programType.attributes).forEach(key => {
              const value = programType.attributes[key];
              const type = Array.isArray(value) ? 'array' : typeof value;
              console.log(`- ${key}: ${type} ${value === null ? '(null)' : ''}`);
              
              // 如果是字符串类型，显示值
              if (typeof value === 'string') {
                console.log(`  值: "${value}"`);
              }
            });
          }
        });
      }
    } catch (error) {
      console.log(`❌ 获取 programtypes 内容类型的英文版本失败: ${error.message}`);
      if (error.response) {
        console.log(`状态码: ${error.response.status}`);
      }
    }
    
    console.log('\n===== 获取完成 =====');
  } catch (error) {
    console.error('获取英文版本的博客文章失败:', error.message);
  }
}

// 执行函数
getEnglishBlogPosts()
  .then(() => {
    console.log('\n测试完成');
  })
  .catch(error => {
    console.error('\n测试失败:', error);
  });
