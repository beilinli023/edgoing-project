import { useState, useEffect } from 'react';
import { getHomeHero } from '@/services/frontend/homeContentService';

interface HeroSlide {
  id: number | string;  // Updated to accept both number and string
  imageUrl: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonUrl: string;
  order: number;
}

// 移除默认轮播图数据

export const useFrontendHeroSlider = (language: 'en' | 'zh' = 'en') => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // 确保语言参数值为'en'或'zh'
  const validLanguage: 'en' | 'zh' = language === 'zh' ? 'zh' : 'en';

  useEffect(() => {
    const fetchHero = async () => {
      setIsLoading(true);
      try {
        console.log(`获取Hero数据，语言: ${validLanguage}`);
        // 使用新的getHomeHero函数获取数据
        const heroData = await getHomeHero(validLanguage);
        console.log('%c✅ useFrontendHeroSlider收到的数据:', 'color: green; font-weight: bold', heroData);

        // 检查数据结构
        console.log('%c✅ 数据结构检查:', 'color: green; font-weight: bold', {
          isArray: Array.isArray(heroData),
          length: Array.isArray(heroData) ? heroData.length : 0,
          firstItem: Array.isArray(heroData) && heroData.length > 0 ? heroData[0] : null,
          rawData: heroData,
          rawDataType: typeof heroData,
          rawDataJSON: JSON.stringify(heroData)
        });

        // 处理数组格式的数据
        if (Array.isArray(heroData) && heroData.length > 0) {
          console.log('%c✅ 检测到数组格式的Hero数据，共 ' + heroData.length + ' 项', 'color: green; font-weight: bold');

          // 打印原始数据的详细信息
          console.log('%c原始数据详细信息:', 'color: blue; font-weight: bold', {
            heroData: heroData,
            firstItem: heroData[0],
            firstItemKeys: heroData[0] ? Object.keys(heroData[0]) : [],
            firstItemImageUrl: heroData[0] ? heroData[0].imageUrl : null
          });

          // 将每个Hero数据转换为轮播图格式
          const heroSlides = heroData.map((item, index) => {
            // 打印原始项目的详细信息
            console.log(`%c原始第 ${index + 1} 项数据:`, 'color: blue; font-weight: bold', {
              item: item,
              keys: Object.keys(item),
              id: item.id,
              title: item.title,
              subtitle: item.subtitle,
              imageUrl: item.imageUrl,
              imageUrlType: typeof item.imageUrl
            });

            // 确保imageUrl字段存在且有效
            let imageUrl = '';
            if (item.imageUrl && typeof item.imageUrl === 'string') {
              imageUrl = item.imageUrl.trim();
              // 如果URL不是以http或/开头，添加/前缀
              if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
                imageUrl = `/${imageUrl}`;
                console.log(`%c修正图片URL格式:`, 'color: blue; font-weight: bold', imageUrl);
              }
            } else if (item.image && typeof item.image === 'string') {
              // 尝试使用备用字段
              imageUrl = item.image.trim();
              console.log(`%c使用备用image字段:`, 'color: blue; font-weight: bold', imageUrl);
            } else if (item.heroimage && typeof item.heroimage === 'string') {
              // 尝试使用另一个备用字段
              imageUrl = item.heroimage.trim();
              console.log(`%c使用备用heroimage字段:`, 'color: blue; font-weight: bold', imageUrl);
            } else {
              // 如果没有有效的图片URL，使用默认图片
              imageUrl = '/images/hero-default.jpg';
              console.log(`%c使用默认图片:`, 'color: orange; font-weight: bold', imageUrl);
            }

            const slide: HeroSlide = {
              id: item.id || `slide-${index}`,
              imageUrl: imageUrl,
              title: item.title || '',
              subtitle: item.subtitle || '',
              buttonText: validLanguage === 'en' ? 'Explore Programs' : '浏览项目',
              buttonUrl: '/programs',
              order: item.order || index
            };

            // 检查图片URL
            console.log(`%c✅ 第 ${index + 1} 张轮播图数据:`, 'color: green; font-weight: bold', {
              id: slide.id,
              title: slide.title,
              subtitle: slide.subtitle,
              imageUrl: slide.imageUrl,
              imageUrlType: typeof slide.imageUrl,
              imageUrlEmpty: !slide.imageUrl
            });

            return slide;
          });

          console.log('%c✅ 转换后的轮播图数据:', 'color: green; font-weight: bold', heroSlides);

          // 尝试预加载第一张图片
          if (heroSlides[0]?.imageUrl) {
            const preloadImage = new Image();
            preloadImage.onload = () => console.log('%c✅ 第一张图片预加载成功:', 'color: green; font-weight: bold', heroSlides[0].imageUrl);
            preloadImage.onerror = (e) => console.log('%c❌ 第一张图片预加载失败:', 'color: red; font-weight: bold', heroSlides[0].imageUrl, e);
            preloadImage.src = heroSlides[0].imageUrl;
          }

          setSlides(heroSlides);
          console.log('%c✅ 最终传递给组件的slides:', 'color: green; font-weight: bold', heroSlides);
          setError(null);
        }
        // 处理单个对象格式的数据（兼容旧格式）
        else if (heroData && typeof heroData === 'object' && 'id' in heroData) {
          console.log('%c✅ 检测到单个对象格式的Hero数据', 'color: green; font-weight: bold');

          // 确保imageUrl字段存在且有效
          let imageUrl = '';
          if (heroData.imageUrl && typeof heroData.imageUrl === 'string') {
            imageUrl = heroData.imageUrl.trim();
            // 如果URL不是以http或/开头，添加/前缀
            if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
              imageUrl = `/${imageUrl}`;
              console.log(`%c修正图片URL格式:`, 'color: blue; font-weight: bold', imageUrl);
            }
          } else if (heroData.image && typeof heroData.image === 'string') {
            // 尝试使用备用字段
            imageUrl = heroData.image.trim();
            console.log(`%c使用备用image字段:`, 'color: blue; font-weight: bold', imageUrl);
          } else if (heroData.heroimage && typeof heroData.heroimage === 'string') {
            // 尝试使用另一个备用字段
            imageUrl = heroData.heroimage.trim();
            console.log(`%c使用备用heroimage字段:`, 'color: blue; font-weight: bold', imageUrl);
          } else {
            // 如果没有有效的图片URL，使用默认图片
            imageUrl = '/images/hero-default.jpg';
            console.log(`%c使用默认图片:`, 'color: orange; font-weight: bold', imageUrl);
          }

          // 将Hero数据转换为轮播图格式
          const heroSlide: HeroSlide = {
            id: heroData.id || 'single-slide',
            imageUrl: imageUrl,
            title: heroData.title || '',
            subtitle: heroData.subtitle || '',
            buttonText: validLanguage === 'en' ? 'Explore Programs' : '浏览项目',
            buttonUrl: '/programs',
            order: 0
          };

          console.log('%c✅ 转换后的轮播图数据:', 'color: green; font-weight: bold', heroSlide);

          // 添加更详细的日志，特别是图片URL
          console.log('%c✅ 图片URL详细信息:', 'color: green; font-weight: bold', {
            url: heroSlide.imageUrl,
            type: typeof heroSlide.imageUrl,
            length: heroSlide.imageUrl ? heroSlide.imageUrl.length : 0,
            startsWithHttp: heroSlide.imageUrl ? heroSlide.imageUrl.startsWith('http') : false,
            startsWithSlash: heroSlide.imageUrl ? heroSlide.imageUrl.startsWith('/') : false,
            containsUploads: heroSlide.imageUrl ? heroSlide.imageUrl.includes('/uploads/') : false
          });

          // 尝试预加载图片以检查是否可访问
          if (heroSlide.imageUrl) {
            const preloadImage = new Image();
            preloadImage.onload = () => console.log('%c✅ 图片预加载成功:', 'color: green; font-weight: bold', heroSlide.imageUrl);
            preloadImage.onerror = (e) => console.log('%c❌ 图片预加载失败:', 'color: red; font-weight: bold', heroSlide.imageUrl, e);
            preloadImage.src = heroSlide.imageUrl;
          }

          setSlides([heroSlide]);
          console.log('%c✅ 最终传递给组件的slides:', 'color: green; font-weight: bold', [heroSlide]);
          setError(null);
        }
      } catch (err) {
        console.error('Error in useFrontendHeroSlider:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch hero data'));
        // 不使用默认数据
        setSlides([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHero();
  }, [validLanguage]);

  return { slides, isLoading, error };
};
