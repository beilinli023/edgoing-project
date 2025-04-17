import localBlogService from './localBlogService';

// 只导出localBlogService
export {
  localBlogService
};

// 导出博客服务对象
export const blogService = {
  // 只保留与前端博客列表页面相关的方法
  getLocalBlogPosts: localBlogService.getLocalBlogPosts,
  getLocalBlogPostBySlug: localBlogService.getLocalBlogPostBySlug,
  getLocalBlogPageSettings: localBlogService.getLocalBlogPageSettings,
  getLocalBlogVideos: localBlogService.getLocalBlogVideos
};
