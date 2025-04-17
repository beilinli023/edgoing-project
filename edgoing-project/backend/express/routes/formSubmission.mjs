import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import { isAuthenticated } from '../middleware/auth.mjs';

// 加载环境变量
dotenv.config();

const router = express.Router();
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || '';

/**
 * @route GET /api/form-submissions
 * @desc 获取所有表单提交数据
 * @access Private (需要管理员权限)
 */
router.get('/', isAuthenticated, async (req, res) => {
  try {
    // 从Strapi获取表单提交数据
    const response = await axios.get(`${STRAPI_URL}/api/form-submissions?populate=*`, {
      headers: {
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('获取表单提交数据失败:', error.message);
    res.status(500).json({
      success: false,
      message: '获取表单提交数据失败',
      error: error.message
    });
  }
});

/**
 * @route GET /api/form-submissions/:id
 * @desc 获取单个表单提交数据
 * @access Private (需要管理员权限)
 */
router.get('/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;

    // 从Strapi获取表单提交数据
    const response = await axios.get(`${STRAPI_URL}/api/form-submissions/${id}?populate=*`, {
      headers: {
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error(`获取表单提交数据(ID: ${req.params.id})失败:`, error.message);
    res.status(500).json({
      success: false,
      message: `获取表单提交数据(ID: ${req.params.id})失败`,
      error: error.message
    });
  }
});

/**
 * @route POST /api/form-submissions
 * @desc 创建新的表单提交
 * @access Public
 */
router.post('/', async (req, res) => {
  try {
    const formData = req.body;

    // 添加提交时间
    formData.submittedAt = new Date().toISOString();

    // 发送到Strapi
    const response = await axios.post(`${STRAPI_URL}/api/form-submissions`,
      { data: formData },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${STRAPI_API_TOKEN}`
        }
      }
    );

    // 表单提交成功后，调用脚本发送邮件通知
    try {
      console.log('表单提交成功，准备发送邮件通知...');
      const formId = response.data.data.id;
      const { exec } = await import('child_process');

      // 执行发送邮件脚本
      exec(`cd ../my-strapi-backend && node scripts/send-form-notification.js ${formId}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`邮件发送脚本执行错误: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`邮件发送脚本错误输出: ${stderr}`);
          return;
        }
        console.log(`邮件发送脚本输出: ${stdout}`);
      });
    } catch (emailError) {
      console.error('发送邮件通知失败:', emailError);
      // 即使邮件发送失败，也不影响表单提交的成功响应
    }

    res.status(201).json({
      success: true,
      message: '表单提交成功',
      data: response.data
    });
  } catch (error) {
    console.error('表单提交失败:', error.message);
    res.status(500).json({
      success: false,
      message: '表单提交失败',
      error: error.message
    });
  }
});

export default router;
