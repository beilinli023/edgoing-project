
import { toast } from "sonner";
import { BlogContent, BlogHero, BlogVideo, BlogCategory } from "@/types/blogTypes";
import { defaultContent } from "@/data/blogDefaultData";
import { useBlogPosts, useBlogPageSettings, useBlogFeaturedVideos } from "./index";

// API 响应类型接口
interface ApiHeroResponse {
  title?: string;
  title_en?: string;
  title_zh?: string;
  subtitle?: string;
  subtitle_en?: string;
  subtitle_zh?: string;
  background_image?: string;
}

interface ApiVideoResponse {
  id?: string;
  title?: string;
  title_en?: string;
  title_zh?: string;
  youtube_url?: string;
  thumbnail?: string;
  category?: string | {
    id: string | number;
    name_en: string;
    name_zh: string;
    slug: string;
  };
}

interface UseBlogDataProps {
  language: string;
  page?: number;
  limit?: number;
}

/**
 * 使用 React Query 获取博客数据的 hook
 * 整合了博客文章列表、页面设置和精选视频数据
 * 
 * @param {UseBlogDataProps} props - 配置参数
 * @returns {Object} 包含博客内容、加载状态和错误信息的对象
 */
export const useBlogData = ({ language, page = 1, limit = 6 }: UseBlogDataProps) => {
  // 使用 React Query hooks 获取数据
  const { 
    data: posts = [], 
    isLoading: postsLoading, 
    error: postsError 
  } = useBlogPosts(language, page, limit);
  
  const { 
    data: pageSettings, 
    isLoading: settingsLoading, 
    error: settingsError 
  } = useBlogPageSettings(language);
  
  const { 
    data: videos = [], 
    isLoading: videosLoading, 
    error: videosError 
  } = useBlogFeaturedVideos(language);

  // 合并数据并确保类型正确
  const blogContent: BlogContent = {
    ...defaultContent,
    posts: Array.isArray(posts) ? posts : defaultContent.posts,
    hero: pageSettings?.hero ? {
      title_en: (pageSettings.hero as ApiHeroResponse).title_en || (pageSettings.hero as ApiHeroResponse).title || '',
      title_zh: (pageSettings.hero as ApiHeroResponse).title_zh || (pageSettings.hero as ApiHeroResponse).title || '',
      subtitle_en: (pageSettings.hero as ApiHeroResponse).subtitle_en || (pageSettings.hero as ApiHeroResponse).subtitle || '',
      subtitle_zh: (pageSettings.hero as ApiHeroResponse).subtitle_zh || (pageSettings.hero as ApiHeroResponse).subtitle || '',
      background_image: (pageSettings.hero as ApiHeroResponse).background_image || ''
    } as BlogHero : defaultContent.hero,
    videos: Array.isArray(videos) ? videos.map(video => {
      const videoData = video as ApiVideoResponse;
      let category: BlogCategory | undefined;
      
      // 处理 category 属性，确保它是 BlogCategory 类型
      if (typeof videoData.category === 'object' && videoData.category) {
        category = {
          id: videoData.category.id || '',
          name_en: videoData.category.name_en || '',
          name_zh: videoData.category.name_zh || '',
          slug: videoData.category.slug || ''
        };
      } else if (videoData.category) {
        // 如果 category 是字符串，创建一个简单的 BlogCategory 对象
        category = {
          id: '0',
          name_en: String(videoData.category),
          name_zh: String(videoData.category),
          slug: String(videoData.category).toLowerCase().replace(/\s+/g, '-')
        };
      }
      
      return {
        id: videoData.id || '',
        title_en: videoData.title_en || videoData.title || '',
        title_zh: videoData.title_zh || videoData.title || '',
        youtube_url: videoData.youtube_url || '',
        thumbnail: videoData.thumbnail || '',
        category
      } as BlogVideo;
    }) : defaultContent.videos
  };

  // 整合加载状态和错误信息
  const isLoading = postsLoading || settingsLoading || videosLoading;
  const error = postsError || settingsError || videosError ? "Failed to load blog content" : null;
  
  // 调试日志
  console.log("Blog data loaded:", { 
    postsLoaded: !!posts && Array.isArray(posts), 
    settingsLoaded: !!pageSettings,
    videosLoaded: !!videos && Array.isArray(videos)
  });

  // 如果有错误，显示提示
  if (error && !isLoading) {
    console.error("Error fetching blog content:", { postsError, settingsError, videosError });
    toast.error(language === 'zh' ? "加载失败" : "Loading Failed", {
      description: language === 'zh' ? "无法从服务器获取博客内容，显示默认内容" : "Unable to fetch blog content from server, displaying default content"
    });
  }

  return {
    blogContent,
    isLoading,
    error
  };
};
