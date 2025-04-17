import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getBlogPosts, getBlogPostBySlug, getBlogCategories, getBlogTags, getBlogFeaturedVideos, getBlogPageSettings } from '../services/frontend/blogService';
import { useErrorHandler } from './useErrorHandler';
import { useEffect } from 'react';
import { BlogPost } from '@/types/blogTypes'; // Import BlogPost type

/**
 * 获取博客文章列表的自定义Hook
 * @param {string} language - 语言，默认为'en'
 * @param {number} page - 页码，默认为1
 * @param {number} limit - 每页文章数量，默认为10
 * @param {string} category - 可选，按分类筛选
 * @param {string} tag - 可选，按标签筛选
 * @returns {Object} 包含博客文章数据、加载状态和错误信息的对象
 */
/**
 * 预取下一页的博客文章数据
 * @param language - 语言
 * @param page - 当前页码
 * @param limit - 每页数量
 * @param category - 分类
 * @param tag - 标签
 */
function prefetchNextPagePosts(queryClient: ReturnType<typeof useQueryClient>, language: string, page: number, limit: number, category?: string, tag?: string) {
  const nextPage = page + 1;
  queryClient.prefetchQuery({
    queryKey: ['blogPosts', { language, page: nextPage, limit, category, tag }],
    queryFn: () => getBlogPosts(language, nextPage, limit, category, tag),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * 预取博客分类和标签数据
 * @param queryClient - React Query 客户端实例
 * @param language - 语言
 */
function prefetchCategoriesAndTags(queryClient: ReturnType<typeof useQueryClient>, language: string) {
  queryClient.prefetchQuery({
    queryKey: ['blogCategories', language],
    queryFn: () => getBlogCategories(language),
    staleTime: 24 * 60 * 60 * 1000,
  });

  queryClient.prefetchQuery({
    queryKey: ['blogTags', language],
    queryFn: () => getBlogTags(language),
    staleTime: 24 * 60 * 60 * 1000,
  });
}

export function useBlogPosts(language = 'en', page = 1, limit = 10, category?: string, tag?: string) {
  const queryClient = useQueryClient();

  // 当进入博客列表页时，预取分类和标签数据
  useEffect(() => {
    prefetchCategoriesAndTags(queryClient, language);
  }, [queryClient, language]);

  // 当加载当前页时，预取下一页数据
  useEffect(() => {
    prefetchNextPagePosts(queryClient, language, page, limit, category, tag);
  }, [queryClient, language, page, limit, category, tag]);
  const result = useQuery({
    queryKey: ['blogPosts', { language, page, limit, category, tag }],
    queryFn: () => getBlogPosts(language, page, limit, category, tag),
    staleTime: 5 * 60 * 1000, // 5分钟内数据不会被标记为过期
    gcTime: 30 * 60 * 1000, // 30分钟内缓存数据不会被垃圾回收
    retry: 2, // 失败时最多重试2次
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // 指数退避策略
    refetchOnWindowFocus: false, // 窗口聚焦时不自动重新获取数据
  });

  return useErrorHandler(result, {
    showNotification: true,
    retryable: true,
  });
}

/**
 * 获取单篇博客文章详情的自定义Hook
 * @param {string} slugOrId - 博客文章的slug或ID
 * @param {string} language - 语言，默认为'en'
 * @returns {Object} 包含博客文章详情、加载状态和错误信息的对象
 */
/**
 * 预取特定的博客文章
 * @param queryClient - React Query 客户端实例
 * @param slugOrId - 博客文章的 slug 或 ID
 * @param language - 语言
 */
function prefetchBlogPost(queryClient: ReturnType<typeof useQueryClient>, slugOrId: string, language: string) {
  queryClient.prefetchQuery({
    queryKey: ['blogPost', slugOrId, language],
    queryFn: () => getBlogPostBySlug(slugOrId, language),
    staleTime: 10 * 60 * 1000,
  });
}

export function useBlogPost(slugOrId: string, language = 'en') {
  // Restore V18 Log
  console.log(`✅️ [useBlog V18 - RESTORED] useBlogPost ENTERED with: slugOrId=${slugOrId}, language=${language}`);

  // Restore hook calls
  const queryClient = useQueryClient(); 
  const queryKey = ['blogPost', slugOrId, language];
  const enabled = !!slugOrId;
  
  // Restore V19 minimal queryFn
  const queryFn = async (): Promise<BlogPost | null> => { 
      console.log(`✅️ [useBlog V19 - RESTORED] Minimal queryFn executing for key [${queryKey.join(', ')}]`);
      await new Promise(resolve => setTimeout(resolve, 50)); 
      const minimalData: BlogPost = {
          id: slugOrId, 
          slug: slugOrId,
          publishedAt: new Date().toISOString(),
          authorName: 'Test Author',
          title_en: 'Test Title EN',
          title_zh: '测试标题 ZH',
          content_en: [{type: 'paragraph', children:[{type:'text', text:'Test content EN'}]}],
          content_zh: [{type: 'paragraph', children:[{type:'text', text:'测试内容 ZH'}]}],
          grade_en: 'Test Grade EN',
          grade_zh: '测试年级 ZH',
          program_type_en: 'Test Program EN',
          program_type_zh: '测试项目 ZH',
          featured_image: null,
          slideshow: []
      };
      console.log(`✅️ [useBlog V19 - RESTORED] Minimal queryFn returning data for key [${queryKey.join(', ')}]`, minimalData);
      return minimalData;
  };

  // Restore useQuery call
  const result = useQuery<BlogPost | null>({ 
    queryKey: queryKey,
    queryFn: queryFn, 
    enabled: enabled, 
    staleTime: 10 * 60 * 1000, 
    gcTime: 60 * 60 * 1000, 
    retry: 0, 
    refetchOnWindowFocus: false,
  });

  // Restore V19 CHECK Log
  if (!queryClient) {
       console.error('🔴 [useBlog V19 CHECK - RESTORED] queryClient instance is falsy AFTER calling useQueryClient!');
  } else {
       console.log('✅️ [useBlog V19 CHECK - RESTORED] queryClient instance seems valid.');
  }

  // Restore V10 Log
  console.log('[useBlog V10 - RESTORED] Called useQuery with:', { queryKey, enabled });

  // Restore V15 Log
  console.log(`✅️ [useBlog V15 - RESTORED] useQuery state for key [${queryKey.join(', ')}]:`, {
      status: result?.status, 
      isFetching: result?.isFetching,
      isLoading: result?.isLoading,
      isSuccess: result?.isSuccess,
      isError: result?.isError,
      error: result?.error,
      dataUpdatedAt: result?.dataUpdatedAt ? new Date(result.dataUpdatedAt).toLocaleTimeString() : 'N/A',
      hasData: !!result?.data
  });
  if (result?.isSuccess && !result?.data) {
      console.warn(`✅️ [useBlog V15 - RESTORED] Query for [${queryKey.join(', ')}] isSuccess but data is falsy!`, result.data);
  }

  // Restore V16 bypass logic
  console.log('✅️ [useBlog V16 - RESTORED] Bypassing useErrorHandler, returning raw useQuery result.');
  return result;
}

/**
 * 获取博客分类的自定义Hook
 * @param {string} language - 语言，默认为'en'
 * @returns {Object} 包含博客分类数据、加载状态和错误信息的对象
 */
export function useBlogCategories(language = 'en') {
  const result = useQuery({
    queryKey: ['blogCategories', language],
    queryFn: () => getBlogCategories(language),
    staleTime: 24 * 60 * 60 * 1000, // 24小时内数据不会被标记为过期
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7天内缓存数据不会被垃圾回收
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
  });

  return useErrorHandler(result, {
    showNotification: true,
    retryable: true,
  });
}

/**
 * 获取博客标签的自定义Hook
 * @param {string} language - 语言，默认为'en'
 * @returns {Object} 包含博客标签数据、加载状态和错误信息的对象
 */
export function useBlogTags(language = 'en') {
  const result = useQuery({
    queryKey: ['blogTags', language],
    queryFn: () => getBlogTags(language),
    staleTime: 24 * 60 * 60 * 1000, // 24小时内数据不会被标记为过期
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7天内缓存数据不会被垃圾回收
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
  });

  return useErrorHandler(result, {
    showNotification: true,
    retryable: true,
  });
}

/**
 * 获取博客精选视频的自定义Hook
 * @param {string} language - 语言，默认为'en'
 * @param {number} limit - 限制返回的视频数量，默认为3
 * @returns {Object} 包含博客精选视频数据、加载状态和错误信息的对象
 */
export function useBlogFeaturedVideos(language = 'en', limit = 3) {
  const result = useQuery({
    queryKey: ['blogFeaturedVideos', language, limit],
    queryFn: () => getBlogFeaturedVideos(language, limit),
    staleTime: 10 * 60 * 1000, // 10分钟内数据不会被标记为过期
    gcTime: 60 * 60 * 1000, // 1小时内缓存数据不会被垃圾回收
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
  });

  return useErrorHandler(result, {
    showNotification: true,
    retryable: true,
  });
}

/**
 * 获取博客页面设置的自定义Hook
 * @param {string} language - 语言，默认为'en'
 * @returns {Object} 包含博客页面设置数据、加载状态和错误信息的对象
 */
export function useBlogPageSettings(language = 'en') {
  const result = useQuery({
    queryKey: ['blogPageSettings', language],
    queryFn: () => getBlogPageSettings(language),
    staleTime: 24 * 60 * 60 * 1000, // 24小时内数据不会被标记为过期
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7天内缓存数据不会被垃圾回收
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
  });

  return useErrorHandler(result, {
    showNotification: true,
    retryable: true,
  });
}
