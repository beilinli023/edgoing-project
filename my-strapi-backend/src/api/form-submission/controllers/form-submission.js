'use strict';

/**
 * form-submission controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::form-submission.form-submission', ({ strapi }) => {
  console.log('Controller factory function executed [' + new Date().toISOString() + ']');
  return {
    // 自定义API端点，用于提交表单并发送邮件
    async submitWithEmail(ctx) {
      console.log('='.repeat(80));
      console.log('Custom submitWithEmail endpoint called [' + new Date().toISOString() + ']');
      console.log('Request body:', JSON.stringify(ctx.request.body));
      console.log('='.repeat(80));

      try {
        // 1. 保存表单数据
        const { data } = ctx.request.body;

        // 创建表单提交记录
        const entity = await strapi.entityService.create('api::form-submission.form-submission', {
          data: data
        });

        console.log('Form submission created:', entity.id);

        // 2. 发送邮件通知
        // 组合姓名
        const firstName = data.firstName || '';
        const lastName = data.lastName || '';
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

        // 当前时间
        const currentTime = new Date().toLocaleString();

        // 发送邮件
        const mailInfo = await transporter.sendMail({
          to: recipientEmails,
          from: `"EdGoing表单通知" <${process.env.SMTP_USER || '229678@qq.com'}>`,
          subject: `📩 新表单提交通知 (自定义API) - ${fullName}`,
          text: `
您好，

系统收到了一个新的表单提交。

提交者信息：
- 姓名：${fullName}
- 邮箱：${data.email || '未提供'}
- 电话：${data.phone || '未提供'}
- 角色：${data.role || '未提供'}
- 年级：${data.gradeLevel || '未提供'}
- 目的地：${data.destinations || '未提供'}
- 兴趣：${data.interests || '未提供'}
- 问题内容：${data.questions || '无'}
- 提交时间：${data.submittedAt ? new Date(data.submittedAt).toLocaleString() : currentTime}

请登录管理后台查看详细信息。
          `,
          html: `
            <h2>📩 新表单提交通知 (自定义API)</h2>
            <p>系统收到了一个新的表单提交。</p>

            <h3>提交者信息：</h3>
            <p><strong>姓名：</strong> ${fullName}</p>
            <p><strong>邮箱：</strong> ${data.email || '未提供'}</p>
            <p><strong>电话：</strong> ${data.phone || '未提供'}</p>
            <p><strong>角色：</strong> ${data.role || '未提供'}</p>
            <p><strong>年级：</strong> ${data.gradeLevel || '未提供'}</p>
            <p><strong>目的地：</strong> ${data.destinations || '未提供'}</p>
            <p><strong>兴趣：</strong> ${data.interests || '未提供'}</p>
            <p><strong>问题内容：</strong> ${data.questions || '无'}</p>
            <p><strong>提交时间：</strong> ${data.submittedAt ? new Date(data.submittedAt).toLocaleString() : currentTime}</p>

            <p>请登录管理后台查看详细信息。</p>
          `,
        });

        console.log(`✅ 表单提交提醒邮件已成功发送到 ${recipientEmails.join(', ')}`);
        console.log('邮件发送结果:', mailInfo.messageId);

        // 3. 返回成功响应
        return { success: true, data: entity, emailSent: true };
      } catch (err) {
        console.error('❌ 自定义API端点错误：', err);
        console.error('错误详情:', err.message);
        console.error('错误堆栈:', err.stack);

        ctx.throw(500, '表单提交或邮件发送失败');
      }
    },
    async create(ctx) {
      console.log('='.repeat(80));
      console.log('Form submission create method called [' + new Date().toISOString() + ']');
      console.log('Request body:', JSON.stringify(ctx.request.body));
      console.log('Context:', Object.keys(ctx));
      console.log('='.repeat(80));

      // 直接发送邮件通知
      try {
        // 获取表单数据
        const formData = ctx.request.body.data || {};
        console.log('Form data for email:', JSON.stringify(formData));

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

        // 当前时间
        const currentTime = new Date().toLocaleString();

        // 发送邮件
        const mailInfo = await transporter.sendMail({
          to: recipientEmails,
          from: `"EdGoing表单通知" <${process.env.SMTP_USER || '229678@qq.com'}>`,
          subject: `📩 新表单提交通知 (控制器) - ${fullName}`,
          text: `
您好，

系统收到了一个新的表单提交。

提交者信息：
- 姓名：${fullName}
- 邮箱：${formData.email || '未提供'}
- 电话：${formData.phone || '未提供'}
- 角色：${formData.role || '未提供'}
- 年级：${formData.gradeLevel || '未提供'}
- 目的地：${formData.destinations || '未提供'}
- 兴趣：${formData.interests || '未提供'}
- 问题内容：${formData.questions || '无'}
- 提交时间：${formData.submittedAt ? new Date(formData.submittedAt).toLocaleString() : currentTime}

请登录管理后台查看详细信息。
          `,
          html: `
            <h2>📩 新表单提交通知 (控制器)</h2>
            <p>系统收到了一个新的表单提交。</p>

            <h3>提交者信息：</h3>
            <p><strong>姓名：</strong> ${fullName}</p>
            <p><strong>邮箱：</strong> ${formData.email || '未提供'}</p>
            <p><strong>电话：</strong> ${formData.phone || '未提供'}</p>
            <p><strong>角色：</strong> ${formData.role || '未提供'}</p>
            <p><strong>年级：</strong> ${formData.gradeLevel || '未提供'}</p>
            <p><strong>目的地：</strong> ${formData.destinations || '未提供'}</p>
            <p><strong>兴趣：</strong> ${formData.interests || '未提供'}</p>
            <p><strong>问题内容：</strong> ${formData.questions || '无'}</p>
            <p><strong>提交时间：</strong> ${formData.submittedAt ? new Date(formData.submittedAt).toLocaleString() : currentTime}</p>

            <p>请登录管理后台查看详细信息。</p>
          `,
        });

        console.log(`✅ 表单提交提醒邮件已成功发送到 ${recipientEmails.join(', ')}`);
        console.log('邮件发送结果:', mailInfo.messageId);
      } catch (err) {
        console.error('❌ 邮件发送失败：', err);
        console.error('错误详情:', err.message);
        console.error('错误堆栈:', err.stack);
      }

      // 调用默认的create方法
      console.log('Calling super.create...');
      const response = await super.create(ctx);
      console.log('Create response:', JSON.stringify(response));
      console.log('Response data structure:', Object.keys(response.data));

      try {
        // 发送简化版邮件通知
        console.log('Preparing to send simplified email notification...');

        // 当前时间
        const currentTime = new Date().toLocaleString();

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

        console.log('Sending email via nodemailer directly...');
        // 获取表单数据
        const formData = ctx.request.body.data || {};
        console.log('Form data for email:', JSON.stringify(formData));

        // 组合姓名
        const firstName = formData.firstName || '';
        const lastName = formData.lastName || '';
        const fullName = `${firstName} ${lastName}`.trim() || '未提供姓名';

        const mailInfo = await transporter.sendMail({
          to: recipientEmails,
          from: `"EdGoing表单通知" <${process.env.SMTP_USER || '229678@qq.com'}>`,
          subject: `📩 新表单提交通知 - ${fullName}`,
          text: `
您好，

系统收到了一个新的表单提交。

提交者信息：
- 姓名：${fullName}
- 邮箱：${formData.email || '未提供'}
- 电话：${formData.phone || '未提供'}
- 角色：${formData.role || '未提供'}
- 年级：${formData.gradeLevel || '未提供'}
- 目的地：${formData.destinations || '未提供'}
- 兴趣：${formData.interests || '未提供'}
- 问题内容：${formData.questions || '无'}
- 提交时间：${formData.submittedAt ? new Date(formData.submittedAt).toLocaleString() : currentTime}

请登录管理后台查看详细信息。
          `,
          html: `
            <h2>📩 新表单提交通知</h2>
            <p>系统收到了一个新的表单提交。</p>

            <h3>提交者信息：</h3>
            <p><strong>姓名：</strong> ${fullName}</p>
            <p><strong>邮箱：</strong> ${formData.email || '未提供'}</p>
            <p><strong>电话：</strong> ${formData.phone || '未提供'}</p>
            <p><strong>角色：</strong> ${formData.role || '未提供'}</p>
            <p><strong>年级：</strong> ${formData.gradeLevel || '未提供'}</p>
            <p><strong>目的地：</strong> ${formData.destinations || '未提供'}</p>
            <p><strong>兴趣：</strong> ${formData.interests || '未提供'}</p>
            <p><strong>问题内容：</strong> ${formData.questions || '无'}</p>
            <p><strong>提交时间：</strong> ${formData.submittedAt ? new Date(formData.submittedAt).toLocaleString() : currentTime}</p>

            <p>请登录管理后台查看详细信息。</p>
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

      return response;
    }
  };
});
