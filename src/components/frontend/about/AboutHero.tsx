import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAboutHero } from '@/hooks/useAboutHero';

interface AboutHeroProps {
  className?: string;
}

const AboutHero: React.FC<AboutHeroProps> = ({ className = '' }) => {
  const { currentLanguage } = useLanguage();
  const { hero, isLoading, error } = useAboutHero(currentLanguage as 'en' | 'zh');

  // 如果正在加载或出错，使用默认样式
  if (isLoading || error || !hero) {
    return (
      <div 
        className={`relative pt-20 pb-32 text-white ${className}`}
        style={{
          backgroundImage: `url('/Edgoing/MeetEdgoing.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="container-fluid w-full max-w-7xl mx-auto px-4 flex flex-col items-center justify-center mt-24">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            {currentLanguage === 'en' ? 'About EdGoing' : '关于 EdGoing'}
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-90 text-center">
            {currentLanguage === 'en'
              ? 'Empowering global education and cultural exchange'
              : '赋能全球教育和文化交流'}
          </p>
        </div>
      </div>
    );
  }

  // 使用从API获取的数据
  return (
    <div 
      className={`relative pt-20 pb-32 text-white ${className}`}
      style={{
        backgroundImage: `url('${hero.imageUrl || '/Edgoing/MeetEdgoing.jpg'}')`,
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

export default AboutHero;
