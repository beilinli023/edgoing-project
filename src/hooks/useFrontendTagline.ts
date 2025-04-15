
import { useQuery } from '@tanstack/react-query';
import { getTaglineSection } from '@/services/frontend/homeContentService';

interface TaglineData {
  title: string;
  description: string;
}

export const useFrontendTagline = (language: 'en' | 'zh') => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['taglineSection', language],
    queryFn: () => getTaglineSection(language)
  });

  return {
    content: data,
    isLoading,
    error
  };
};
