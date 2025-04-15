import axios from 'axios';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

// Strapi API URL 和 Token
const strapiUrl = process.env.STRAPI_API_URL || 'http://localhost:1337';
const strapiToken = process.env.STRAPI_API_TOKEN || '';

/**
 * 从 Strapi 获取数据
 * @param {string} endpoint - API 端点，例如 '/api/blogs'
 * @param {Object} params - 查询参数
 * @returns {Promise<Object>} - 返回 Strapi 响应数据
 */
export const fetchFromStrapi = async (endpoint, params = {}) => {
  try {
    console.log(`Fetching from Strapi: ${endpoint}`);
    console.log('Params:', params);

    // 构建请求 URL
    const url = `${strapiUrl}${endpoint}`;
    
    // 设置请求头
    const headers = {};
    if (strapiToken) {
      headers.Authorization = `Bearer ${strapiToken}`;
    }

    // 发送请求
    const response = await axios.get(url, { params, headers });
    
    console.log(`Strapi response status: ${response.status}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching from Strapi:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
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
  return `${strapiUrl}${normalizedPath}`;
};

export default {
  fetchFromStrapi,
  getFullUrl
};
