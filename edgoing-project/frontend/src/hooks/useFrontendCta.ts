
import { useQuery } from '@tanstack/react-query';

// Create a mock function as a replacement for now
const getCallToAction = async (language = 'en') => {
  return {
    title: language === 'en' ? 'Ready to begin your journey?' : '准备好开始您的旅程了吗？',
    description: language === 'en' ? 'Contact us today to learn more about our programs.' : '立即联系我们，了解更多关于我们项目的信息。',
    buttonText: language === 'en' ? 'Get Started' : '立即开始',
    buttonUrl: '/start-planning'
  };
};

export const useFrontendCta = (language: 'en' | 'zh') => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['callToAction', language],
    queryFn: () => getCallToAction(language)
  });

  return {
    content: data,
    isLoading,
    error
  };
};
