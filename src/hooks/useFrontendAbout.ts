
import { useQuery } from '@tanstack/react-query';
import { getAboutPageContent } from '@/services/frontend/aboutService';
import { AboutContent } from '@/types/aboutTypes';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from 'sonner';

export const useFrontendAbout = () => {
  const { currentLanguage } = useLanguage();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['aboutContent', currentLanguage],
    queryFn: async () => {
      try {
        const result = await getAboutPageContent(currentLanguage as 'en' | 'zh');
        return result;
      } catch (err) {
        console.error('Error in about content query:', err);
        throw err;
      }
    },
    // 使用默认值确保永远不会返回undefined
    initialData: {
      hero: {
        title_en: "About EdGoing",
        title_zh: "关于 EdGoing",
        subtitle_en: "Empowering global education and cultural exchange",
        subtitle_zh: "赋能全球教育和文化交流",
        background_image: "/lovable-uploads/f0b87c9a-14ef-4e95-ae65-07fe4018b1fc.png"
      },
      mission: {
        title_en: "Our Mission",
        title_zh: "我们的使命",
        content_en: "Redefine education by creating transformative, real-world learning experiences beyond the classroom.",
        content_zh: "通过创造超越课堂的变革性、真实世界的学习体验，重新定义教育。",
        image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070"
      },
      values: [
        {
          id: "1",
          icon: "Globe",
          title_en: "Cultural Respect",
          title_zh: "文化尊重",
          description_en: "Fostering understanding and appreciation",
          description_zh: "培养理解与欣赏"
        }
      ]
    }
  });

  // 帮助函数：基于当前语言获取本地化文本
  const getLocalizedText = (en: string, zh: string): string => {
    return currentLanguage === 'en' ? en : zh;
  };

  return {
    content: data as AboutContent,
    isLoading,
    error,
    getLocalizedText
  };
};
