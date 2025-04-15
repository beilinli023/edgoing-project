// 测试 Strapi API 中的 programtype 字段（修复版）
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
const outputDir = './strapi-programtype-fixed';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 分析 programtype 字段
async function analyzeProgramTypeField() {
  try {
    console.log('\n===== 分析 programtype 字段 =====');
    
    // 获取博客文章列表，并填充所有字段
    console.log('获取博客文章列表，并填充所有字段...');
    const blogpostsUrl = '/api/blogposts?populate=*';
    
    try {
      const response = await strapiAxios.get(blogpostsUrl);
      console.log(`✅ 成功获取博客文章列表，找到 ${response.data.data.length} 篇文章`);
      
      // 保存响应数据
      fs.writeFileSync(
        path.join(outputDir, 'blogposts-all-fields.json'), 
        JSON.stringify(response.data, null, 2)
      );
      console.log(`响应数据已保存到 ${path.join(outputDir, 'blogposts-all-fields.json')}`);
      
      // 分析 programtype 字段
      const blogPosts = response.data.data;
      
      if (blogPosts.length > 0) {
        const firstPost = blogPosts[0];
        
        // 检查是否有 programtype 字段
        if (firstPost.programtype) {
          console.log('\n找到 programtype 字段:');
          console.log(JSON.stringify(firstPost.programtype, null, 2));
          
          // 保存 programtype 字段
          fs.writeFileSync(
            path.join(outputDir, 'programtype-field.json'), 
            JSON.stringify(firstPost.programtype, null, 2)
          );
          console.log(`programtype 字段已保存到 ${path.join(outputDir, 'programtype-field.json')}`);
          
          // 分析 programtype 字段结构
          console.log('\nprogramtype 字段结构:');
          console.log(`- ID: ${firstPost.programtype.id}`);
          console.log(`- documentId: ${firstPost.programtype.documentId}`);
          console.log(`- programname: ${firstPost.programtype.programname}`);
          console.log(`- locale: ${firstPost.programtype.locale}`);
        } else {
          console.log('\n未找到 programtype 字段，尝试搜索整个对象...');
          
          // 将对象转换为字符串并搜索
          const postStr = JSON.stringify(firstPost);
          
          if (postStr.includes('programtype')) {
            console.log('在对象中找到 "programtype" 字符串');
            
            // 尝试找出 programtype 的确切位置
            const lines = postStr.split('\n');
            const programtypeLines = lines.filter(line => line.includes('programtype'));
            
            console.log('包含 programtype 的行:');
            programtypeLines.forEach(line => {
              console.log(line);
            });
          } else {
            console.log('在整个对象中未找到 "programtype" 字符串');
          }
        }
      }
    } catch (error) {
      console.log(`❌ 获取博客文章列表失败: ${error.message}`);
      if (error.response) {
        console.log(`状态码: ${error.response.status}`);
      }
    }
    
    console.log('\n===== 分析完成 =====');
  } catch (error) {
    console.error('分析 programtype 字段失败:', error.message);
  }
}

// 执行函数
analyzeProgramTypeField()
  .then(() => {
    console.log('\n测试完成');
  })
  .catch(error => {
    console.error('\n测试失败:', error);
  });
