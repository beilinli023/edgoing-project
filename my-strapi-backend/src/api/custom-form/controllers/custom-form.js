'use strict';

/**
 * A set of functions called "actions" for `custom-form`
 */

module.exports = {
  async submit(ctx) {
    try {
      // 获取表单数据
      const { firstName, lastName, email, phone, ...rest } = ctx.request.body;
      
      // 保存到数据库
      const entry = await strapi.entityService.create('api::form-submission.form-submission', {
        data: {
          firstName,
          lastName,
          email,
          phone,
          ...rest,
          publishedAt: new Date(),
        },
      });
      
      // 当前时间
      const currentTime = new Date().toLocaleString();
      
      // 收件人邮箱
      const recipientEmails = ['libei002@gmail.com', '229678@qq.com'];
      console.log(`准备发送邮件到: ${recipientEmails.join(', ')}`);
      
      // 发送简单提醒邮件
      console.log('Sending email via strapi.plugins.email.services.email.send...');
      await strapi.plugins.email.services.email.send({
        to: recipientEmails,
        from: process.env.SMTP_USER,
        subject: `📩 新表单提交通知 - ${currentTime}`,
        text: `
您好，

系统收到了一个新的表单提交。
提交时间: ${currentTime}

请登录管理后台查看详细信息。
        `,
        html: `
          <h2>📩 新表单提交通知</h2>
          <p>系统收到了一个新的表单提交。</p>
          <p><strong>提交时间:</strong> ${currentTime}</p>
          <p>请登录管理后台查看详细信息。</p>
        `,
      });
      
      console.log(`✅ 表单提交提醒邮件已成功发送到 ${recipientEmails.join(', ')}`);
      
      return { success: true, id: entry.id };
    } catch (err) {
      console.error('表单提交失败:', err);
      ctx.throw(500, err);
    }
  }
};
