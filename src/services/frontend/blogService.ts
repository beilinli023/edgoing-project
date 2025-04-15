import apiClient from '../api/apiClient';
// 注释掉未使用的 Strapi 特定类型导入
// import { BlogPost, BlogCategory, BlogTag, BlogVideo, BlogHero, BlogContent, StrapiDataItem, StrapiResponse } from '@/types/blogTypes';
import { BlogPost, BlogCategory, BlogTag, BlogVideo, BlogHero, BlogContent } from '@/types/blogTypes';
import localBlogService from '../blog/localBlogService';
import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';

// Define SocialLink interface
interface SocialLink {
  url: string;
  name?: string; // Assuming name might be present
  icon?: string; // Assuming icon might be present
}

// Helper function to check for Blog Posts API format (custom format with posts array)
// Keep isPostsResponse as it might still be useful elsewhere or for future refactoring
function isPostsResponse(data: unknown): data is { posts: unknown[] } {
  return (
    typeof data === 'object' &&
    data !== null &&
    'posts' in data &&
    Array.isArray((data as { posts: unknown[] }).posts)
  );
}

/**
 * 通用数据获取函数 - 处理静态数据和API回退逻辑
 * NOTE: This is kept for now as other functions might use it for localBlogService fallback.
 */
const getDataWithFallback = async <T>(
  apiCall: () => Promise<T>,
  localDataCall: () => Promise<T>,
  resourceName: string
): Promise<T> => {
  try {
    return await apiCall();
  } catch (error) {
    console.error(`Error fetching ${resourceName}:`, error);
    console.info(`Falling back to local ${resourceName} data`);
    return localDataCall();
  }
};

/**
 * 获取博客内容
 * NOTE: Still uses getDataWithFallback for localBlogService
 */
export const getBlogContent = async (language = 'en'): Promise<BlogContent> => {
  const getLocalBlogContentData = async () => {
    // 修正：不传递 language 参数给 getLocalBlogPosts，而是使用默认参数
    const posts = await localBlogService.getLocalBlogPosts();
    const settings = await localBlogService.getLocalBlogPageSettings();
    const videos = await localBlogService.getLocalBlogVideos();

    return {
      posts: posts.posts || [],
      hero: settings.hero || {
        title_en: 'View Blog',
        title_zh: '浏览博客',
        subtitle_en: '',
        subtitle_zh: '',
        background_image: '/images/blog/blog-hero.jpg'
      },
      videos: videos || []
    };
  };

  return getDataWithFallback(
    async () => {
      const response: AxiosResponse<{ posts?: BlogPost[] }> = await apiClient.get('/api/blog', { params: { language } });
      const responseData = response.data;

      const posts: BlogPost[] = (responseData && Array.isArray(responseData.posts)) ? responseData.posts : [];
      if (!posts.length) {
        console.warn('Could not extract posts from API response in getBlogContent', responseData);
      }

      // 转换API响应以匹配BlogContent格式
      return {
        posts: posts, // Use extracted posts
        hero: {
          title_en: 'View Blog',
          title_zh: '浏览博客',
          subtitle_en: 'Explore our latest articles',
          subtitle_zh: '探索我们的最新文章',
          background_image: '/images/blog/blog-hero.jpg'
        },
        videos: [] // Placeholder for videos
      } as BlogContent;
    },
    getLocalBlogContentData,
    'blog content'
  );
};

/**
 * Fetch Blog Posts with Pagination (Final Corrected Logic)
 */
export const getBlogPosts = async (
  language = 'en',
  page = 1,
  limit = 6,
  category?: string,
  tag?: string,
  sortBy?: string,
  searchTerm?: string
): Promise<{ posts: BlogPost[]; totalPosts: number; totalPages: number; currentPage: number; }> => {

  const params: Record<string, string | number | boolean> = { page, limit };
  if (language === 'zh') { Object.assign(params, { locale: 'zh' }); }
  else { Object.assign(params, { locale: 'en' }); }
  if (category) { params.category = category; }
  if (tag) { params.tag = tag; }
  if (sortBy) { params.sort = sortBy; }
  if (searchTerm) { params.search = searchTerm; }

  console.log('请求博客列表，参数:', params);

  try {
    const apiUrl = `/api/blog`;
    console.log(`请求API路径: ${apiUrl}, 语言=${language}, 页码=${page}, 限制=${limit}`);

    // 注意：我们直接使用axios而不是apiClient，因为apiClient可能存在配置问题
    // 这是一个稳定的解决方案，确保数据能够正确获取
    const axiosResponse = await axios.get(`http://localhost:3001/api/blog`, { params });

    // 使用axios响应数据
    const responseData = axiosResponse.data;

    // --- 更新调试日志，现在直接打印 responseData ---
    console.log('\n[DEBUG][getBlogPosts] ===== 博客API响应详细日志 =====');
    console.log('[DEBUG][getBlogPosts] 原始响应数据:', JSON.stringify(responseData, null, 2));
    console.log('[DEBUG][getBlogPosts] 数据类型:', typeof responseData);
    if (responseData && typeof responseData === 'object') {
      console.log('[DEBUG][getBlogPosts] 是否有posts属性:', 'posts' in responseData);
      console.log('[DEBUG][getBlogPosts] posts属性值:', responseData.posts);
      console.log('[DEBUG][getBlogPosts] posts是否为数组:', Array.isArray(responseData.posts));
      if (Array.isArray(responseData.posts)) {
        console.log('[DEBUG][getBlogPosts] posts数组长度:', responseData.posts.length);
        console.log('[DEBUG][getBlogPosts] posts第一项数据示例:', responseData.posts[0] ? JSON.stringify(responseData.posts[0], null, 2) : 'N/A');
      }
      console.log('[DEBUG][getBlogPosts] totalPages值:', responseData.totalPages);
      console.log('[DEBUG][getBlogPosts] totalPosts值:', responseData.totalPosts);
    }
    console.log('[DEBUG][getBlogPosts] ===== 博客API响应日志结束 =====\n');
    // --- 结束调试日志 ---

    if (!responseData || typeof responseData !== 'object' || !Array.isArray(responseData.posts)) {
      console.error('API 返回的数据格式不正确或缺少 posts 数组, 返回空列表', responseData);
      return { posts: [], totalPosts: 0, totalPages: 0, currentPage: page };
    }

    const postsFromApi = responseData.posts;
    const totalPosts = responseData.totalPosts ?? 0;
    const totalPages = responseData.totalPages ?? 0;

    console.log(`从 API 获取到 ${postsFromApi.length} 篇文章, 总文章数: ${totalPosts}, 总页数: ${totalPages}`);

    return {
        posts: postsFromApi,
        totalPosts: totalPosts,
        totalPages: totalPages,
        currentPage: page
    };

  } catch (error) {
    console.error('从API获取博客列表失败, 返回空列表:', error);
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
    } else {
      console.error('Non-Axios error:', error);
    }
    return { posts: [], totalPosts: 0, totalPages: 0, currentPage: page };
  }
};

/**
 * 获取特定博客文章（支持通过slug或id）
 */
export const getBlogPostBySlug = async (
  slugOrId: string,
  language = 'en',
  includeRelated = false,
  preview = false
): Promise<BlogPost | null> => {
  console.log(`正在获取博客文章: ${slugOrId}, 语言: ${language}, 包含相关文章: ${includeRelated}, 预览模式: ${preview}`);

  const params: Record<string, string | boolean> = {
      includeRelated,
      preview
  };

  if (language === 'zh') {
    Object.assign(params, { locale: 'zh' });
  } else {
    Object.assign(params, { locale: 'en' });
  }

  try {
    // 修复：移除重复的/api前缀，因为apiClient已经配置了baseURL为'/api'
    const postData: BlogPost | null = await apiClient.get<BlogPost | null>(`blog/${slugOrId}`, { params });
    // const response = await apiClient.get(...); // No longer needed
    // const postData = response.data; // Incorrect: response IS the data now

    // Log the actual data received
    console.log('[DEBUG] getBlogPostBySlug - Checking postData (received directly):', {
        type: typeof postData,
        isNull: postData === null,
        hasIdProperty: postData ? Object.hasOwnProperty.call(postData, 'id') : 'N/A',
        idValue: (typeof postData === 'object' && postData !== null) ? (postData as BlogPost).id : 'N/A',
        value: JSON.stringify(postData)
    });

    // The check should now work correctly with the actual data object
    if (typeof postData !== 'object' || postData === null || !postData.id) {
      console.warn(`未找到 Slug/ID 为 '${slugOrId}' 的博客文章 (或返回数据结构无效)`);
      return null;
    }

    console.log(`成功获取博客文章: ${slugOrId}`);
    return postData;
  } catch (error) {
    // Log the error caught here
    console.error(`获取博客文章 '${slugOrId}' 失败:`, error);
    if (axios.isAxiosError(error)) {
        console.error('Axios error details:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
    } else if (error instanceof Error) {
        console.error('Error details:', { name: error.name, message: error.message, stack: error.stack });
    } else {
        console.error('Unknown error object:', error);
    }
    return null;
  }
};

/**
 * 获取博客分类
 */
export const getBlogCategories = async (language = 'en'): Promise<BlogCategory[]> => {
  console.warn('getBlogCategories using placeholder implementation');
  // Placeholder: Replace with actual API call to /proxy/blog/categories or similar
  return [];
};

/**
 * 获取博客标签
 */
export const getBlogTags = async (language = 'en'): Promise<BlogTag[]> => {
  console.warn('getBlogTags using placeholder implementation');
  // Placeholder: Replace with actual API call to /proxy/blog/tags or similar
  return [];
};

/**
 * 获取博客精选视频
 */
export const getBlogFeaturedVideos = async (language = 'en', limit = 3): Promise<BlogVideo[]> => {
  console.warn('getBlogFeaturedVideos using placeholder implementation');
  // Placeholder: Replace with actual API call, maybe requires specific endpoint
  return [];
};

// Type for the expected structure of the settings API response data
interface BlogPageSettingsData {
  hero?: Partial<BlogHero>; // Allow partial hero data
  social_links?: SocialLink[];
  // Add other potential fields like featured_categories if they exist
}

/**
 * 获取博客页面设置
 */
export const getBlogPageSettings = async (language = 'en'): Promise<{ hero: BlogHero; /* featured_categories: BlogCategory[]; social_links: SocialLink[]; */ }> => { // 暂时注释掉缺失的类型
  const getBlogPageSettingsFromApi = async () => {
    try {
      console.log('Attempting to fetch blog page settings from API');
      const response: AxiosResponse<BlogPageSettingsData | null> = await apiClient.get('/api/blog-page-settings', { params: { language } });
      const data = response.data;

      if (!data) {
        console.warn('API returned no data for blog page settings.');
        // Return a default structure matching the Promise return type (excluding commented out parts)
        return {
            hero: { title_en: 'Blog', title_zh: '博客' } as BlogHero,
            // featured_categories: [],
            // social_links: []
        };
      }
      console.log('Successfully fetched blog page settings from API:', data);

      // Process and return data matching the Promise return type
      const result = {
        hero: data.hero || { title_en: 'Blog', title_zh: '博客' },
        // featured_categories: data.featured_categories || [], // Assuming featured_categories exists in BlogPageSettingsData
        // social_links: data.social_links || []
      } as { hero: BlogHero; /* featured_categories: BlogCategory[]; social_links: SocialLink[]; */ };
      return result;

    } catch (error) {
      console.error('Failed to fetch blog page settings from API:', error);
      // Return a default structure matching the Promise return type on error
       return {
            hero: { title_en: 'Blog', title_zh: '博客' } as BlogHero,
            // featured_categories: [],
            // social_links: []
       };
    }
  };

  const getLocalBlogPageSettingsData = async (): Promise<{ hero: BlogHero; /* featured_categories: BlogCategory[]; social_links: SocialLink[]; */ }> => {
    const settings = await localBlogService.getLocalBlogPageSettings();
    const defaultHero: BlogHero = {
        title_en: 'View Blog', title_zh: '浏览博客',
        subtitle_en: '', subtitle_zh: '',
        background_image: '/images/blog/blog-hero.jpg'
      };
     return {
       hero: settings.hero || defaultHero,
       // featured_categories: settings.featured_categories || [], // Removed
       // social_links: settings.social_links || [] // Removed
     };
  };

  return getDataWithFallback(
    getBlogPageSettingsFromApi,
    getLocalBlogPageSettingsData,
    'blog page settings'
  );
};

export default {
  getBlogContent,
  getBlogPosts,
  getBlogPostBySlug,
  getBlogCategories,
  getBlogTags,
  getBlogFeaturedVideos,
  getBlogPageSettings
};
