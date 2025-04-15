import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

// Strapi 配置
export const strapiConfig = {
  apiUrl: process.env.STRAPI_API_URL || 'http://localhost:1337',
  apiToken: process.env.STRAPI_API_TOKEN || '', // 默认为空字符串
  blogPostsEndpoint: '/api/blogposts', // 确认的博客文章API端点
};

// 检查是否配置了API令牌
if (!strapiConfig.apiToken) {
  console.warn('警告: 未配置STRAPI_API_TOKEN，Strapi API请求可能会失败。请检查您的 .env 文件。');
} 