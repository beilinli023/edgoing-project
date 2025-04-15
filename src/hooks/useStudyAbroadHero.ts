import { useQuery } from '@tanstack/react-query';
import { getStudyAbroadHero } from '@/services/frontend/studyAbroadService';
import { toast } from 'sonner';

/**
 * 获取留学页面Hero数据的Hook
 * 
 * @param {('en'|'zh')} language - 语言选项，支持英文(en)或中文(zh)
 * @returns 包含留学页面Hero数据、加载状态和错误信息的对象
 */
export const useStudyAbroadHero = (language: 'en' | 'zh') => {
  console.log(`Fetching study abroad hero for language: ${language}`);

  const { data, isLoading, error } = useQuery({
    queryKey: ['studyAbroadHero', language],
    queryFn: () => getStudyAbroadHero(language),
    staleTime: 0, // 禁用缓存，确保每次都重新获取
    refetchOnWindowFocus: false,
    meta: {
      onError: (err) => {
        console.error('Study abroad hero error:', err);
        toast.error(
          language === 'zh'
            ? '加载留学页面Hero内容时出错，显示备用内容'
            : 'Error loading study abroad hero content, showing fallback content'
        );
      }
    }
  });

  return {
    hero: data,
    isLoading,
    error
  };
};

export default useStudyAbroadHero;
