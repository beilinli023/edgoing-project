'use strict';

require('dotenv').config();
const nodemailer = require('nodemailer');

// 创建QQ邮箱传输器
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

// 获取最近的表单提交
async function getRecentFormSubmissions() {
  try {
    const response = await fetch('http://localhost:1337/api/form-submissions?sort=createdAt:desc&pagination[limit]=5');
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('获取表单提交失败:', error);
    return [];
  }
}

// 发送简化版通知邮件
async function sendNotificationEmail(submissions) {
  try {
    // 收件人邮箱
    const recipientEmails = ['hello@edgoing.com'];
    console.log(`准备发送邮件到: ${recipientEmails.join(', ')}`);

    // 当前时间
    const currentTime = new Date().toLocaleString();

    const info = await qqTransporter.sendMail({
      from: '"Augment AI" <229678@qq.com>',
      to: recipientEmails,
      subject: `📩 有新表单提交啦！`,
      html: `
        <h2>📩 新表单提交通知</h2>
        <p>系统检测到 ${submissions.length} 个新的表单提交。</p>
        <p><strong>检测时间:</strong> ${currentTime}</p>
        <p>请尽快登录后台查看详情。</p>
      `,
    });

    console.log(`✅ 表单提交提醒邮件已成功发送到 ${recipientEmails.join(', ')}:`, info.messageId);
    return true;
  } catch (error) {
    console.error('发送邮件失败:', error);
    return false;
  }
}

// 主函数
async function main() {
  console.log('开始检查最近的表单提交...');

  // 获取最近的表单提交
  const submissions = await getRecentFormSubmissions();
  console.log(`找到 ${submissions.length} 个表单提交`);

  if (submissions.length > 0) {
    // 发送简化版通知邮件
    await sendNotificationEmail(submissions);
  } else {
    console.log('没有找到表单提交');
  }
}

// 执行主函数
main().catch(console.error);
