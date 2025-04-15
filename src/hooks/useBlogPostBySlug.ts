import { useQuery } from '@tanstack/react-query';
import { getBlogPostBySlug } from '@/services/frontend/blogService';
import { useErrorHandler } from './useErrorHandler';
import { BlogPost } from '@/types/blogTypes';
import { useMemo } from 'react';

// 添加调试函数，不影响现有逻辑
const logPostData = (post: BlogPost | null) => {
  if (!post) {
      console.log('[useBlogPostBySlug logPostData] Post data is null or undefined.');
      return post;
  }
  console.log('=================== [useBlogPostBySlug logPostData] 博客文章调试信息 ===================');
  console.log('字段列表:', Object.keys(post).sort());
  const gradeFields = Object.keys(post).filter(key => key.toLowerCase().includes('grade'));
  const programTypeFields = Object.keys(post).filter(key => key.toLowerCase().includes('program') || key.toLowerCase().includes('project') || key.toLowerCase().includes('type'));
  console.log('年级相关字段:', gradeFields);
  gradeFields.forEach(field => { console.log(`${field}:`, (post as unknown as Record<string, unknown>)[field]); });
  console.log('项目类型相关字段:', programTypeFields);
  programTypeFields.forEach(field => { console.log(`${field}:`, (post as unknown as Record<string, unknown>)[field]); });
  console.log('年级字段值（详细）:');
  if ('grade' in post && post.grade !== undefined && post.grade !== null) {
    console.log(`grade: ${JSON.stringify(post.grade)}`);
  } else {
    console.log('grade: (not present or null/undefined)');
  }
  console.log(`grade_en: ${JSON.stringify(post.grade_en)}`);
  console.log(`grade_zh: ${JSON.stringify(post.grade_zh)}`);
  console.log('项目类型字段值（详细）:');
  if ('program_type' in post && post.program_type !== undefined && post.program_type !== null) {
    console.log(`program_type: ${JSON.stringify(post.program_type)}`);
  } else {
    console.log('program_type: (not present or null/undefined)');
  }
  console.log(`program_type_en: ${JSON.stringify(post.program_type_en)}`);
  console.log(`program_type_zh: ${JSON.stringify(post.program_type_zh)}`);
  return post;
};

/**
 * 博客文章详情查询参数接口
 */
export interface BlogPostDetailParams {
  slugOrId: string;
  language?: string;
  includeRelated?: boolean;
  preview?: boolean;
}

/**
 * 获取单篇博客文章详情的自定义Hook
 * @param {BlogPostDetailParams} params - 博客文章详情查询参数
 * @returns {Object} 包含博客文章详情、加载状态和错误信息的对象
 */
export function useBlogPostBySlug(params: BlogPostDetailParams) {
  const {
    slugOrId,
    language = 'zh',
    includeRelated = false,
    preview = false
  } = params;
  
  // ✅️ V20 Log: Check hook entry and params
  console.log(`✅️ [useBlogPostBySlug V20] ENTERED with params:`, params);

  const queryParams = useMemo(() => ({
    slugOrId,
    language,
    includeRelated,
    preview
  }), [slugOrId, language, includeRelated, preview]);
  
  // ✅️ V21 Log: Check queryKey structure
  const queryKey = ['blogPost', queryParams];
  console.log(`✅️ [useBlogPostBySlug V21] Constructed queryKey:`, queryKey);

  // ✅️ V22 Log: Before calling actual queryFn
  const queryFn = async () => {
    console.log(`✅️ [useBlogPostBySlug V22] Executing queryFn for key:`, queryKey);
    try {
      const post = await getBlogPostBySlug(slugOrId, language, includeRelated, preview);
      console.log(`✅️ [useBlogPostBySlug V22] queryFn received post data:`, post ? `ID: ${post.id}` : post);
      return logPostData(post); // Keep using logPostData
    } catch (error) {
       console.error(`🔴 [useBlogPostBySlug V22] queryFn Error:`, error);
       throw error; // Re-throw error so useQuery handles it
    }
  };

  const result = useQuery<BlogPost | null, Error>({
    queryKey: queryKey,
    queryFn: queryFn,
    enabled: !!slugOrId, 
    staleTime: 10 * 60 * 1000, 
    gcTime: 60 * 60 * 1000,    
    retry: 0, // Set retry to 0 for simpler debugging
    refetchOnWindowFocus: false,
  });
  
  // ✅️ V23 Log: Log the raw result from useQuery
  console.log(`✅️ [useBlogPostBySlug V23] Raw useQuery result:`, {
      status: result?.status,
      isFetching: result?.isFetching,
      isLoading: result?.isLoading,
      isSuccess: result?.isSuccess,
      isError: result?.isError,
      error: result?.error,
      dataUpdatedAt: result?.dataUpdatedAt ? new Date(result.dataUpdatedAt).toLocaleTimeString() : 'N/A',
      hasData: !!result?.data,
      data: result?.data ? `Data ID: ${result.data.id}` : result?.data // Only log ID for brevity
  });

  // --- Restore useErrorHandler --- 
  // console.log('✅️ [useBlogPostBySlug V24] Bypassing useErrorHandler, returning raw useQuery result.');
  // return result;
  
  // Restore Original return with useErrorHandler:
  return useErrorHandler(result, {
    showNotification: true,
    retryable: true, // Keep retryable as true as per original
    fallbackData: null as BlogPost | null,
  });
}

/**
 * 重载版本：支持单独参数的获取单篇博客文章详情的Hook
 * 为了向后兼容保留此版本
 * @param {string} slugOrId - 博客文章的slug或ID
 * @param {string} language - 语言，默认为'zh'
 * @returns {Object} 包含博客文章详情、加载状态和错误信息的对象
 */
export function useBlogPostBySlugLegacy(slugOrId: string, language = 'zh') {
  return useBlogPostBySlug({
    slugOrId,
    language
  });
} 