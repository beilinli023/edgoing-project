import axios from 'axios';
import { BlogVideo } from '@/types/blogTypes';

/**
 * 获取博客视频列表
 */
export const getBlogVideos = async (
  language = 'en',
  page = 1,
  limit = 2
): Promise<{ videos: BlogVideo[]; totalVideos: number; totalPages: number; currentPage: number; }> => {

  const params: Record<string, string | number | boolean> = { page, limit };
  if (language === 'zh') { Object.assign(params, { locale: 'zh' }); }
  else { Object.assign(params, { locale: 'en' }); }

  console.log('请求博客视频列表，参数:', params);

  try {
    const apiUrl = `/api/blog-videos`;
    const response = await axios.get(apiUrl, { params });

    if (!response.data) {
      throw new Error('无效的响应数据');
    }

    return {
      videos: response.data.videos || [],
      totalVideos: response.data.totalVideos || 0,
      totalPages: response.data.totalPages || 1,
      currentPage: response.data.currentPage || 1
    };
  } catch (error) {
    console.error('获取博客视频列表失败:', error);
    throw error;
  }
};

/**
 * 通过slug获取博客视频
 */
export const getBlogVideoBySlug = async (
  slug: string,
  language = 'en'
): Promise<BlogVideo> => {

  const params: Record<string, string | boolean> = {};
  if (language === 'zh') { Object.assign(params, { locale: 'zh' }); }
  else { Object.assign(params, { locale: 'en' }); }

  console.log(`请求博客视频详情，slug: ${slug}, 参数:`, params);

  try {
    const apiUrl = `/api/blog-videos/${slug}`;
    const response = await axios.get(apiUrl, { params });

    if (!response.data || !response.data.video) {
      throw new Error('无效的响应数据');
    }

    return response.data.video;
  } catch (error) {
    console.error(`获取博客视频详情失败: ${slug}`, error);
    throw error;
  }
};
