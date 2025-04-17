
import { useState, useEffect } from "react";
import { AboutContent, AboutHero, AboutMission, AboutValue } from "@/types/aboutTypes";
import { getAboutContent, updateAboutHero, updateAboutMission, updateAboutValues } from "@/services/aboutService";
import { useLanguage } from "@/context/LanguageContext";

// Default values that match the design in the image
const defaultHero: AboutHero = {
  title_en: "About EdGoing",
  title_zh: "关于 EdGoing",
  subtitle_en: "Empowering global education and cultural exchange",
  subtitle_zh: "赋能全球教育和文化交流",
  background_image: "/lovable-uploads/46fca3c1-4f18-4f48-935c-a97e8bb6eeb8.png"
};

const defaultMission: AboutMission = {
  title_en: "Our Mission",
  title_zh: "我们的使命",
  content_en: "Redefine education by creating transformative, real-world learning experiences beyond the classroom.\n\nBridge cultures and foster global connections through curated educational travel programs.\n\nInspire curiosity and personal growth through immersive, hands-on learning opportunities.\n\nPartner with top universities worldwide to offer high-quality programs in fields like AI, technology, and humanities.\n\nEmpower students from China and around the world to explore new fields and develop critical skills.\n\nShape the future by cultivating thoughtful, innovative, and globally-minded leaders.",
  content_zh: "通过创造超越课堂的变革性、真实世界的学习体验，重新定义教育。\n\n通过精心策划的教育旅行项目，架起文化桥梁，促进全球连接。\n\n通过沉浸式、实践性的学习机会，激发好奇心和个人成长。\n\n与全球顶级大学合作，提供人工智能、技术、人文学科等领域的高质量课程。\n\n赋能来自中国及世界各地的学生，探索新领域并发展关键技能。\n\n通过培养富有思想、创新和全球视野的领导者，塑造未来。",
  image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070"
};

const defaultValues: AboutValue[] = [
  {
    id: "1",
    icon: "Globe",
    title_en: "Cultural Respect",
    title_zh: "文化尊重",
    description_en: "Fostering understanding and appreciation",
    description_zh: "培养理解与欣赏"
  },
  {
    id: "2",
    icon: "BookOpen",
    title_en: "Educational Excellence",
    title_zh: "教育卓越",
    description_en: "Providing high-quality learning experiences",
    description_zh: "提供高质量的学习体验"
  },
  {
    id: "3",
    icon: "UserPlus",
    title_en: "Personal Growth",
    title_zh: "个人成长",
    description_en: "Encouraging individual development",
    description_zh: "鼓励个人发展"
  },
  {
    id: "4",
    icon: "Shield",
    title_en: "Safety and Support",
    title_zh: "安全与支持",
    description_en: "Ensuring well-being of our participants",
    description_zh: "确保参与者的福祉"
  },
  {
    id: "5",
    icon: "CheckCircle",
    title_en: "Global Citizenship",
    title_zh: "全球公民意识",
    description_en: "Nurturing responsible world citizens",
    description_zh: "培养负责任的世界公民"
  }
];

const defaultContent: AboutContent = {
  hero: defaultHero,
  mission: defaultMission,
  values: defaultValues
};

export const useAboutContent = () => {
  const [content, setContent] = useState<AboutContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      try {
        const data = await getAboutContent();
        // If we get valid data from the API, use it
        if (data && Object.keys(data).length > 0) {
          // Merge with defaults to ensure all required fields exist
          const mergedData = {
            hero: { ...defaultHero, ...data.hero },
            mission: { ...defaultMission, ...data.mission },
            values: data.values?.length > 0 ? data.values : defaultValues
          };
          setContent(mergedData);
        } else {
          // If no data or empty data, use defaults
          setContent(defaultContent);
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching about content:", err);
        // On error, fall back to default content
        setContent(defaultContent);
        setError("Failed to load about page content from API, using defaults");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  const updateHero = async (hero: AboutHero) => {
    if (!content) return false;
    try {
      const updatedHero = await updateAboutHero(hero);
      setContent({ ...content, hero: updatedHero });
      return true;
    } catch (err) {
      console.error("Error updating hero:", err);
      return false;
    }
  };

  const updateMission = async (mission: AboutMission) => {
    if (!content) return false;
    try {
      const updatedMission = await updateAboutMission(mission);
      setContent({ ...content, mission: updatedMission });
      return true;
    } catch (err) {
      console.error("Error updating mission:", err);
      return false;
    }
  };

  const updateValues = async (values: AboutValue[]) => {
    if (!content) return false;
    try {
      const updatedValues = await updateAboutValues(values);
      setContent({ ...content, values: updatedValues });
      return true;
    } catch (err) {
      console.error("Error updating values:", err);
      return false;
    }
  };

  // Helper function to get localized content - make sure it accepts two parameters
  const getLocalizedText = (en: string, zh: string): string => {
    return currentLanguage === 'en' ? en : zh;
  };

  return {
    content,
    isLoading,
    error,
    updateHero,
    updateMission,
    updateValues,
    getLocalizedText
  };
};
