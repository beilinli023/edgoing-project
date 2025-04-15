'use strict';

/**
 * form-submission service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::form-submission.form-submission', ({ strapi }) => ({
  async create(data) {
    console.log('Form submission service create method called');
    console.log('Data:', JSON.stringify(data));

    // 调用默认的create方法
    const result = await super.create(data);
    console.log('Create result:', JSON.stringify(result));

    try {
      // 发送邮件通知
      console.log('Preparing to send email notification...');

      // 处理数据结构
      // Strapi v5中，数据可能在data子对象中
      const formData = data.data || data;
      console.log('Form data structure:', Object.keys(formData));

      // 组合姓名
      const firstName = formData.firstName || '';
      const lastName = formData.lastName || '';
      const fullName = `${firstName} ${lastName}`.trim() || '未提供姓名';

      // 收件人邮箱
      const recipientEmails = ['libei002@gmail.com', '229678@qq.com'];
      console.log(`准备发送邮件到: ${recipientEmails.join(', ')}`);

      // 使用nodemailer直接发送邮件，确保可靠性
      const nodemailer = require('nodemailer');
      const transporter = nodemailer.createTransport({
        host: 'smtp.qq.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.SMTP_USER || '229678@qq.com',
          pass: process.env.SMTP_PASS || 'dvacicxumhybbjfc'
        },
        debug: true,
        logger: true
      });

      // 发送邮件
      const mailInfo = await transporter.sendMail({
        to: recipientEmails,
        from: process.env.SMTP_USER,
        subject: `📩 新咨询表单提交 - ${fullName}`,
        text: `
提交者信息：
- 姓名：${fullName}
- 邮箱：${formData.email || '未提供'}
- 电话：${formData.phone || '未提供'}
- 角色：${formData.role || '未提供'}
- 年级：${formData.gradeLevel || '未提供'}
- 目的地：${formData.destinations || '未提供'}
- 兴趣：${formData.interests || '未提供'}
- 问题内容：${formData.questions || '无'}
- 提交时间：${formData.submittedAt ? new Date(formData.submittedAt).toLocaleString() : new Date().toLocaleString()}
        `,
        html: `
          <h2>📩 有用户提交了咨询表单</h2>
          <p><strong>姓名：</strong> ${fullName}</p>
          <p><strong>邮箱：</strong> ${formData.email || '未提供'}</p>
          <p><strong>电话：</strong> ${formData.phone || '未提供'}</p>
          <p><strong>角色：</strong> ${formData.role || '未提供'}</p>
          <p><strong>年级：</strong> ${formData.gradeLevel || '未提供'}</p>
          <p><strong>目的地：</strong> ${formData.destinations || '未提供'}</p>
          <p><strong>兴趣：</strong> ${formData.interests || '未提供'}</p>
          <p><strong>问题内容：</strong> ${formData.questions || '无'}</p>
          <p><strong>提交时间：</strong> ${formData.submittedAt ? new Date(formData.submittedAt).toLocaleString() : new Date().toLocaleString()}</p>
        `,
      });

      console.log(`✅ 表单提交提醒邮件已成功发送到 ${recipientEmails.join(', ')}`);
      console.log('邮件发送结果:', mailInfo.messageId);

      // 将邮件发送结果记录到日志
      strapi.log.info(`✅ 表单提交提醒邮件已成功发送到 ${recipientEmails.join(', ')}`);
    } catch (err) {
      console.error('❌ 邮件发送失败：', err);
      console.error('错误详情:', err.message);
      console.error('错误堆栈:', err.stack);

      // 将错误记录到日志
      strapi.log.error('❌ 邮件发送失败：', err);
    }

    return result;
  },
}));
