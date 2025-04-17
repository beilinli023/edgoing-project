'use strict';

/**
 * 自定义路由配置
 */

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/api/form-submissions/submit-with-email',
      handler: 'form-submission.submitWithEmail',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
