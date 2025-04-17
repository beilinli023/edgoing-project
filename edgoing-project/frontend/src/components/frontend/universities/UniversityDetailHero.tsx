import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { PartnerUniversityDetail } from '@/types/studyAbroadTypes';

interface UniversityDetailHeroProps {
  university: PartnerUniversityDetail;
}

const UniversityDetailHero: React.FC<UniversityDetailHeroProps> = ({ university }) => {
  const { currentLanguage } = useLanguage();

  const name = currentLanguage === 'en' ? university.name_en : university.name_zh;
  const location = currentLanguage === 'en' ? university.location_en : university.location_zh;

  // 默认背景图片
  const defaultBackgroundImage = '/Edgoing/stuy%20board/malaysia/Picture-1.png';

  // 处理图片URL，确保它是有效的URL
  const getValidImageUrl = (url) => {
    // 如果URL为空，返回默认图片
    if (!url) return defaultBackgroundImage;

    // 如果URL已经是完整的URL，直接返回
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    // 如果URL是相对路径，确保它以/开头
    return url.startsWith('/') ? url : `/${url}`;
  };

  // 使用featured_image（slideshow）或image作为背景图，如果都没有则使用默认图片
  const backgroundImage = getValidImageUrl(university.featured_image || university.image);

  // 调试信息
  useEffect(() => {
    console.log('Hero background image:', backgroundImage);
  }, [backgroundImage]);

  return (
    <div
      className="relative bg-cover bg-center py-16 md:py-32 text-white"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundColor: '#2c3e50' // 添加背景色，以防图片加载失败时显示空白
      }}
      onError={() => {
        console.error('背景图片加载失败:', backgroundImage);
      }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center pt-16 md:pt-24">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{name}</h1>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mb-8 justify-center">
            <div className="flex items-center justify-center">
              <MapPin className="h-5 w-5 mr-2" />
              <span>{location}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityDetailHero;
