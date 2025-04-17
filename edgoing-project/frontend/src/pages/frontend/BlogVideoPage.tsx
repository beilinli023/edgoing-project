import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import FrontendLayout from '@/components/frontend/FrontendLayout';
import { useBlogVideos } from '@/hooks/useBlogVideos';
import FeaturedVideoCard from '@/components/frontend/blog/FeaturedVideoCard';
import BlogPagination from '@/components/frontend/blog/BlogPagination';
import { Skeleton } from '@/components/ui/skeleton';

const BlogVideoPage: React.FC = () => {
  // 语言设置
  const { currentLanguage } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // 每页显示4个视频

  // 获取博客视频数据
  const {
    data: videos,
    isLoading,
    error,
    totalPages
  } = useBlogVideos({
    language: currentLanguage,
    page: currentPage,
    limit: itemsPerPage
  });

  // 根据当前语言获取本地化文本
  const getLocalizedText = (en: string, zh: string) => {
    return currentLanguage === 'en' ? en : zh;
  };

  // 处理页码变化
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // 滚动到页面顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <FrontendLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">
          {getLocalizedText('Featured Videos', '精选视频')}
        </h1>

        {/* 加载状态 */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array(itemsPerPage).fill(0).map((_, index) => (
              <div key={index} className="flex flex-col bg-white overflow-hidden">
                <div className="relative">
                  <Skeleton className="w-full aspect-video rounded-none" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Skeleton className="w-16 h-16 rounded-full" />
                  </div>
                </div>
                <div className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 错误状态 */}
        {!isLoading && error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center">
            <div className="text-red-500 mb-2">
              {getLocalizedText('Error loading videos', '加载视频时出错')}
            </div>
            <p className="text-gray-600">
              {getLocalizedText('Please try again later', '请稍后再试')}
            </p>
          </div>
        )}

        {/* 空状态 */}
        {!isLoading && !error && videos.length === 0 && (
          <div className="bg-white border border-gray-100 rounded-sm p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="text-gray-400"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-500 mb-2">{getLocalizedText('Blog Video Feature Coming Soon!', '博客视频功能即将推出！')}</p>
            <p className="text-sm text-gray-400">{getLocalizedText('We are currently developing this feature. Please check back later.', '我们正在开发这个功能。请稍后再来查看。')}</p>
            <div className="mt-6 p-4 bg-blue-50 rounded-md text-blue-700 text-sm">
              <p className="font-medium">{getLocalizedText('Note for Administrators:', '管理员注意事项：')}</p>
              <p className="mt-1">{getLocalizedText('To enable this feature, please create a "blogvideo" content type in Strapi with the following fields:', '要启用此功能，请在 Strapi 中创建一个“blogvideo”内容类型，并包含以下字段：')}</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>title (Text)</li>
                <li>description (Rich Text)</li>
                <li>slug (UID)</li>
                <li>thumbnail (Media)</li>
                <li>video (Media)</li>
                <li>category (Relation)</li>
                <li>publishedAt (Date)</li>
              </ul>
            </div>
          </div>
        )}

        {/* 视频列表 */}
        {!isLoading && !error && videos.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {videos.map((video) => (
                <FeaturedVideoCard
                  key={video.id}
                  video={video}
                  getLocalizedText={getLocalizedText}
                />
              ))}
            </div>

            {/* 分页控件 */}
            {totalPages > 1 && (
              <div className="mt-12 mb-8">
                <BlogPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  goToNextPage={() => handlePageChange(currentPage + 1)}
                  goToPreviousPage={() => handlePageChange(currentPage - 1)}
                  goToPage={handlePageChange}
                  getLocalizedText={getLocalizedText}
                />
              </div>
            )}
          </>
        )}
      </div>
    </FrontendLayout>
  );
};

export default BlogVideoPage;
