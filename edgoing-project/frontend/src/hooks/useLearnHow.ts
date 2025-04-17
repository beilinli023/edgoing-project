import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { LearnHowPage, FaqItemWithCategory } from '@/types/learnHowTypes';
import { getAllFaqs, searchFaqs } from '@/services/frontend/faqService';
import { toast } from 'sonner';

export const useLearnHow = () => {
  const { currentLanguage } = useLanguage();
  const [faqs, setFaqs] = useState<FaqItemWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFaqs, setFilteredFaqs] = useState<FaqItemWithCategory[]>([]);

  // 加载页面内容 (修改为只加载 FAQs)
  useEffect(() => {
    const loadFaqsOnly = async () => {
      try {
        setLoading(true);
        console.log('Fetching FAQs from Strapi...');
        const faqItems = await getAllFaqs(currentLanguage);

        setFaqs(Array.isArray(faqItems) ? faqItems : []);
        setFilteredFaqs(Array.isArray(faqItems) ? faqItems : []);
        setError(null);
      } catch (err) {
        console.error('加载 FAQ 数据失败:', err);
        setError('加载 FAQ 内容失败，请稍后重试');
        toast.error(currentLanguage === 'zh' ? 'FAQ 加载失败' : 'Failed to load FAQs', {
          description: currentLanguage === 'zh' ? '无法加载 FAQ 内容' : 'Unable to load FAQ content'
        });

        // 确保在错误情况下也有默认数据
        setFaqs([]);
        setFilteredFaqs([]);
      } finally {
        setLoading(false);
      }
    };

    loadFaqsOnly();
  }, [currentLanguage]);

  // 处理搜索
  useEffect(() => {
    const handleSearch = async () => {
      if (!searchQuery.trim()) {
        setFilteredFaqs(Array.isArray(faqs) ? faqs : []);
        return;
      }

      try {
        console.log(`Searching FAQs with query: ${searchQuery}`);
        const results = await searchFaqs(searchQuery, currentLanguage);
        setFilteredFaqs(Array.isArray(results) ? results : []);
      } catch (err) {
        console.error('搜索FAQ失败:', err);
        // 使用本地搜索作为降级方案
        if (!Array.isArray(faqs)) {
          setFilteredFaqs([]);
          return;
        }

        const filtered = faqs.filter(faq =>
          (faq.question_en || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (faq.question_zh || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (faq.answer_en || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (faq.answer_zh || '').toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredFaqs(filtered);
      }
    };

    // 使用防抖处理搜索
    const debounceTimeout = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery, faqs]);

  // 根据当前语言获取内容
  const getLocalizedContent = () => {
    // 默认内容
    const defaultContent = {
      hero: {
        title: currentLanguage === 'en' ? "Learn More" : "了解更多",
        subtitle: currentLanguage === 'en'
          ? "Find answers to common questions about our international education programs, activities, and services"
          : "获取有关我们国际教育项目、活动和服务的常见问题解答",
        backgroundImage: "/lovable-uploads/095982ef-a87c-40ba-a4fe-d4d95ab84dae.png"
      },
      contactSection: {
        title: currentLanguage === 'en' ? "Still Have Questions?" : "还有疑问？",
        description: currentLanguage === 'en'
          ? "If you couldn't find the answer to your question, don't hesitate to reach out to us directly. Our advisors are here to help you with any inquiries you may have."
          : "如果您没有找到问题的答案，请随时直接联系我们。我们的顾问将帮助您解答任何疑问。",
        buttonText: currentLanguage === 'en' ? "Ask An Advisor" : "咨询顾问",
        buttonUrl: "/contact"
      }
    };

    return defaultContent;
  };

  // 获取本地化的FAQ列表
  const getLocalizedFaqs = () => {
    const safeFaqs = Array.isArray(filteredFaqs) ? filteredFaqs : [];

    return safeFaqs.map(faq => ({
      id: faq.id,
      question: faq.question || (currentLanguage === 'en' ? (faq.question_en || faq.question_zh) : (faq.question_zh || faq.question_en)),
      answer: faq.answer || (currentLanguage === 'en' ? (faq.answer_en || faq.answer_zh) : (faq.answer_zh || faq.answer_en)),
    }));
  };

  return {
    loading,
    error,
    content: getLocalizedContent(),
    faqs: getLocalizedFaqs(),
    filteredFaqs: getLocalizedFaqs(),
    searchQuery,
    setSearchQuery,
    hasResults: Array.isArray(filteredFaqs) && filteredFaqs.length > 0,
    currentLanguage
  };
};
