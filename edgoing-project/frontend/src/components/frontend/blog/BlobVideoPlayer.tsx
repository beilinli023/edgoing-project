import React, { useState, useEffect } from 'react';

interface BlobVideoPlayerProps {
  videoUrl: string;
  title?: string;
  className?: string;
  getLocalizedText?: (en: string, zh: string) => string;
}

/**
 * 使用Blob方式播放视频组件
 * 通过fetch获取视频文件并创建Blob URL来绕过CORS限制
 */
const BlobVideoPlayer: React.FC<BlobVideoPlayerProps> = ({
  videoUrl,
  title,
  className = '',
  getLocalizedText = (en, zh) => en // 默认使用英文
}) => {
  const [videoSrc, setVideoSrc] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 加载视频内容并创建Blob URL
  useEffect(() => {
    let isMounted = true;
    
    const loadVideo = async () => {
      try {
        if (!videoUrl) {
          throw new Error('未提供视频URL');
        }
        
        setLoading(true);
        setError(null);
        
        // 构建完整URL
        const fullUrl = videoUrl.startsWith('http') 
          ? videoUrl 
          : `${window.location.origin}${videoUrl}`;
        
        console.log(`尝试加载视频: ${fullUrl}`);
        
        // 获取视频内容
        const response = await fetch(fullUrl);
        if (!response.ok) {
          throw new Error(`获取视频失败: ${response.status} ${response.statusText}`);
        }
        
        console.log('正在下载视频数据...');
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        
        console.log(`视频Blob URL已创建: ${blobUrl}`);
        
        if (isMounted) {
          setVideoSrc(blobUrl);
          setLoading(false);
        }
      } catch (err) {
        console.error('加载视频出错:', err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : String(err));
          setLoading(false);
        }
      }
    };
    
    loadVideo();
    
    // 清理函数
    return () => {
      isMounted = false;
      // 确保清理现有的Blob URL，避免内存泄漏
      if (videoSrc) {
        URL.revokeObjectURL(videoSrc);
      }
    };
  }, [videoUrl, videoSrc]); // 添加videoSrc到依赖数组中

  // 在新标签页中打开视频
  const openVideoInNewTab = () => {
    const fullUrl = videoUrl.startsWith('http') 
      ? videoUrl 
      : `${window.location.origin}${videoUrl}`;
    window.open(fullUrl, '_blank');
  };

  // 下载视频
  const downloadVideo = () => {
    const fullUrl = videoUrl.startsWith('http') 
      ? videoUrl 
      : `${window.location.origin}${videoUrl}`;
      
    const link = document.createElement('a');
    link.href = fullUrl;
    link.download = title || 'video';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 aspect-video rounded ${className}`}>
        <div className="text-center p-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-600">{getLocalizedText('Loading video...', '正在加载视频...')}</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center bg-gray-100 aspect-video rounded p-4 ${className}`}>
        <p className="text-red-500 mb-3">{getLocalizedText('Cannot load video:', '无法加载视频:')} {error}</p>
        <div className="flex space-x-3">
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            onClick={openVideoInNewTab}
          >
            {getLocalizedText('Open in new tab', '在新标签页中打开')}
          </button>
          <button 
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            onClick={downloadVideo}
          >
            {getLocalizedText('Download video', '下载视频')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {title && <h3 className="font-semibold mb-2">{title}</h3>}
      <video controls className="w-full aspect-video rounded" src={videoSrc} />
    </div>
  );
};

export default BlobVideoPlayer;
