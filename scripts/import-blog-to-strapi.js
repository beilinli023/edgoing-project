/**
 * 将本地博客数据导入到 Strapi 的脚本
 *
 * 使用方法：
 * 1. 确保 Strapi 服务器正在运行
 * 2. 运行 `node scripts/import-blog-to-strapi.js`
 *
 * 注意：该脚本只会导入指定的五篇博客文章，并且只导入标题和内容的中英文版本
 */

import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径
 const __filename = fileURLToPath(import.meta.url);
 const __dirname = path.dirname(__filename);

// 配置
const STRAPI_URL = 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || 'ef45d960b23a2c2843220cf09f5884fdcf574c89fe941c67cd21aa80f7e3a52df99db3198b7b9707803e381195c9f13e53b6735a4dc0b094ec35b6e8c6a4c64328cd413ca97383f12e01b3dbfa5a017104b7318168ccf962ff11f83b1cc6b4ee336511c3f4e1dcbe4ec38ea3425d161b337fe77dea6cb6ad3b54d8d7b1c17850';
const BLOG_DATA_DIR = path.join(__dirname, '../public/content/blog');

// 博客文件列表
const BLOG_FILES = [
  'blog1.json',
  'blog2.json',
  'blog3.json',
  'blog4.json',
  'blog5.json'
];

// 创建 Axios 实例
const strapiClient = axios.create({
  baseURL: STRAPI_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${STRAPI_API_TOKEN}`
  }
});

/**
 * 读取博客数据文件
 */
async function readBlogData() {
  try {
    // 读取指定的博客文件
    const posts = [];

    for (const fileName of BLOG_FILES) {
      const filePath = path.join(BLOG_DATA_DIR, fileName);
      const fileContent = await fs.promises.readFile(filePath, 'utf8');
      const postData = JSON.parse(fileContent);

      if (postData.post) {
        posts.push(postData.post);
      } else {
        console.warn(`警告: ${fileName} 不包含 'post' 对象`);
      }
    }

    console.log(`成功读取 ${posts.length} 篇博客文章`);
    return posts;
  } catch (error) {
    console.error('读取博客数据时出错:', error);
    throw error;
  }
}

/**
 * 生成唯一的 slug
 */
function generateUniqueSlug(originalSlug, index) {
  const timestamp = Date.now();
  return `${originalSlug}-${index}-${timestamp}`;
}

/**
 * 检查 Strapi 中是否已经存在相同标题的博客文章
 */
async function checkIfBlogPostExists(title, locale) {
  try {
    console.log(`检查是否存在博客文章: "${title}" (${locale})`);

    const response = await strapiClient.get('/api/blogposts', {
      params: {
        filters: {
          title: {
            $eq: title
          },
          locale: {
            $eq: locale
          }
        }
      }
    });

    const exists = response.data.data && response.data.data.length > 0;
    console.log(`博客文章 "${title}" (${locale}) ${exists ? '已存在' : '不存在'}`);
    return exists;
  } catch (error) {
    console.error('检查博客文章是否存在时出错:', error.message);
    return false;
  }
}

/**
 * 将博客文章导入到 Strapi
 */
async function importBlogPostToStrapi(post, index) {
  try {
    // 检查英文版本是否已经存在
    const enExists = await checkIfBlogPostExists(post.title_en, 'en');
    if (enExists) {
      console.log(`English version of "${post.title_en}" already exists, skipping...`);
      return null;
    }

    // 检查中文版本是否已经存在
    const zhExists = await checkIfBlogPostExists(post.title_zh, 'zh');
    if (zhExists) {
      console.log(`Chinese version of "${post.title_zh}" already exists, skipping...`);
      return null;
    }

    // 生成唯一的 slug
    const uniqueSlug = generateUniqueSlug(post.slug || 'blog-post', index);

    // 准备英文版本数据
    const enData = {
      title: post.title_en,
      content: [
        {
          type: 'paragraph',
          children: [{ type: 'text', text: post.content_en }]
        }
      ],
      Date: post.date || post.published_at || new Date().toISOString().split('T')[0],
      author: post.author_en || post.author || 'Unknown',
      slug: uniqueSlug,
      locale: 'en',
      publishedAt: post.published_at || new Date().toISOString()
    };

    // 创建英文版本
    console.log(`Creating English version of "${post.title_en}"`);
    const enResponse = await strapiClient.post('/api/blogposts', { data: enData });
    const enId = enResponse.data.data.id;
    const documentId = enResponse.data.data.documentId;

    // 准备中文版本数据
    const zhData = {
      title: post.title_zh,
      content: [
        {
          type: 'paragraph',
          children: [{ type: 'text', text: post.content_zh }]
        }
      ],
      Date: post.date || post.published_at || new Date().toISOString().split('T')[0],
      author: post.author_zh || post.author || '未知',
      slug: uniqueSlug,
      locale: 'zh',
      publishedAt: post.published_at || new Date().toISOString()
    };

    // 创建中文版本
    console.log(`Creating Chinese version of "${post.title_zh}"`);
    const zhResponse = await strapiClient.post('/api/blogposts', { data: zhData });
    const zhId = zhResponse.data.data.id;

    console.log(`Successfully imported blog post "${post.title_en}" (EN: ${enId}, ZH: ${zhId})`);
    return { enId, zhId, documentId };
  } catch (error) {
    console.error(`Error importing blog post "${post.title_en || post.title_zh}":`, error.response?.data || error.message);
    throw error;
  }
}

/**
 * 主函数
 */
async function main() {
  try {
    // 读取博客数据
    const posts = await readBlogData();

    // 导入每篇博客文章
    let importedCount = 0;
    for (let i = 0; i < posts.length; i++) {
      const result = await importBlogPostToStrapi(posts[i], i);
      if (result) importedCount++;

      // 等待一秒，避免请求过快
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log(`成功导入 ${importedCount} 篇博客文章，共 ${posts.length} 篇。`);

    console.log('导入完成！');
  } catch (error) {
    console.error('导入失败:', error);
  }
}

// 执行主函数
main();
