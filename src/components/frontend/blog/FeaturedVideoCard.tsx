import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { BlogVideo } from '@/types/blogTypes';
import BlobVideoPlayer from './BlobVideoPlayer';

interface FeaturedVideoCardProps {
  video: BlogVideo;
  getLocalizedText: (en: string, zh: string) => string;
}

const FeaturedVideoCard: React.FC<FeaturedVideoCardProps> = ({ video, getLocalizedText }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // 在新标签页中打开视频
    if (video.file_url) {
      window.open(video.file_url, '_blank');
    } else if (video.youtube_url) {
      window.open(video.youtube_url, '_blank');
    }
  };

  // 判断缩略图是否是视频
  const isVideoThumbnail = video.thumbnail?.toString().endsWith('.mp4');

  return (
    <Card className="overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-white">
      <div className="relative aspect-video">
        {/* 视频缩略图 */}
        <div className="absolute inset-0 bg-black">
          {isVideoThumbnail ? (
            // 如果缩略图是视频
            <div className="w-full h-full">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                preload="metadata"
              >
                <source src={`${video.thumbnail}#t=0.1`} type="video/mp4" />
                {getLocalizedText('Your browser does not support the video tag.', '您的浏览器不支持视频标签。')}
              </video>
            </div>
          ) : (
            // 如果缩略图是图片
            <img 
              src={typeof video.thumbnail === 'string' ? video.thumbnail : video.thumbnail.url} 
              alt={getLocalizedText(video.title_en, video.title_zh)}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* 播放按钮 */}
        <div 
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
          onClick={handlePlayClick}
        >
          <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center transition-transform duration-300 hover:scale-110">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">
          {getLocalizedText(video.title_en, video.title_zh)}
        </h3>
        {video.category && (
          <div className="flex items-center text-sm text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            {getLocalizedText(video.category.name_en, video.category.name_zh)}
          </div>
        )}
      </div>
    </Card>
  );
};

export default FeaturedVideoCard;
