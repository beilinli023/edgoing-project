'use strict';

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }) {
    console.log('Server bootstrap hook executed [' + new Date().toISOString() + ']');
    console.log('正在注册表单提交生命周期钩子...');

    // 直接发送一封测试邮件
    try {
      setTimeout(async () => {
        console.log('尝试发送启动测试邮件...');
        try {
          await strapi.plugins.email.services.email.send({
            to: ['libei002@gmail.com', '229678@qq.com'],
            from: process.env.SMTP_USER,
            subject: '📧 Strapi服务器启动通知',
            text: '这是一封测试邮件，表明Strapi服务器已成功启动。',
            html: `
              <h2>Strapi服务器启动通知</h2>
              <p>这是一封测试邮件，表明Strapi服务器已成功启动。</p>
              <p>启动时间: ${new Date().toLocaleString()}</p>
            `,
          });
          console.log('✅ 启动测试邮件已成功发送');
        } catch (err) {
          console.error('❌ 启动测试邮件发送失败：', err);
        }
      }, 5000);
    } catch (err) {
      console.error('设置启动测试邮件失败：', err);
    }

    // 注册生命周期钩子
    console.log('注册表单提交生命周期钩子...');
    strapi.db.lifecycles.subscribe({
      models: ['api::form-submission.form-submission'],

      async beforeCreate(event) {
        console.log('Global beforeCreate event triggered [' + new Date().toISOString() + ']');
        console.log('Event structure:', Object.keys(event));
        console.log('Event params:', event.params);
      },

      async afterCreate(event) {
        console.log('='.repeat(80));
        console.log('🔥 afterCreate fired for:', event.model.uid);
        console.log('Event structure:', Object.keys(event));
        console.log('='.repeat(80));

        const modelUid = event.model.uid;

        // 只对form-submission模型触发
        if (modelUid === 'api::form-submission.form-submission') {
          console.log('📨 表单提交成功，准备发送提醒邮件...');
          console.log('Event data:', JSON.stringify(event.params.data));

          try {
            // 获取表单数据
            const formData = event.params.data || {};

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
      }
    });
  },
};
