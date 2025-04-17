
import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import axios from 'axios';

interface Faq {
  id: string;
  question_en: string;
  question_zh: string;
  answer_en: string;
  answer_zh: string;
  category: string;
  order: number;
  is_hot: boolean;
}

export const useFrontendFaqs = () => {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setIsLoading(true);
        // In a real app, this would be an API call
        // const response = await axios.get('/api/faqs');
        // setFaqs(response.data);
        
        // For now, using mock data
        setFaqs([
          {
            id: "1",
            question_en: "What types of programs do you offer?",
            question_zh: "您提供哪些类型的项目？",
            answer_en: "We offer academic study programs, cultural exchanges, language immersion experiences, internships, and volunteer opportunities across various destinations worldwide.",
            answer_zh: "我们提供学术研究项目、文化交流、语言沉浸体验、实习和全球各地的志愿者机会。",
            category: "programs",
            order: 1,
            is_hot: true
          },
          {
            id: "2",
            question_en: "How long are your study abroad programs?",
            question_zh: "您的留学项目持续多长时间？",
            answer_en: "Our programs range from short-term summer programs (2-8 weeks) to semester-long exchanges (12-16 weeks) and full academic year programs.",
            answer_zh: "我们的项目从短期夏季项目（2-8周）到学期交换（12-16周）和全学年项目不等。",
            category: "programs",
            order: 2,
            is_hot: true
          },
          // Add more mock FAQs here
        ]);
      } catch (error) {
        console.error('Failed to fetch FAQs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  // Get localized questions and answers
  const getLocalizedFaqs = () => {
    return faqs.map(faq => ({
      id: faq.id,
      question: currentLanguage === 'zh' ? faq.question_zh : faq.question_en,
      answer: currentLanguage === 'zh' ? faq.answer_zh : faq.answer_en,
      category: faq.category,
      order: faq.order,
      is_hot: faq.is_hot
    }));
  };

  return {
    faqs: getLocalizedFaqs(),
    isLoading
  };
};
