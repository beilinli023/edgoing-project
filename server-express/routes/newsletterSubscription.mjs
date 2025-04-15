import express from 'express';
import axios from 'axios';
import { strapiConfig } from '../config/strapi.mjs';

console.log('=== 加载 newsletterSubscription 路由模块 ===');
console.log('strapiConfig:', strapiConfig);

const router = express.Router();

/**
 * @route POST /api/newsletter-subscriptions
 * @desc 创建新的邮件订阅
 * @access Public
 */
router.post('/', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: '邮箱地址是必填项',
        error: 'Email is required'
      });
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: '邮箱格式不正确',
        error: 'Invalid email format'
      });
    }

    console.log(`处理邮件订阅请求: ${email}`);

    // 准备发送到Strapi的数据
    const subscriptionData = {
      data: {
        email: email,
        subscribed_at: new Date().toISOString()
      }
    };

    // 发送到Strapi
    const response = await axios.post(
      `${strapiConfig.apiUrl}/api/newsletter-subscriptions`,
      subscriptionData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${strapiConfig.apiToken}`
        }
      }
    );

    console.log('Strapi响应:', response.data);

    // 返回成功响应
    res.status(201).json({
      success: true,
      message: '订阅成功',
      data: response.data.data
    });
  } catch (error) {
    console.error('订阅处理错误:', error.message);

    // 检查是否是唯一性约束错误（邮箱已存在）
    if (error.response && error.response.data && error.response.data.error &&
        error.response.data.error.message &&
        error.response.data.error.message.includes('unique')) {
      return res.status(409).json({
        success: false,
        message: '该邮箱已订阅',
        error: 'Email already subscribed'
      });
    }

    res.status(500).json({
      success: false,
      message: '订阅处理失败',
      error: error.message
    });
  }
});

/**
 * @route GET /api/newsletter-subscriptions
 * @desc 获取所有邮件订阅
 * @access Private (需要管理员权限)
 */
router.get('/', async (req, res) => {
  try {
    // 从Strapi获取订阅数据
    const response = await axios.get(`${strapiConfig.apiUrl}/api/newsletter-subscriptions`, {
      headers: {
        'Authorization': `Bearer ${strapiConfig.apiToken}`
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('获取订阅数据失败:', error.message);
    res.status(500).json({
      success: false,
      message: '获取订阅数据失败',
      error: error.message
    });
  }
});

export default router;
