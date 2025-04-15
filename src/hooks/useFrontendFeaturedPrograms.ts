
import { useQuery } from '@tanstack/react-query';
import { getFeaturedPrograms, getFeaturedProgramsIntro } from '@/services/frontend/homeContentService';

export const useFrontendFeaturedPrograms = (language: 'en' | 'zh') => {
  const { data: programs, isLoading: isProgramsLoading, error: programsError } = useQuery({
    queryKey: ['featuredPrograms', language],
    queryFn: () => getFeaturedPrograms(language)
  });

  const { data: intro, isLoading: isIntroLoading, error: introError } = useQuery({
    queryKey: ['featuredProgramsIntro', language],
    queryFn: () => getFeaturedProgramsIntro(language)
  });

  return {
    programs: programs || [],
    intro: intro || null,
    isLoading: isProgramsLoading || isIntroLoading,
    error: programsError || introError
  };
};
