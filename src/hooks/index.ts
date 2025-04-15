// 统一导出所有自定义 hooks
export * from './useBlog';
export * from './useProgram';
export * from './useStudyAbroad';
export * from './useForm';
export * from './useBlogPostDetail';
export * from './useFrontendFeaturedPrograms';
export * from './useFrontendFooter';

// 可以在这里添加其他通用 hooks

// 导出所有钩子，便于集中导入
export { 
  useBlogPosts, 
  useBlogPostsLegacy
} from './useBlogPosts';
export type { 
  BlogPostsQueryParams, 
  BlogSortOption 
} from './useBlogPosts';

export { 
  useBlogPostBySlug, 
  useBlogPostBySlugLegacy
} from './useBlogPostBySlug';
export type { 
  BlogPostDetailParams 
} from './useBlogPostBySlug';
