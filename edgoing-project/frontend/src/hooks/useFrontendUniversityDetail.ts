
import { useQuery } from '@tanstack/react-query';
import { getUniversityById } from '@/services/frontend/studyAbroadService';
import { toast } from 'sonner';

export const useFrontendUniversityDetail = (id: number, language: 'en' | 'zh') => {
  // 直接使用URL中传入的ID
  console.log(`Fetching university detail for ID: ${id}, language: ${language}`);

  const { data, isLoading, error } = useQuery({
    queryKey: ['universityDetail', id, language],
    queryFn: () => getUniversityById(id, language),
    staleTime: 0, // 禁用缓存，确保每次都重新获取
    refetchOnWindowFocus: false,
    meta: {
      onError: (err) => {
        console.error('University detail content error:', err);
        toast.error(
          language === 'zh'
            ? '加载大学详情时出错，显示备用内容'
            : 'Error loading university details, showing fallback content'
        );
      }
    }
  });

  return {
    university: data,
    isLoading,
    error
  };
};
