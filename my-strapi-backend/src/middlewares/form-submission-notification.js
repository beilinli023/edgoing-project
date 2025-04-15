'use strict';

/**
 * `form-submission-notification` middleware
 */

module.exports = (config, { strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    console.log('Form submission middleware executed');
    console.log('Request path:', ctx.request.path);
    console.log('Request method:', ctx.request.method);
    
    // 继续处理请求
    await next();
    
    // 如果是表单提交的POST请求
    if (ctx.request.path === '/api/form-submissions' && ctx.request.method === 'POST' && ctx.response.status === 201) {
      console.log('Form submission detected!');
      console.log('Response body:', ctx.response.body);
      
      try {
        const result = ctx.response.body.data;
        console.log('Form submission data:', result);
        
        // 组合姓名
        const fullName = `${result.firstName || ''} ${result.lastName || ''}`.trim() || '未提供姓名';
        
        // 收件人邮箱
        const recipientEmails = ['libei002@gmail.com', '229678@qq.com'];
        console.log(`准备发送邮件到: ${recipientEmails.join(', ')}`);
        
        await strapi.plugins['email'].services.email.send({
          to: recipientEmails,
          from: process.env.SMTP_USER,
          subject: `📩 新咨询表单提交 (中间件) - ${fullName}`,
          text: `
提交者信息：
- 姓名：${fullName}
- 邮箱：${result.email || '未提供'}
- 电话：${result.phone || '未提供'}
- 角色：${result.role || '未提供'}
- 年级：${result.gradeLevel || '未提供'}
- 目的地：${result.destinations || '未提供'}
- 兴趣：${result.interests || '未提供'}
- 问题内容：${result.questions || '无'}
- 提交时间：${result.submittedAt ? new Date(result.submittedAt).toLocaleString() : new Date().toLocaleString()}
          `,
          html: `
            <h2>📩 有用户提交了咨询表单 (中间件)</h2>
            <p><strong>姓名：</strong> ${fullName}</p>
            <p><strong>邮箱：</strong> ${result.email || '未提供'}</p>
            <p><strong>电话：</strong> ${result.phone || '未提供'}</p>
            <p><strong>角色：</strong> ${result.role || '未提供'}</p>
            <p><strong>年级：</strong> ${result.gradeLevel || '未提供'}</p>
            <p><strong>目的地：</strong> ${result.destinations || '未提供'}</p>
            <p><strong>兴趣：</strong> ${result.interests || '未提供'}</p>
            <p><strong>问题内容：</strong> ${result.questions || '无'}</p>
            <p><strong>提交时间：</strong> ${result.submittedAt ? new Date(result.submittedAt).toLocaleString() : new Date().toLocaleString()}</p>
          `,
        });
        
        strapi.log.info(`✅ 表单提交提醒邮件已成功发送到 ${recipientEmails.join(', ')}`);
      } catch (err) {
        strapi.log.error('❌ 邮件发送失败：', err);
        console.error('邮件发送错误详情:', err);
      }
    }
  };
};
