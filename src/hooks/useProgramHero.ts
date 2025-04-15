import { useState, useEffect } from 'react';
import { getProgramHero } from '@/services/frontend/homeContentService';
import { useLanguage } from '@/context/LanguageContext';

interface ProgramHero {
  id: string | number;
  title: string;
  subtitle: string;
  imageUrl: string;
}

export const useProgramHero = () => {
  const { currentLanguage } = useLanguage();
  const [hero, setHero] = useState<ProgramHero | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 获取项目页面Hero数据
        const heroData = await getProgramHero(currentLanguage as 'en' | 'zh');
        console.log('获取到的项目Hero数据:', heroData);

        // 直接使用API返回的数据，不使用默认数据
        setHero(heroData);
      } catch (err) {
        console.error('Error in useProgramHero:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch program hero data'));
        // 出错时不使用默认数据，而是设置 hero 为 null
        setHero(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHero();
  }, [currentLanguage]);

  return { hero, isLoading, error };
};

export default useProgramHero;
