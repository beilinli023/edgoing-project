
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AboutHero } from "@/types/aboutTypes";
import { useAboutHeroManager } from "@/hooks/useAboutHeroManager";
import HeroTitleSection from "./hero/HeroTitleSection";
import BackgroundImageSection from "./hero/BackgroundImageSection";

interface AboutHeroManagerProps {
  heroData?: AboutHero;
  onUpdate: (data: AboutHero) => void;
}

const AboutHeroManager: React.FC<AboutHeroManagerProps> = ({ heroData, onUpdate }) => {
  const { heroContent, handleChange } = useAboutHeroManager(heroData, onUpdate);

  const handleImageUpload = () => {
    // Here you would implement image upload functionality
    console.log("Image upload clicked");
    // After successful upload, update the image URL:
    // handleChange('background_image', 'new-image-url.jpg');
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle>页面头图管理</CardTitle>
        <CardDescription>编辑"关于我们"页面顶部的头图和文字</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <HeroTitleSection
            title_en={heroContent.title_en}
            title_zh={heroContent.title_zh}
            subtitle_en={heroContent.subtitle_en}
            subtitle_zh={heroContent.subtitle_zh}
            onChange={handleChange}
          />
          
          <BackgroundImageSection
            backgroundImage={heroContent.background_image}
            onImageUpload={handleImageUpload}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AboutHeroManager;
