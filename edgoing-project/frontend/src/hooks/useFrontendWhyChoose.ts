
import { useQuery } from '@tanstack/react-query';

// Create a mock function as a replacement for now
const getWhyChooseSection = async (language = 'en') => {
  return {
    title: language === 'en' ? 'Why Choose EdGoing' : '为什么选择EdGoing',
    description: language === 'en' ? 'We provide exceptional educational experiences' : '我们提供卓越的教育体验',
    features: []
  };
};

export const useFrontendWhyChoose = (language: 'en' | 'zh') => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['whyChooseSection', language],
    queryFn: () => getWhyChooseSection(language)
  });

  return {
    content: data,
    isLoading,
    error
  };
};
