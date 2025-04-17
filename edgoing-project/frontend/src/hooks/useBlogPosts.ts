import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getBlogPosts } from '@/services/frontend/blogService';
import { useErrorHandler } from './useErrorHandler';
import { useEffect, useMemo } from 'react';
import { BlogPost } from '@/types/blogTypes';

/**
 * 博客文章列表排序选项
 */
export enum BlogSortOption {
  NEWEST = 'publishedAt:desc',
  OLDEST = 'publishedAt:asc',
  TITLE_AZ = 'title:asc',
  TITLE_ZA = 'title:desc'
}

/**
 * 博客文章列表查询参数接口
 */
export interface BlogPostsQueryParams {
  language?: string;
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  sortBy?: BlogSortOption;
  searchTerm?: string;
}

/**
 * 博客文章列表响应接口
 */
export interface BlogPostsResponse {
  posts: BlogPost[];
  totalPosts: number;
  totalPages: number;
  currentPage: number;
}

/**
 * 获取博客文章列表的自定义Hook
 * @param {BlogPostsQueryParams} params - 查询参数对象
 * @returns {Object} 包含博客文章数据、加载状态和错误信息的对象
 */
export function useBlogPosts(params: BlogPostsQueryParams = {}) {
  const {
    language = 'zh',
    page = 1,
    limit = 10,
    category,
    tag,
    sortBy = BlogSortOption.NEWEST,
    searchTerm
  } = params;
  
  const queryClient = useQueryClient();

  // 创建一个稳定的查询参数对象
  const queryParams = useMemo(() => ({
    language,
    page,
    limit,
    category,
    tag,
    sortBy,
    searchTerm
  }), [language, page, limit, category, tag, sortBy, searchTerm]);

  // 预取下一页数据，优化加载体验
  useEffect(() => {
    const nextPage = page + 1;
    queryClient.prefetchQuery({
      queryKey: ['blogPosts', { ...queryParams, page: nextPage }],
      queryFn: () => getBlogPosts(language, nextPage, limit, category, tag, sortBy, searchTerm),
      staleTime: 5 * 60 * 1000,
    });
  }, [queryClient, queryParams, page, limit]);

  const result = useQuery<BlogPostsResponse, Error>({
    queryKey: ['blogPosts', queryParams],
    queryFn: () => getBlogPosts(language, page, limit, category, tag, sortBy, searchTerm),
    staleTime: 5 * 60 * 1000, // 数据5分钟内不过期
    gcTime: 30 * 60 * 1000,   // 缓存保留30分钟
    retry: 2,                  // 失败时重试2次
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
  });

  return useErrorHandler(result, {
    showNotification: true,
    retryable: true,
  });
}

/**
 * 重载版本：支持单独参数的获取博客文章列表的Hook
 * 为了向后兼容保留此版本
 * @param {string} language - 语言，默认为'zh'
 * @param {number} page - 页码，默认为1
 * @param {number} limit - 每页文章数量，默认为10
 * @param {string} category - 可选，按分类筛选
 * @param {string} tag - 可选，按标签筛选
 * @returns {Object} 包含博客文章数据、加载状态和错误信息的对象
 */
export function useBlogPostsLegacy(
  language = 'zh', 
  page = 1, 
  limit = 10, 
  category?: string, 
  tag?: string,
  sortBy = BlogSortOption.NEWEST
) {
  return useBlogPosts({
    language,
    page,
    limit,
    category,
    tag,
    sortBy
  });
} 