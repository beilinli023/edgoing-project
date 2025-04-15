/**
 * 认证中间件
 * 用于保护需要登录才能访问的路由
 */

// 检查用户是否已认证
export const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.isAuthenticated) {
    // 用户已登录，允许访问
    return next();
  }

  // 保存用户尝试访问的URL，以便登录后重定向
  req.session.returnTo = req.originalUrl;
  
  // 用户未登录，重定向到登录页面
  res.redirect('/admin/login');
};

// 检查用户是否未认证（用于登录页面等）
export const isNotAuthenticated = (req, res, next) => {
  if (req.session && req.session.isAuthenticated) {
    // 用户已登录，重定向到仪表板
    return res.redirect('/admin/dashboard');
  }
  
  // 用户未登录，允许访问
  next();
};
