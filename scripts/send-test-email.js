/**
 * 测试邮件发送功能
 * 
 * 使用方法：
 * 1. 确保Strapi服务器正在运行
 * 2. 在Strapi项目根目录下执行：node scripts/send-test-email.js
 */

const nodemailer = require('nodemailer');
require('dotenv').config();

async function sendTestEmail() {
  try {
    // 从环境变量中获取SMTP配置
    const SMTP_USER = process.env.SMTP_USER || '229678@qq.com';
    const SMTP_PASS = process.env.SMTP_PASS || 'dvacicxumhybbjfc';

    if (!SMTP_USER || !SMTP_PASS) {
      throw new Error('缺少SMTP配置，请检查.env文件');
    }

    console.log('创建QQ邮箱传输器...');
    const transporter = nodemailer.createTransport({
      host: 'smtp.qq.com',
      port: 465,
      secure: true,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
      },
      debug: true,
      logger: true
    });

    console.log('准备发送测试邮件...');
    
    // 收件人邮箱
    const recipientEmails = ['libei002@gmail.com', '229678@qq.com'];
    console.log(`准备发送邮件到: ${recipientEmails.join(', ')}`);

    // 发送测试邮件
    const info = await transporter.sendMail({
      from: `"EdGoing表单通知" <${SMTP_USER}>`,
      to: recipientEmails.join(', '),
      subject: '📧 表单提交测试邮件',
      text: '这是一封测试邮件，用于验证表单提交后的邮件通知功能是否正常工作。',
      html: `
        <h2>表单提交通知测试</h2>
        <p>这是一封测试邮件，用于验证表单提交后的邮件通知功能是否正常工作。</p>
        <p>如果您收到这封邮件，说明邮件配置正确。</p>
        <p>发送时间: ${new Date().toLocaleString()}</p>
      `,
    });

    console.log('✅ 测试邮件已成功发送:', info.messageId);
    console.log('预览URL:', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('❌ 测试邮件发送失败:', error);
    console.error('错误详情:', error.message);
    if (error.stack) {
      console.error('错误堆栈:', error.stack);
    }
  }
}

sendTestEmail();
