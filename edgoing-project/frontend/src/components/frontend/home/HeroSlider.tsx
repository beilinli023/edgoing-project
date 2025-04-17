import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFrontendHeroSlider } from '@/hooks/useFrontendHeroSlider';

interface HeroSliderProps {
  currentLanguage: 'en' | 'zh';
}

const HeroSlider: React.FC<HeroSliderProps> = ({ currentLanguage }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { slides, isLoading } = useFrontendHeroSlider(currentLanguage);
  const [autoPlayInterval, setAutoPlayInterval] = useState<NodeJS.Timeout | null>(null);

  // 默认轮播图数据已移至 useFrontendHeroSlider hook 中
  // 确保 displaySlides 始终是有效的数组
  const displaySlides = Array.isArray(slides) && slides.length > 0 ? slides : [];

  // 打印接收到的轮播图数据
  console.log('%c✅ HeroSlider组件接收到的数据:', 'color: green; font-weight: bold', slides);

  // 添加更详细的调试信息
  console.log('%c✅ HeroSlider组件状态:', 'color: green; font-weight: bold', {
    isLoading,
    slidesCount: slides.length,
    currentLanguage,
    firstSlide: slides.length > 0 ? slides[0] : null,
    allSlides: slides
  });

  // 添加额外的调试信息
  console.log('%c✅ 轮播图数据详细分析:', 'color: blue; font-weight: bold', {
    isArray: Array.isArray(slides),
    isEmpty: slides.length === 0,
    length: slides.length,
    hasValidItems: slides.every(slide => slide && typeof slide === 'object' && 'imageUrl' in slide),
    itemsWithMissingImageUrl: slides.filter(slide => !slide.imageUrl).length,
    allImageUrls: slides.map(slide => slide.imageUrl)
  });

  // 添加更详细的图片URL检查
  if (slides.length > 0 && slides[0].imageUrl) {
    console.log('%c✅ 第一张幻灯片图片URL详细信息:', 'color: green; font-weight: bold', {
      url: slides[0].imageUrl,
      type: typeof slides[0].imageUrl,
      length: slides[0].imageUrl.length,
      startsWithHttp: slides[0].imageUrl.startsWith('http'),
      startsWithSlash: slides[0].imageUrl.startsWith('/'),
      containsUploads: slides[0].imageUrl.includes('/uploads/'),
      fullSlide: slides[0]
    });

    // 尝试预加载图片
    const preloadImage = new Image();
    preloadImage.onload = () => console.log('%c✅ HeroSlider中图片预加载成功:', 'color: green; font-weight: bold', slides[0].imageUrl);
    preloadImage.onerror = (e) => console.log('%c❌ HeroSlider中图片预加载失败:', 'color: red; font-weight: bold', slides[0].imageUrl, e);
    preloadImage.src = slides[0].imageUrl;
  }

  // 添加更详细的slides数组分析
  console.log('%c✅ slides数组详细分析:', 'color: green; font-weight: bold', {
    isArray: Array.isArray(slides),
    isEmpty: slides.length === 0,
    length: slides.length,
    allItems: [...slides], // 展开数组以查看所有元素
    hasValidStructure: slides.length > 0 && slides.every(slide =>
      slide && typeof slide === 'object' && 'imageUrl' in slide && 'title' in slide && 'subtitle' in slide
    ),
    firstItemImageUrl: slides.length > 0 ? slides[0]?.imageUrl : null,
    firstItemImageUrlType: slides.length > 0 ? typeof slides[0]?.imageUrl : null,
    firstItemImageUrlEmpty: slides.length > 0 ? !slides[0]?.imageUrl : true
  });

  // 使用显示的轮播图数据

  // 当slides或language变化时，重置当前幻灯片索引
  useEffect(() => {
    setCurrentSlide(0);
  }, [displaySlides, currentLanguage]);

  // 自动轮播效果
  useEffect(() => {
    if (displaySlides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === displaySlides.length - 1 ? 0 : prev + 1));
    }, 5000); // 每5秒切换一张幻灯片

    setAutoPlayInterval(interval);

    return () => {
      clearInterval(interval);
    };
  }, [displaySlides]); // 仅当displaySlides变化时重新设置

  // 当用户手动切换幻灯片时，重置自动轮播计时器
  const resetAutoPlayTimer = useCallback(() => {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      const newInterval = setInterval(() => {
        setCurrentSlide((prev) => (prev === displaySlides.length - 1 ? 0 : prev + 1));
      }, 5000);
      setAutoPlayInterval(newInterval);
    }
  }, [displaySlides.length, autoPlayInterval]);

  const nextSlide = useCallback(() => {
    if (displaySlides.length > 0) {
      setCurrentSlide((prev) => (prev === displaySlides.length - 1 ? 0 : prev + 1));
      resetAutoPlayTimer();
    }
  }, [displaySlides.length, resetAutoPlayTimer]);

  const prevSlide = useCallback(() => {
    if (displaySlides.length > 0) {
      setCurrentSlide((prev) => (prev === 0 ? displaySlides.length - 1 : prev - 1));
      resetAutoPlayTimer();
    }
  }, [displaySlides.length, resetAutoPlayTimer]);

  if (isLoading) {
    return (
      <div className="relative h-[500px] flex items-center justify-center bg-gray-100">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  // 检查是否有幻灯片可显示
  if (displaySlides.length === 0) {
    console.log('%c❗ 警告: 没有幻灯片可显示', 'color: orange; font-weight: bold');
    return (
      <div className="relative h-[500px] flex items-center justify-center bg-gray-200" style={{ border: '3px dashed purple' }}>
        <div className="text-center">
          <p className="text-xl text-gray-600">暂无内容显示 (slides数组为空)</p>
          <p className="text-sm text-gray-500 mt-2">请检查API返回数据是否正确</p>
        </div>
      </div>
    );
  }

  // 打印slides数组的详细信息
  console.log('%c✅ slides数组详细信息:', 'color: green; font-weight: bold', {
    length: displaySlides.length,
    isEmpty: displaySlides.length === 0,
    isArray: Array.isArray(displaySlides),
    firstItem: displaySlides[0],
    allItems: displaySlides
  });

  // 使用显示的轮播图数据
  // 确保当前幻灯片索引在有效范围内
  const safeCurrentSlide = displaySlides.length > 0 ?
    (currentSlide >= 0 && currentSlide < displaySlides.length ? currentSlide : 0) : 0;
  const slide = displaySlides[safeCurrentSlide];

  // 检查当前幻灯片的数据
  console.log('%c✅ 当前显示的幻灯片:', 'color: green; font-weight: bold', {
    slideIndex: currentSlide,
    slideData: slide,
    hasImageUrl: slide && 'imageUrl' in slide,
    imageUrl: slide?.imageUrl,
    imageUrlEmpty: !slide?.imageUrl,
    imageUrlType: typeof slide?.imageUrl
  });

  // 检查当前幻灯片是否有效
  if (!slide) {
    console.log('%c❌ 错误: 当前幻灯片不存在', 'color: red; font-weight: bold');
    return (
      <div className="relative h-[500px] flex items-center justify-center bg-gray-200" style={{ border: '3px dashed red' }}>
        <div className="text-center">
          <p className="text-xl text-gray-600">幻灯片数据无效</p>
          <p className="text-sm text-gray-500 mt-2">当前幻灯片索引: {currentSlide}, 总数: {displaySlides.length}</p>
        </div>
      </div>
    );
  }

  // 检查当前幻灯片是否有图片URL
  console.log('%c检查当前幻灯片图片URL:', 'color: blue; font-weight: bold', {
    slideImageUrl: slide.imageUrl,
    slideImageUrlType: typeof slide.imageUrl,
    slideImageUrlEmpty: !slide.imageUrl,
    slideImageUrlLength: slide.imageUrl ? slide.imageUrl.length : 0,
    slideImageUrlTrimmedEmpty: typeof slide.imageUrl === 'string' ? slide.imageUrl.trim() === '' : true
  });
  if (!slide.imageUrl || (typeof slide.imageUrl === 'string' && slide.imageUrl.trim() === '')) {
    console.log('%c❌ 错误: 当前幻灯片没有图片URL', 'color: red; font-weight: bold');
    return (
      <div className="relative h-[500px] flex items-center justify-center bg-gray-200" style={{ border: '3px dashed orange' }}>
        <div className="text-center">
          <p className="text-xl text-gray-600">幻灯片图片URL为空</p>
          <p className="text-sm text-gray-500 mt-2">请检查API返回的图片URL是否正确</p>
          <div className="mt-4 p-2 bg-gray-100 rounded text-xs text-left">
            <p><strong>调试信息:</strong></p>
            <p>Slide ID: {slide.id}</p>
            <p>Title: {slide.title}</p>
            <p>Subtitle: {slide.subtitle}</p>
            <p>ImageUrl: {String(slide.imageUrl)}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[500px] overflow-hidden">
      {/* 使用更明确的样式 */}
      <div
        className="absolute inset-0 bg-cover bg-no-repeat transition-transform duration-700 ease-in-out z-10"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${slide.imageUrl || '/images/hero-default.jpg'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          height: '100%',
          width: '100%',
        }}
        onError={() => console.log('%c图片加载失败:', 'color: red; font-weight: bold', slide.imageUrl)}
      >
        <div className="absolute inset-0"></div>
      </div>

      <div className="relative h-full container mx-auto px-4 flex items-center justify-center text-center z-20">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white">{slide.title || ''}</h1>
          <p className="text-xl md:text-2xl mb-8 text-white">{(slide.subtitle || '').replace(/[.!]/g, '')}</p>
          {/* 按钮已移除 */}
        </div>
      </div>

      {displaySlides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
            {displaySlides.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentSlide(index);
                  resetAutoPlayTimer();
                }}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-white' : 'bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HeroSlider;
