import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

// Strapi 配置
export const strapiConfig = {
  apiUrl: process.env.STRAPI_API_URL || 'http://localhost:1337',
  apiToken: process.env.STRAPI_API_TOKEN || '', // 默认为空字符串
  blogPostsEndpoint: '/api/blogposts', // 确认的博客文章API端点
};

/**
 * 将相对路径转换为完整的URL
 * @param {string} path - 相对路径
 * @returns {string} - 完整的URL
 */
export const getFullUrl = (path) => {
  if (!path) return '';

  // 如果已经是完整的URL，直接返回
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // 确保路径以/开头
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  // 将相对路径与Strapi域名组合
  return `${strapiConfig.apiUrl}${normalizedPath}`;
};

// 检查是否配置了API令牌
if (!strapiConfig.apiToken) {
  console.warn('警告: 未配置STRAPI_API_TOKEN，Strapi API请求可能会失败。请检查您的 .env 文件。');
}
