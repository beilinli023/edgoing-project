import axios from 'axios';
import { strapiConfig } from '../config/strapi.mjs';

// 创建一个带有默认配置的axios实例
const strapiAxios = axios.create({
  baseURL: strapiConfig.apiUrl,
  headers: {
    'Content-Type': 'application/json',
    ...(strapiConfig.apiToken ? { 'Authorization': `Bearer ${strapiConfig.apiToken}` } : {})
  }
});

// 日志函数
const log = (message) => {
  console.log(`[${new Date().toISOString()}] ${message}`);
};

// 错误日志函数
const logError = (message, error) => {
  console.error(`[${new Date().toISOString()}] ${message}`, error);
};

/**
 * 基本健康检查
 */
export const checkHealth = async (req, res) => {
  log('【checkHealth】执行基本健康检查');
  
  const health = {
    uptime: process.uptime(),
    timestamp: Date.now(),
    status: 'UP',
    services: {
      express: {
        status: 'UP'
      }
    }
  };
  
  try {
    // 检查Strapi健康状态
    const strapiHealth = await checkStrapiHealthStatus();
    health.services.strapi = strapiHealth;
  } catch (error) {
    health.services.strapi = {
      status: 'DOWN',
      error: error.message
    };
  }
  
  // 如果任何服务DOWN，整体状态为DOWN
  if (Object.values(health.services).some(service => service.status === 'DOWN')) {
    health.status = 'DOWN';
    res.status(503);
  }
  
  res.json(health);
};

/**
 * Strapi健康检查
 */
export const checkStrapiHealth = async (req, res) => {
  log('【checkStrapiHealth】执行Strapi健康检查');
  
  try {
    const health = await checkStrapiHealthStatus();
    
    if (health.status === 'DOWN') {
      res.status(503);
    }
    
    res.json(health);
  } catch (error) {
    logError('【checkStrapiHealth】Strapi健康检查失败:', error);
    
    res.status(503).json({
      status: 'DOWN',
      error: error.message
    });
  }
};

/**
 * 检查Strapi健康状态
 */
async function checkStrapiHealthStatus() {
  try {
    // 尝试访问Strapi API
    const startTime = Date.now();
    const response = await strapiAxios.get('/api/blogposts?pagination[limit]=1', {
      timeout: 5000 // 5秒超时
    });
    const responseTime = Date.now() - startTime;
    
    return {
      status: 'UP',
      responseTime: `${responseTime}ms`,
      url: strapiConfig.apiUrl
    };
  } catch (error) {
    logError('【checkStrapiHealthStatus】Strapi健康检查失败:', error);
    
    return {
      status: 'DOWN',
      error: error.message,
      url: strapiConfig.apiUrl
    };
  }
}
