import { useState, useEffect } from 'react';
import { BlogVideo } from '@/types/blogTypes';
import { getBlogVideos } from '@/services/frontend/blogVideoService';
import { getLocalBlogVideos } from '@/services/blog/localBlogService';

interface UseBlogVideosOptions {
  language?: string;
  page?: number;
  limit?: number;
}

interface UseBlogVideosResult {
  data: BlogVideo[];
  isLoading: boolean;
  error: Error | null;
  totalVideos: number;
  totalPages: number;
  currentPage: number;
  refetch: () => Promise<void>;
}

/**
 * 获取博客视频列表的自定义Hook
 */
export const useBlogVideos = ({
  language = 'en',
  page = 1,
  limit = 2
}: UseBlogVideosOptions = {}): UseBlogVideosResult => {
  const [data, setData] = useState<BlogVideo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalVideos, setTotalVideos] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(page);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log(`获取博客视频，语言: ${language}, 页码: ${page}, 每页数量: ${limit}`);
      
      // 尝试从API获取数据
      const result = await getBlogVideos(language, page, limit);
      
      setData(result.videos);
      setTotalVideos(result.totalVideos);
      setTotalPages(result.totalPages);
      setCurrentPage(result.currentPage);
      
      console.log(`成功获取 ${result.videos.length} 个博客视频`);
    } catch (apiError) {
      console.error('从API获取博客视频失败，尝试使用本地数据:', apiError);
      
      try {
        // 如果API请求失败，尝试使用本地数据
        const localVideos = await getLocalBlogVideos();
        
        // 简单的本地分页
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedVideos = localVideos.slice(startIndex, endIndex);
        const totalLocalVideos = localVideos.length;
        const totalLocalPages = Math.ceil(totalLocalVideos / limit);
        
        setData(paginatedVideos);
        setTotalVideos(totalLocalVideos);
        setTotalPages(totalLocalPages);
        setCurrentPage(page);
        
        console.log(`成功获取 ${paginatedVideos.length} 个本地博客视频`);
      } catch (localError) {
        console.error('获取本地博客视频也失败:', localError);
        setError(apiError as Error);
        setData([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [language, page, limit]);

  return {
    data,
    isLoading,
    error,
    totalVideos,
    totalPages,
    currentPage,
    refetch: fetchData
  };
};
