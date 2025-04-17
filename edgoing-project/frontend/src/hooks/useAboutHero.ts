import { useQuery } from '@tanstack/react-query';
import { getAboutHero } from '@/services/frontend/aboutService';
import { toast } from 'sonner';

/**
 * 获取关于页面Hero数据的Hook
 * 
 * @param {('en'|'zh')} language - 语言选项，支持英文(en)或中文(zh)
 * @returns 包含关于页面Hero数据、加载状态和错误信息的对象
 */
export const useAboutHero = (language: 'en' | 'zh') => {
  console.log(`Fetching about hero for language: ${language}`);

  const { data, isLoading, error } = useQuery({
    queryKey: ['aboutHero', language],
    queryFn: () => getAboutHero(language),
    staleTime: 0, // 禁用缓存，确保每次都重新获取
    refetchOnWindowFocus: false,
    meta: {
      onError: (err) => {
        console.error('About hero error:', err);
        toast.error(
          language === 'zh'
            ? '加载关于页面Hero内容时出错，显示备用内容'
            : 'Error loading about hero content, showing fallback content'
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

export default useAboutHero;
