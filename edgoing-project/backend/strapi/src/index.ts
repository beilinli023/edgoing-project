import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }: { strapi: Core.Strapi }) {
    console.log('Server bootstrap hook executed [' + new Date().toISOString() + ']');

    // 添加全局中间件记录所有请求
    strapi.server.use(async (ctx: any, next: any) => {
      console.log(`收到请求: ${ctx.method} ${ctx.url}`);
      if (ctx.method === 'POST' && ctx.url.includes('/api/')) {
        console.log('POST请求体:', JSON.stringify(ctx.request.body));
      }
      await next();
    });

    // 注册生命周期钩子
    strapi.db.lifecycles.subscribe({
      models: ['*'], // 监听全部模型

      async afterCreate(event) {
        const modelUid = event.model.uid;
        console.log('🔥 afterCreate fired for:', modelUid);

        // 只对指定模型触发邮件
        if (modelUid === 'api::form-submission.form-submission') {
          console.log('📨 表单提交成功，准备发送提醒邮件...');

          try {
            await strapi.plugin('email').service('email').send({
              to: ['libei002@gmail.com', '229678@qq.com'],
              from: process.env.SMTP_USER,
              subject: '📩 有新表单提交啦！',
              html: '<p>请尽快登录后台查看详情。</p>',
            });

            strapi.log.info('✅ 邮件提醒已发送');
          } catch (err) {
            strapi.log.error('❌ 邮件发送失败:', err);
          }
        }
      }
    });
  },
};
