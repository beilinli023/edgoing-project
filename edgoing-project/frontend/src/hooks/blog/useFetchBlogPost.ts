import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { BlogPost } from "@/types/blogTypes";
import blogService from '@/services/frontend/blogService';
import { mockPost } from "./mockBlogPost";

/**
 * Hook for fetching a blog post by slug or id
 */
export const useFetchBlogPost = (idOrSlug: string | undefined, currentLanguage: string) => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!idOrSlug) {
        console.error("No identifier provided to useFetchBlogPost");
        setError("No ID or slug provided");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        console.log(`Fetching blog post with identifier: ${idOrSlug}, language: ${currentLanguage}`);
        
        // 添加错误处理，防止API返回HTML而不是JSON
        let data = null;
        try {
          // Try to get post by ID first, then by slug if that fails
          data = await blogService.getBlogPostBySlug(idOrSlug, currentLanguage);
        } catch (fetchError) {
          console.warn(`获取博客文章(Slug: ${idOrSlug})失败:`, fetchError);
          // 不抛出错误，继续尝试下一个方法
        }
        
        if (!data) {
          try {
            // If slug fetch fails, try using the postService directly which can handle both ID and slug
            console.log(`Trying alternative fetch method for: ${idOrSlug}`);
            const postService = await import('@/services/blog/postService');
            data = await postService.getBlogPostById(idOrSlug, currentLanguage);
          } catch (fetchError) {
            console.warn(`获取博客文章(ID: ${idOrSlug})失败:`, fetchError);
            // 不抛出错误，继续使用模拟数据
          }
        }
        
        if (data) {
          console.log("Successfully fetched blog post:", data);
          
          // Transform API response to match BlogPost type
          const transformedPost: BlogPost = {
            id: data.id,
            title_en: data.title_en || (currentLanguage === 'en' && data.title ? data.title : ''),
            title_zh: data.title_zh || (currentLanguage === 'zh' && data.title ? data.title : ''),
            slug: data.slug || idOrSlug,
            content_en: data.content_en || (currentLanguage === 'en' && data.content ? data.content : ''),
            content_zh: data.content_zh || (currentLanguage === 'zh' && data.content ? data.content : ''),
            excerpt_en: data.excerpt_en || (currentLanguage === 'en' && data.excerpt ? data.excerpt : ''),
            excerpt_zh: data.excerpt_zh || (currentLanguage === 'zh' && data.excerpt ? data.excerpt : ''),
            featured_image: data.featured_image,
            status: data.status || 'published',
            published_at: data.published_at || '',
            author: data.author || '',
            date: data.date || data.published_at || '',
            category: data.category || data.primary_category || '',
            primary_category: data.primary_category,
            tags: data.tags || []
          };
          
          setPost(transformedPost);
          setError(null);
        } else {
          console.log("No blog post data returned, using mock data");
          // 使用 mockPost 并确保图片 URL 正确
          const mockPostWithUpdatedImage = {
            ...mockPost,
            featured_image: mockPost.featured_image
          };
          setPost(mockPostWithUpdatedImage);
          setError("Unable to load post from API, showing mock data");
          toast({
            title: currentLanguage === 'zh' ? "无法加载文章" : "Unable to load article",
            description: currentLanguage === 'zh' ? "使用默认文章内容" : "Using default article content",
            variant: "destructive"
          });
        }
      } catch (err) {
        console.error("Failed to fetch blog post:", err);
        setError("Failed to load blog post");
        // 使用 mockPost 并确保图片 URL 正确
        const mockPostWithUpdatedImage = {
          ...mockPost,
          featured_image: mockPost.featured_image
        };
        setPost(mockPostWithUpdatedImage);
        
        // 减少重复的错误提示，只在开发环境显示toast
        if (process.env.NODE_ENV === 'development') {
          toast({
            title: currentLanguage === 'zh' ? "使用模拟数据" : "Using mock data",
            description: currentLanguage === 'zh' ? "已加载默认文章内容" : "Default article content loaded",
            variant: "default"
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [idOrSlug, currentLanguage]);

  return {
    post,
    isLoading,
    error
  };
};
