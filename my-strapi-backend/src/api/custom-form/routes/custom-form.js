'use strict';

/**
 * custom-form router
 */

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/api/custom-form/submit',
      handler: 'custom-form.submit',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
