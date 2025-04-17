import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

/**
 * 首页标语展示组件
 * 
 * 该组件在首页上展示美观的标语文本，使用不同颜色的文字来强调"Explore. Learn. Grow."的教育理念。
 * 根据当前语言环境显示对应的中文或英文标语。
 * 
 * @component
 * @example
 * ```tsx
 * import { TaglineSection } from '@/components/frontend/home/TaglineSection';
 * 
 * // 在首页中使用
 * function HomePage() {
 *   return (
 *     <div>
 *       <HeroSection />
 *       <TaglineSection />
 *       <FeaturedPrograms />
 *     </div>
 *   );
 * }
 * ```
 * 
 * @returns {JSX.Element} 渲染的标语区块
 */
const TaglineSection: React.FC = () => {
  // 使用语言上下文获取当前语言
  const { currentLanguage } = useLanguage();
  
  // 重置状态，确保动画能被看到
  const [isVisible, setIsVisible] = useState(false);
  const [activeWord, setActiveWord] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  
  // 组件挂载时触发动画
  useEffect(() => {
    // 先设置为不可见
    setIsVisible(false);
    
    // 短暂延迟后显示内容
    const showTimer = setTimeout(() => {
      setIsVisible(true);
      setHasAnimated(true);
    }, 500);
    
    // 设置单词高亮动画
    const interval = setInterval(() => {
      setActiveWord((prev) => (prev + 1) % 3);
    }, 1500);
    
    return () => {
      clearInterval(interval);
      clearTimeout(showTimer);
    };
  }, []);
  
  return (
    <div className="py-16 bg-white">
      <div 
        className={`container mx-auto text-center transition-all duration-1000 ease-in-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        }`}
      >
        <h2 className="text-5xl font-bold mb-4">
          <span 
            className={`transition-all duration-500 inline-block mr-6 ${activeWord === 0 ? 'transform scale-125 shadow-text' : ''}`}
            style={{ color: "#3B82F6" }}
          >
            Explore.
          </span>{' '}
          <span 
            className={`text-green-500 transition-all duration-500 inline-block mx-6 ${activeWord === 1 ? 'transform scale-125 shadow-text' : ''}`}
          >
            Learn.
          </span>{' '}
          <span 
            className={`text-orange-500 transition-all duration-500 inline-block ml-6 ${activeWord === 2 ? 'transform scale-125 shadow-text' : ''}`}
          >
            Grow.
          </span>
        </h2>
        
        {/* 根据当前语言显示相应的标语 */}
        {currentLanguage === 'zh' ? (
          <p 
            className={`text-xl text-gray-600 max-w-2xl mx-auto transition-all duration-1000 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            每一个 EdGoing 项目都是精心打造的探险之旅，旨在超越简单的观光——挑战固有观念、培养共情能力，并赋予学生以全新的方式看待世界和自我。
          </p>
        ) : (
          <p 
            className={`text-xl text-gray-600 max-w-3xl mx-auto transition-all duration-1000 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            Every EdGoing program is a carefully crafted adventure, designed to go beyond sightseeing—challenging assumptions, building empathy, and empowering students to see the world, and themselves, in new ways. Through these transformative experiences, we open minds, build bridges, and create memories that last a lifetime.
          </p>
        )}
      </div>
    </div>
  );
};

export default TaglineSection;
