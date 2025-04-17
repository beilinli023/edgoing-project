/**
 * 发送表单提交通知邮件
 *
 * 使用方法：
 * 1. 确保Strapi服务器正在运行
 * 2. 在Strapi项目根目录下执行：node scripts/send-form-notification.js <表单ID>
 */

const nodemailer = require('nodemailer');
require('dotenv').config();

async function sendFormNotification() {
  try {
    // 获取表单ID
    const formId = process.argv[2];
    if (!formId) {
      console.error('❌ 请提供表单ID作为参数');
      process.exit(1);
    }

    console.log(`🔍 正在获取表单ID ${formId} 的数据...`);

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

    console.log('准备发送表单提交通知邮件...');

    // 收件人邮箱
    const recipientEmails = ['hello@edgoing.com'];
    console.log(`准备发送邮件到: ${recipientEmails.join(', ')}`);

    // 当前时间
    const currentTime = new Date().toLocaleString();

    // 发送表单提交通知邮件
    const info = await transporter.sendMail({
      from: `"EdGoing表单通知" <${SMTP_USER}>`,
      to: recipientEmails.join(', '),
      subject: `📩 新表单提交通知 (ID: ${formId})`,
      text: `
您好，

系统收到了一个新的表单提交。
表单ID: ${formId}
提交时间: ${currentTime}

请登录管理后台查看详细信息。
      `,
      html: `
        <h2>📩 新表单提交通知</h2>
        <p>系统收到了一个新的表单提交。</p>
        <p><strong>表单ID:</strong> ${formId}</p>
        <p><strong>提交时间:</strong> ${currentTime}</p>
        <p>请登录管理后台查看详细信息。</p>
      `,
    });

    console.log('✅ 表单提交通知邮件已成功发送:', info.messageId);
    process.exit(0);
  } catch (error) {
    console.error('❌ 表单提交通知邮件发送失败:', error);
    console.error('错误详情:', error.message);
    if (error.stack) {
      console.error('错误堆栈:', error.stack);
    }
    process.exit(1);
  }
}

sendFormNotification();
