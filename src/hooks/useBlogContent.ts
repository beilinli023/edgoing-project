import { useLanguage } from "@/context/LanguageContext";
import { useBlogData } from "./useBlogData";
import { useBlogPagination } from "./useBlogPagination";
import { 
  calculateTotalPages, 
  getLocalizedBlogText, 
  getPaginatedPosts, 
  findPostBySlug,
  normalizeTags,
  getNormalizedPost,
  getImageUrl
} from "@/utils/blogUtils";
import { BlogPost, BlogTag, BlogHero, BlogVideo, BlogContent } from "@/types/blogTypes";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import localBlogService from "@/services/blog/localBlogService";

/**
 * 博客内容的主要 hook，组合其他 hooks 和工具函数
 * 使用 React Query 的 hooks 获取数据，并处理分页、本地化等逻辑
 * 增加了本地数据回退机制，当API不可用时自动使用本地数据
 */
export const useBlogContent = () => {
  const { currentLanguage } = useLanguage();
  const queryClient = useQueryClient();
  
  // 使用正确的类型定义
  const [localData, setLocalData] = useState<BlogContent>({
    posts: [],
    hero: {
      title_en: 'Blog',
      title_zh: '博客',
      background_image: '/Edgoing/Blog_Page/Heading1.jpg'
    },
    videos: []
  });
  const [isUsingLocalData, setIsUsingLocalData] = useState(false);
  
  // 使用改造后的 useBlogData 获取博客数据
  const { blogContent, isLoading, error } = useBlogData({ 
    language: currentLanguage 
  });
  
  // 当API请求出错时尝试加载本地数据
  useEffect(() => {
    if (error && !isUsingLocalData) {
      const loadLocalData = async () => {
        try {
          console.log("API错误，尝试加载本地博客数据...");
          // 加载本地博客文章
          const postsData = await localBlogService.getLocalBlogPosts(currentLanguage);
          // 加载本地页面设置
          const settings = await localBlogService.getLocalBlogPageSettings(currentLanguage);
          
          setLocalData({
            posts: postsData.posts || [],
            hero: settings.hero || {
              title_en: 'Blog',
              title_zh: '博客',
              background_image: '/images/blog/blog-hero.jpg'
            },
            videos: []
          });
          setIsUsingLocalData(true);
          console.log("成功加载本地博客数据");
        } catch (localError) {
          console.error("加载本地博客数据失败:", localError);
        }
      };
      
      loadLocalData();
    }
  }, [error, isUsingLocalData, currentLanguage]);
  
  // 选择使用API数据或本地数据
  const effectiveBlogContent = isUsingLocalData ? localData : blogContent;
  
  // Calculate total pages based on posts with 5 posts per page
  const totalPages = calculateTotalPages(effectiveBlogContent.posts || [], 5);
  
  // Handle pagination
  const { currentPage, goToNextPage, goToPreviousPage, goToPage } = useBlogPagination({
    totalPages
  });
  
  // Get localized text helper
  const getLocalizedText = (en: string, zh: string) => {
    return getLocalizedBlogText(en, zh, currentLanguage);
  };
  
  // Get posts for current page (5 posts per page)
  const getCurrentPagePosts = () => {
    return getPaginatedPosts(effectiveBlogContent.posts || [], currentPage, 5);
  };
  
  // Find a specific post by slug
  const findPostBySlugHelper = (slug: string) => {
    return findPostBySlug(effectiveBlogContent.posts, slug);
  };
  
  // Normalize tags across all posts
  const getAllTags = (): BlogTag[] => {
    return normalizeTags(effectiveBlogContent.posts || []);
  };
  
  // Get a normalized post
  const getNormalizedPostHelper = (post: BlogPost) => {
    return getNormalizedPost(post, currentLanguage);
  };
  
  // Prefetch posts data
  useEffect(() => {
    // 当使用本地数据时，不需要进行预抓取
    if (!isUsingLocalData && totalPages > 1 && currentPage < totalPages) {
      // Prefetch next page to improve UX
      const nextPage = currentPage + 1;
      // Implement prefetch logic
      console.log(`Prefetching page ${nextPage}`);
    }
  }, [currentPage, totalPages, isUsingLocalData]);

  // Return all needed data and functions
  return {
    blogContent: effectiveBlogContent,
    currentPagePosts: getCurrentPagePosts(),
    isLoading: isLoading && !isUsingLocalData,
    error: error && !isUsingLocalData,
    totalPages,
    currentPage,
    getLocalizedText,
    goToNextPage,
    goToPreviousPage,
    goToPage,
    findPostBySlug: findPostBySlugHelper,
    getAllTags,
    getNormalizedPost: getNormalizedPostHelper,
    getImageUrl
  };
};
