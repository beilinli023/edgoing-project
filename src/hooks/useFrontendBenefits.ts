
import { useQuery } from '@tanstack/react-query';

// Create a mock function as a replacement for now
const getBenefitsSection = async (language = 'en') => {
  return {
    title: language === 'en' ? 'Program Benefits' : '项目优势',
    description: language === 'en' ? 'Our programs offer the following benefits' : '我们的项目提供以下优势',
    benefits: []
  };
};

export const useFrontendBenefits = (language: 'en' | 'zh') => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['benefitsSection', language],
    queryFn: () => getBenefitsSection(language)
  });

  return {
    content: data,
    isLoading,
    error
  };
};
