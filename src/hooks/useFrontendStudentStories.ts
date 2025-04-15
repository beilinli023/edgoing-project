
import { useQuery } from '@tanstack/react-query';
import { getStudentStories } from '@/services/frontend/homeContentService';

export const useFrontendStudentStories = (language: 'en' | 'zh') => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['studentStories', language],
    queryFn: () => getStudentStories(language)
  });

  return {
    stories: data || [],
    isLoading,
    error
  };
};
