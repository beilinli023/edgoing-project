import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置信息
const API_URL = 'http://localhost:1337/api/blogposts';
const TOKEN = 'e77c838734f282ef9ec37e96ff440410bcf2845041241bca086a1994d59664e8111f40cb67f0ffe12546c3cdc414c3271d8ba9b1f6d24b1d8101dc60b5b20012bea92abd55943c20cec2f1341983f220094e1ec90d013ff0b0f30fd9e3b917077ec6f014591c54d24a854c75f46d0da5fd7a43ac07cfb7f9ae2a55ea04188f3d';

// 辅助函数: 将普通文本转换为Strapi富文本格式
function convertToRichText(text) {
  // 处理换行符
  const normalizedText = text.replace(/\\n\\n/g, '\n\n').replace(/\\n/g, '\n');
  const paragraphs = normalizedText.split(/\n\n/);
  
  return paragraphs
    .filter(p => p.trim())
    .map(paragraph => ({
      type: 'paragraph',
      children: [{ type: 'text', text: paragraph.trim() }]
    }));
}

// 执行HTTP请求的函数
function makeRequest(url, method, data = null) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https');
    const reqModule = isHttps ? https : http;
    const urlObj = new URL(url);
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: `${urlObj.pathname}${urlObj.search}`,
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TOKEN}`
      }
    };
    
    const req = reqModule.request(options, res => {
      let data = '';
      
      res.on('data', chunk => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(JSON.parse(data));
          } else {
            console.error(`API错误 (${res.statusCode}):`, data);
            reject(new Error(`API请求失败: ${res.statusCode}`));
          }
        } catch (e) {
          reject(e);
        }
      });
    });
    
    req.on('error', error => {
      reject(error);
    });
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// 导入单个博客文章的函数
async function importBlog(blogData) {
  try {
    const post = blogData.post;
    
    // 准备中文版本数据
    const zhData = {
      data: {
        title: post.title_zh,
        content: convertToRichText(post.content_zh),
        author: post.author_zh || post.author_en,
        Date: post.date,
        locale: 'zh'
      }
    };
    
    // 创建中文版本
    console.log(`正在创建中文博客: "${post.title_zh}"`);
    const zhResponse = await makeRequest(API_URL, 'POST', zhData);
    
    console.log("API响应:", JSON.stringify(zhResponse, null, 2).substring(0, 200) + "...");
    
    let documentId;
    
    if (zhResponse && zhResponse.data) {
      // 检查不同的可能位置
      if (zhResponse.data.attributes && zhResponse.data.attributes.documentId) {
        documentId = zhResponse.data.attributes.documentId;
      } else if (zhResponse.data.documentId) {
        documentId = zhResponse.data.documentId;
      } else {
        console.log("完整响应:", JSON.stringify(zhResponse, null, 2));
        throw new Error('无法获取documentId，响应结构与预期不符');
      }
    } else {
      throw new Error('API响应缺少data字段');
    }
    
    console.log(`✅ 中文版本创建成功，documentId: ${documentId}`);
    
    // 准备英文版本数据
    const enData = {
      data: {
        title: post.title_en,
        content: convertToRichText(post.content_en),
        author: post.author_en,
        Date: post.date
      }
    };
    
    // 创建英文版本
    console.log(`正在创建英文博客: "${post.title_en}"`);
    const enResponse = await makeRequest(`${API_URL}/${documentId}?locale=en`, 'PUT', enData);
    console.log(`✅ 英文版本创建成功`);
    
    return {
      documentId,
      title_zh: post.title_zh,
      title_en: post.title_en
    };
  } catch (error) {
    console.error(`❌ 博客导入失败:`, error);
    return null;
  }
}

// 为blog1.json创建一个特殊处理函数，因为它的格式不同
async function importBlog1() {
  try {
    // 手动设置blog1的内容
    const blogData = {
      post: {
        title_zh: "我的新加坡之旅：阳光小岛的冒险！",
        title_en: "My Singapore Trip: Adventure on the Sunny Island!",
        content_zh: "新加坡是一个充满活力的城市国家，我在那里度过了难忘的一周。美食、景点和文化体验让这次旅行变得特别精彩。",
        content_en: "Singapore is a vibrant city-state where I spent an unforgettable week. The food, attractions, and cultural experiences made this trip especially memorable.",
        author_zh: "马克斯",
        author_en: "Max",
        date: "2024-10-13"
      }
    };
    
    return await importBlog(blogData);
  } catch (error) {
    console.error(`❌ 处理 blog1.json 时出错:`, error);
    return null;
  }
}

// 主函数
async function main() {
  const blogFiles = [
    'blog2.json',
    'blog3.json',
    'blog4.json',
    'blog5.json'
  ];
  
  console.log('开始导入博客到Strapi...');
  
  // 首先处理blog1（特殊情况）
  console.log('\n正在处理 blog1.json...');
  const blog1Result = await importBlog1();
  if (blog1Result) {
    console.log(`✅ 博客《${blog1Result.title_zh}》(《${blog1Result.title_en}》) 导入成功!\n`);
  }
  
  // 处理其他博客
  for (const file of blogFiles) {
    try {
      const filePath = path.resolve('public', 'content', 'blog', file);
      const fileData = fs.readFileSync(filePath, 'utf8');
      const blogData = JSON.parse(fileData);
      
      console.log(`\n正在处理 ${file}...`);
      const result = await importBlog(blogData);
      
      if (result) {
        console.log(`✅ 博客《${result.title_zh}》(《${result.title_en}》) 导入成功!\n`);
      }
    } catch (error) {
      console.error(`❌ 处理 ${file} 时出错:`, error);
    }
  }
  
  console.log('所有博客导入完成!');
}

// 执行主函数
main().catch(error => {
  console.error('程序执行错误:', error);
}); 