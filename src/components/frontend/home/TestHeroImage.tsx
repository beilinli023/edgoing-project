import React, { useEffect, useState } from 'react';
import { getHomeHero } from '@/services/frontend/homeContentService';

const TestHeroImage: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const heroData = await getHomeHero('zh');
        console.log('%c✅ 测试组件获取的数据:', 'color: green; font-weight: bold', heroData);
        setImageUrl(heroData.imageUrl);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching image:', err);
        setError('Failed to load image');
        setLoading(false);
      }
    };

    fetchImage();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">测试 Hero 图片</h2>
      <div className="mb-4">
        <p>图片 URL: {imageUrl}</p>
      </div>
      <div className="border border-gray-300 p-2 mb-4">
        <h3 className="font-bold mb-2">1. 直接使用 img 标签:</h3>
        <img src={imageUrl} alt="Hero" className="max-w-full h-auto" />
      </div>
      <div className="border border-gray-300 p-2 mb-4">
        <h3 className="font-bold mb-2">2. 使用背景图片样式:</h3>
        <div 
          className="h-[300px] w-full bg-cover bg-center" 
          style={{ backgroundImage: `url(${imageUrl})` }}
        ></div>
      </div>
      <div className="border border-gray-300 p-2">
        <h3 className="font-bold mb-2">3. 使用带渐变的背景图片样式:</h3>
        <div 
          className="h-[300px] w-full bg-cover bg-center" 
          style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${imageUrl})` }}
        ></div>
      </div>
    </div>
  );
};

export default TestHeroImage;
