import React, { useState } from "react";
import { BlogVideo } from "@/types/blogTypes";
import FeaturedVideoCard from "./FeaturedVideoCard";
import { Skeleton } from "@/components/ui/skeleton";
import BlogPagination from "./BlogPagination";

interface FeaturedVideosSectionProps {
  videos: BlogVideo[];
  isLoading: boolean;
  getLocalizedText: (en: string, zh: string) => string;
}

const FeaturedVideosSection: React.FC<FeaturedVideosSectionProps> = ({
  videos,
  isLoading,
  getLocalizedText
}) => {
  const itemsPerPage = 2; // 每页显示2个视频，符合需求
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil((videos?.length || 0) / itemsPerPage);

  // 获取当前页的视频
  const paginatedVideos = () => {
    if (!videos || !Array.isArray(videos)) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return videos.slice(startIndex, endIndex) || [];
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // 加载状态下显示骨架屏
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array(2).fill(0).map((_, index) => (
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
    );
  }

  // 没有视频时显示空状态
  if (!videos || videos.length === 0) {
    return (
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
        <p className="text-gray-500 mb-2">{getLocalizedText('No videos available at the moment', '暂无视频内容')}</p>
        <p className="text-sm text-gray-400">{getLocalizedText('Please check back later for our latest videos', '请稍后查看我们的最新视频')}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paginatedVideos().map((video) => (
          <FeaturedVideoCard
            key={video.id}
            video={video}
            getLocalizedText={getLocalizedText}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8">
          <BlogPagination
            currentPage={currentPage}
            totalPages={totalPages}
            goToNextPage={goToNextPage}
            goToPreviousPage={goToPreviousPage}
            goToPage={goToPage}
            getLocalizedText={getLocalizedText}
          />
        </div>
      )}
    </div>
  );
};

export default FeaturedVideosSection;
