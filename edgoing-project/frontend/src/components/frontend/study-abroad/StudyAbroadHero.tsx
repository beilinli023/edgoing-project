import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useStudyAbroadHero } from '@/hooks/useStudyAbroadHero';

interface StudyAbroadHeroProps {
  className?: string;
}

const StudyAbroadHero: React.FC<StudyAbroadHeroProps> = ({ className = '' }) => {
  const { currentLanguage } = useLanguage();
  const { hero, isLoading, error } = useStudyAbroadHero(currentLanguage as 'en' | 'zh');

  // 如果正在加载或出错，使用默认样式
  if (isLoading || error || !hero) {
    return (
      <div 
        className={`relative pt-20 pb-32 text-white bg-blue-900 ${className}`}
        style={{
          backgroundImage: `url('/Edgoing/StudyAbroad.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="container-fluid w-full max-w-7xl mx-auto px-4 flex flex-col items-center justify-center mt-24">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            {currentLanguage === 'en' ? 'Study Abroad: Expand Your Horizons' : '留学：拓展你的视野'}
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-90 text-center">
            {currentLanguage === 'en'
              ? 'Embark on a life-changing study abroad journey to explore new cultures, gain a global perspective, and enhance your education.'
              : '踏上改变人生的留学之旅，探索新文化，获得全球视野，并提升你的教育水平。'}
          </p>
        </div>
      </div>
    );
  }

  // 使用从API获取的数据
  return (
    <div 
      className={`relative pt-20 pb-32 text-white bg-blue-900 ${className}`}
      style={{
        backgroundImage: `url('${hero.imageUrl || '/Edgoing/StudyAbroad.jpg'}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="container-fluid w-full max-w-7xl mx-auto px-4 flex flex-col items-center justify-center mt-24">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">{hero.title}</h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-90 text-center">{hero.subtitle}</p>
      </div>
    </div>
  );
};

export default StudyAbroadHero;
