
import { useQuery } from '@tanstack/react-query';
import { getHeroSlides } from '@/services/frontendContentService';

export const useFrontendHomeContent = (language: 'en' | 'zh') => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['heroSlides', language],
    queryFn: () => getHeroSlides(language)
  });

  return {
    heroSlides: data || [],
    isLoading,
    error
  };
};
