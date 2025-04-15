/**
 * 管理员配置
 * 包含管理员凭据验证逻辑
 */

import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

// 从环境变量获取管理员凭据
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'edgoing2025';

/**
 * 验证管理员凭据
 * @param {string} username - 用户名
 * @param {string} password - 密码
 * @returns {Promise<boolean>} - 验证结果
 */
export const validateAdminCredentials = async (username, password) => {
  // 简单的凭据验证
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
};
