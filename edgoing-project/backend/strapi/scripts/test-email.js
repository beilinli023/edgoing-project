/**
 * 测试邮件发送功能
 *
 * 使用方法：
 * 1. 确保Strapi服务器正在运行
 * 2. 在Strapi项目根目录下执行：node scripts/test-email.js
 */

const nodemailer = require('nodemailer');
require('dotenv').config();

async function testEmail() {
  try {
    // 从环境变量中获取SMTP配置
    const SMTP_USER = process.env.SMTP_USER || '229678@qq.com';
    const SMTP_PASS = process.env.SMTP_PASS || 'dvacicxumhybbjfc';

    if (!SMTP_USER || !SMTP_PASS) {
      throw new Error('缺少SMTP配置，请检查.env文件');
    }

    console.log('创建nodemailer传输器...');

    console.log('准备发送测试邮件...');

    // 使用QQ邮箱发送测试邮件
    // 创建QQ邮箱传输器
    console.log('创建QQ邮箱传输器...');
    const qqTransporter = nodemailer.createTransport({
      host: 'smtp.qq.com',
      port: 465,
      secure: true,
      auth: {
        user: '229678@qq.com',
        pass: 'dvacicxumhybbjfc'
      },
      debug: true,
      logger: true
    });

    console.log('准备发送测试邮件到229678@qq.com...');

    // 发送测试邮件到QQ邮箱
    const qqInfo = await qqTransporter.sendMail({
      from: '"Augment AI" <229678@qq.com>',
      to: '229678@qq.com',
      subject: '📧 测试邮件 - 发送到QQ邮箱',
      text: '这是一封测试邮件，用于验证邮件发送功能是否正常工作。这次我们测试发送到QQ邮箱。',
      html: `
        <h2>邮件发送功能测试</h2>
        <p>这是一封测试邮件，用于验证邮件发送功能是否正常工作。</p>
        <p>这次我们测试发送到QQ邮箱。</p>
        <p>如果您收到这封邮件，说明邮件配置正确。</p>
        <p>发送时间: ${new Date().toLocaleString()}</p>
      `,
    });

    console.log('✅ 测试邮件已成功发送到QQ邮箱:', qqInfo.messageId);

    // 发送测试邮件到Gmail
    console.log('准备发送测试邮件到hello@edgoing.com...');

    const gmailInfo = await qqTransporter.sendMail({
      from: '"Augment AI" <229678@qq.com>',
      to: 'hello@edgoing.com',
      subject: '📧 测试邮件 - 发送到Gmail',
      text: '这是一封测试邮件，用于验证邮件发送功能是否正常工作。这次我们测试发送到Gmail。',
      html: `
        <h2>邮件发送功能测试</h2>
        <p>这是一封测试邮件，用于验证邮件发送功能是否正常工作。</p>
        <p>这次我们测试发送到Gmail。</p>
        <p>如果您收到这封邮件，说明邮件配置正确。</p>
        <p>发送时间: ${new Date().toLocaleString()}</p>
      `,
    });

    console.log('✅ 测试邮件已成功发送到Gmail:', gmailInfo.messageId);
  } catch (error) {
    console.error('❌ 测试邮件发送失败:', error);
  }
}

testEmail();
