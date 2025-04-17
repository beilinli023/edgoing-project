
import axios from "axios";
import { AboutContent, AboutHero, AboutMission, AboutValue } from "@/types/aboutTypes";

// Mock data for development
const defaultAboutContent: AboutContent = {
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
    content_en: "At EdGoing, we are dedicated to empowering the younger generation to explore the world, experience diverse cultures, and achieve personal growth through transformative educational programs and cultural exchanges.\n\nWe believe that by fostering understanding and appreciation for different cultures, we can contribute to a more connected and compassionate world.",
    content_zh: "在EdGoing，我们致力于赋能年轻一代探索世界，体验多元文化，并通过变革性的教育项目和文化交流实现个人成长。\n\n我们相信，通过培养对不同文化的理解和欣赏，我们可以为建立一个更紧密联系和更有同情心的世界做出贡献。",
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
      description_zh: "确保参与者的健康福祉"
    },
    {
      id: "5",
      icon: "Globe2",
      title_en: "Global Citizenship",
      title_zh: "全球公民意识",
      description_en: "Nurturing responsible world citizens",
      description_zh: "培养负责任的世界公民"
    }
  ]
};

// Get the full about page content
export const getAboutContent = async (): Promise<AboutContent> => {
  try {
    const response = await axios.get("/api/about");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch about content:", error);
    return defaultAboutContent;
  }
};

// Update the hero section
export const updateAboutHero = async (hero: AboutHero): Promise<AboutHero> => {
  try {
    const response = await axios.put("/api/about/hero", hero);
    return response.data;
  } catch (error) {
    console.error("Failed to update hero content:", error);
    // Return the input data as fallback
    return hero;
  }
};

// Update the mission section
export const updateAboutMission = async (mission: AboutMission): Promise<AboutMission> => {
  try {
    const response = await axios.put("/api/about/mission", mission);
    return response.data;
  } catch (error) {
    console.error("Failed to update mission content:", error);
    return mission;
  }
};

// Update all values
export const updateAboutValues = async (values: AboutValue[]): Promise<AboutValue[]> => {
  try {
    const response = await axios.put("/api/about/values", { values });
    return response.data;
  } catch (error) {
    console.error("Failed to update values:", error);
    return values;
  }
};

// Save all about content at once
export const saveAboutContent = async (content: AboutContent): Promise<AboutContent> => {
  try {
    const response = await axios.put("/api/about", content);
    return response.data;
  } catch (error) {
    console.error("Failed to save about content:", error);
    return content;
  }
};
