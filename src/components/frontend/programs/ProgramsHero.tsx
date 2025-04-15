import React from 'react';
import { useLanguage } from "@/context/LanguageContext";
import { useProgramHero } from '@/hooks/useProgramHero';
import { Skeleton } from '@/components/ui/skeleton';

const ProgramsHero: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const { hero, isLoading, error } = useProgramHero();

  console.log('ProgramsHero 组件渲染:', { hero, isLoading, error });

  // 如果正在加载，显示加载状态
  if (isLoading) {
    return (
      <div className="relative pt-20 pb-32 text-white bg-gray-800">
        <div className="container-fluid w-full max-w-7xl mx-auto px-4 flex flex-col items-center justify-center mt-24 relative z-10">
          <Skeleton className="h-12 w-3/4 mb-6 bg-gray-300 bg-opacity-30" />
          <Skeleton className="h-6 w-full max-w-3xl mb-2 bg-gray-300 bg-opacity-30" />
          <Skeleton className="h-6 w-5/6 max-w-3xl bg-gray-300 bg-opacity-30" />
        </div>
      </div>
    );
  }

  // 如果有错误或没有数据，显示错误信息
  if (error || !hero) {
    console.log('没有获取到 Hero 数据或发生错误:', error);
    return (
      <div className="relative pt-20 pb-32 text-white bg-red-900">
        <div className="container-fluid w-full max-w-7xl mx-auto px-4 flex flex-col items-center justify-center mt-24 relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            {currentLanguage === 'en' ? 'Error Loading Content' : '加载内容时出错'}
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-90 text-center">
            {currentLanguage === 'en' ? 'Please try again later or contact support.' : '请稍后再试或联系支持。'}
          </p>
        </div>
      </div>
    );
  }

  // 正常显示内容
  return (
    <div
      className="relative pt-20 pb-32 text-white"
      style={{
        backgroundImage: `url('${hero.imageUrl}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 30%',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* 移除黑色遮罩层 */}
      <div className="container-fluid w-full max-w-7xl mx-auto px-4 flex flex-col items-center justify-center mt-24 relative z-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center shadow-text">
          {hero.title}
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-90 text-center shadow-text">
          {hero.subtitle}
        </p>
      </div>
    </div>
  );
};

export default ProgramsHero;
