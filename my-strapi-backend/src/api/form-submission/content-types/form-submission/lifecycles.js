'use strict';

/**
 * Lifecycle callbacks for the `form-submission` model.
 */

const nodemailer = require('nodemailer');

module.exports = {
  beforeCreate(event) {
    const { data, where, select, populate } = event.params;
    console.log('beforeCreate 触发，数据:', data);
  },

  async afterCreate(event) {
    console.log('='.repeat(80));
    console.log('afterCreate 事件触发 [' + new Date().toISOString() + ']');
    console.log('事件对象类型:', typeof event);
    console.log('事件对象属性:', Object.keys(event));
    console.log('事件对象:', JSON.stringify(event, null, 2));
    console.log('='.repeat(80));

    // 尝试不同的方式获取数据
    const data = event.result || event.params?.data || {};
    console.log('表单数据:', JSON.stringify(data));

    try {
      // 组合姓名 - 尝试多种可能的属性路径
      const firstName = data.firstName || data.attributes?.firstName || '';
      const lastName = data.lastName || data.attributes?.lastName || '';
      const fullName = `${firstName} ${lastName}`.trim() || '未提供姓名';

      // 收件人邮箱
      const recipientEmails = ['hello@edgoing.com'];
      console.log(`准备发送邮件到: ${recipientEmails.join(', ')}`);

      // 使用nodemailer直接发送邮件，确保可靠性
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

      // 当前时间
      const currentTime = new Date().toLocaleString();

      // 发送邮件
      const mailInfo = await transporter.sendMail({
        to: recipientEmails, // ✅ 管理员收件邮箱
        from: process.env.SMTP_USER,
        subject: `📩 新咨询表单提交 - ${fullName}`,
        text: `
提交者信息：
- 姓名：${fullName}
- 邮箱：${data.email || data.attributes?.email || '未提供'}
- 电话：${data.phone || data.attributes?.phone || '未提供'}
- 角色：${data.role || data.attributes?.role || '未提供'}
- 年级：${data.gradeLevel || data.attributes?.gradeLevel || '未提供'}
- 目的地：${data.destinations || data.attributes?.destinations || '未提供'}
- 兴趣：${data.interests || data.attributes?.interests || '未提供'}
- 问题内容：${data.questions || data.attributes?.questions || '无'}
- 提交时间：${(data.submittedAt || data.attributes?.submittedAt) ? new Date(data.submittedAt || data.attributes?.submittedAt).toLocaleString() : new Date().toLocaleString()}
        `,
        html: `
          <h2>📩 有用户提交了咨询表单</h2>
          <p><strong>姓名：</strong> ${fullName}</p>
          <p><strong>邮箱：</strong> ${data.email || data.attributes?.email || '未提供'}</p>
          <p><strong>电话：</strong> ${data.phone || data.attributes?.phone || '未提供'}</p>
          <p><strong>角色：</strong> ${data.role || data.attributes?.role || '未提供'}</p>
          <p><strong>年级：</strong> ${data.gradeLevel || data.attributes?.gradeLevel || '未提供'}</p>
          <p><strong>目的地：</strong> ${data.destinations || data.attributes?.destinations || '未提供'}</p>
          <p><strong>兴趣：</strong> ${data.interests || data.attributes?.interests || '未提供'}</p>
          <p><strong>问题内容：</strong> ${data.questions || data.attributes?.questions || '无'}</p>
          <p><strong>提交时间：</strong> ${(data.submittedAt || data.attributes?.submittedAt) ? new Date(data.submittedAt || data.attributes?.submittedAt).toLocaleString() : new Date().toLocaleString()}</p>
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
  },
};
