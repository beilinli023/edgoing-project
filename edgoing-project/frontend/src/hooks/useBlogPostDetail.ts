import { useBlogPost } from "./useBlog";
import { useBlogPostFormatter } from "./blog/useBlogPostFormatter";
// import { normalizeTags } from "@/utils/blogUtils";
import { useEffect, useState } from "react";
import { BlogPost } from "@/types/blogTypes";
import localBlogService from "@/services/blog/localBlogService";

/**
 * Hook for blog post detail that composes fetch and formatting functionality
 */
/**
 * Hook for blog post detail that composes React Query fetch and formatting functionality
 * 兼容旧版实现，保留原有格式化逻辑，同时利用 React Query 的缓存机制
 * 增加本地数据回退功能，当API不可用时自动使用本地数据
 */
export const useBlogPostDetail = (id: string | undefined, currentLanguage: string) => {
  console.log(`🔄 useBlogPostDetail hook 被调用: id=${id}, language=${currentLanguage}`);
  
  const { data: post, isLoading: apiLoading, error: apiError } = useBlogPost(id || '', currentLanguage);
  
  // V9 日志在这里，如果上面一行出错或行为异常，就可能执行不到这里
  console.log('[useBlogPostDetail V9] Raw data from useBlogPost:', {
    isLoading: apiLoading,
    hasError: !!apiError,
    postData: post // Log the raw post object directly
  });
  
  // --- Restore Local Fallback & Formatter --- 
  const [localPost, setLocalPost] = useState<BlogPost | null>(null);
  const [isUsingLocalData, setIsUsingLocalData] = useState(false);
  const [internalLoading, setInternalLoading] = useState(true); // Start as true
  
  // Restore local loading effect
  useEffect(() => {
    let isMounted = true;
    if (id) {
      const loadLocalPost = async () => {
        try {
          console.log(`[useBlogPostDetail] Attempting local load: ${id}`);
          const foundPost = await localBlogService.getLocalBlogPostBySlug(id, currentLanguage);
          if (isMounted) {
            if (foundPost) {
              console.log('✅ [useBlogPostDetail] Local post loaded:', foundPost.title_en || foundPost.title_zh);
              setLocalPost(foundPost);
              setIsUsingLocalData(true); 
            } else {
              console.log(`[useBlogPostDetail] Local post not found for: ${id}`);
              setLocalPost(null);
              setIsUsingLocalData(false);
            }
          }
        } catch (localError) {
          console.error("❌ [useBlogPostDetail] Local load failed:", localError);
          if (isMounted) {
             setLocalPost(null); 
             setIsUsingLocalData(false);
          }
        } 
      };
      loadLocalPost();
    }
    return () => { isMounted = false; };
  }, [id, currentLanguage]);
  
  const effectivePost = isUsingLocalData ? localPost : post;
  
  // Restore formatter call
  const {
    localizedTitle,
    localizedContent,
    // backLabel, // Keep commented if not used
    featuredImageUrl,
    slideshowUrls,
    getLocalizedText,
    localizedGrade,
    localizedProgramType
  } = useBlogPostFormatter(effectivePost, currentLanguage);
  
  // Restore internalLoading effect (V7 logic)
  useEffect(() => {
    const isDerivedDataReady = 
      !!localizedTitle && 
      !!featuredImageUrl && 
      !!effectivePost?.publishedAt &&
      !!localizedGrade &&         
      !!localizedProgramType;
    
    // Loading is true if the raw API/hook is loading AND we are not using local data, OR if derived data isn't ready
    const stillLoading = (apiLoading && !isUsingLocalData) || !isDerivedDataReady;
    
    console.log(`[useBlogPostDetail V7 RESTORED] Loading state check: apiLoading=${apiLoading}, isUsingLocalData=${isUsingLocalData}, isDerivedDataReady=${isDerivedDataReady}, finalLoading=${stillLoading}`);
    console.log(`[useBlogPostDetail V7 RESTORED] Readiness Details: title=${!!localizedTitle}, image=${!!featuredImageUrl}, date=${!!effectivePost?.publishedAt}, grade=${!!localizedGrade}, program=${!!localizedProgramType}`);
    
    setInternalLoading(stillLoading);

  }, [
      apiLoading, 
      isUsingLocalData, 
      localizedTitle, 
      featuredImageUrl, 
      effectivePost?.publishedAt, 
      localizedGrade,         
      localizedProgramType
  ]);

  // Keep V8 Formatter Input Log (Optional)
  console.log('[useBlogPostDetail V8 - RESTORED] Calling useBlogPostFormatter with effectivePost:', 
              effectivePost ? `ID: ${effectivePost.id}` : effectivePost);
  console.log('[useBlogPostDetail V8 - RESTORED] effectivePost content for formatter:', {
      grade_en: effectivePost?.grade_en,
      grade_zh: effectivePost?.grade_zh,
      program_type_en: effectivePost?.program_type_en,
      program_type_zh: effectivePost?.program_type_zh
      // Add other relevant fields if needed
  });

  // Restore V14 log - now checking internalLoading
  console.log('✅️ [useBlogPostDetail V14 RESTORED] Returning data with internalLoading:', {
      post: effectivePost,
      isLoading: internalLoading, // Use the calculated internal loading state
      error: apiError,
      localizedTitle, // Return the actual formatted values
      localizedGrade,
      localizedProgramType,
      slideshowUrls
      // Add others as needed
  });

  return {
    post: effectivePost,
    isLoading: internalLoading, // Use calculated loading state
    error: apiError,
    localizedTitle,
    localizedContent,
    featuredImageUrl,
    slideshowUrls,
    getLocalizedText,
    localizedGrade,
    localizedProgramType
  };
};
