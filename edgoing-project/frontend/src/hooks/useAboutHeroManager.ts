
import { useState, useEffect } from "react";
import { AboutHero } from "@/types/aboutTypes";

export const useAboutHeroManager = (initialHero?: AboutHero, onUpdateCallback?: (hero: AboutHero) => void) => {
  const [heroContent, setHeroContent] = useState<AboutHero>({
    title_en: "About EdGoing",
    title_zh: "关于 EdGoing",
    subtitle_en: "Empowering global education and cultural exchange",
    subtitle_zh: "赋能全球教育和文化交流",
    background_image: "/lovable-uploads/f0b87c9a-14ef-4e95-ae65-07fe4018b1fc.png"
  });

  useEffect(() => {
    if (initialHero) {
      setHeroContent(initialHero);
    }
  }, [initialHero]);

  const handleChange = (field: keyof AboutHero, value: string) => {
    const updatedHero = { ...heroContent, [field]: value };
    setHeroContent(updatedHero);
    if (onUpdateCallback) onUpdateCallback(updatedHero);
  };

  return {
    heroContent,
    setHeroContent,
    handleChange
  };
};
