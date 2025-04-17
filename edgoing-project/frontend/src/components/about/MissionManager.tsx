
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Image } from "lucide-react";
import SimpleRichTextEditor from "../wysiwyg/SimpleRichTextEditor";
import { AboutMission } from "@/types/aboutTypes";

interface MissionManagerProps {
  missionData?: AboutMission;
  onUpdate: (data: AboutMission) => void;
}

const MissionManager: React.FC<MissionManagerProps> = ({ missionData, onUpdate }) => {
  const [missionContent, setMissionContent] = useState<AboutMission>({
    title_en: "Our Mission",
    title_zh: "我们的使命",
    content_en: "At YOUNIKCO, we are dedicated to empowering the younger generation to explore the world, experience diverse cultures, and achieve personal growth through transformative educational programs and cultural exchanges.\n\nWe believe that by fostering understanding and appreciation for different cultures, we can contribute to a more connected and compassionate world.",
    content_zh: "在YOUNIKCO，我们致力于赋能年轻一代探索世界，体验多元文化，并通过变革性的教育项目和文化交流实现个人成长。\n\n我们相信，通过培养对不同文化的理解和欣赏，我们可以为建立一个更紧密联系和更有同情心的世界做出贡献。",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070"
  });

  useEffect(() => {
    if (missionData) {
      setMissionContent(missionData);
    }
  }, [missionData]);

  const handleChange = (field: keyof AboutMission, value: string) => {
    const updatedMission = { ...missionContent, [field]: value };
    setMissionContent(updatedMission);
    onUpdate(updatedMission);
  };

  const handleImageUpload = () => {
    // Here you would implement image upload functionality
    console.log("Image upload clicked");
    // After successful upload, update the image URL:
    // handleChange('image', 'new-image-url.jpg');
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle>使命宣言管理</CardTitle>
        <CardDescription>编辑公司的使命宣言内容和配图</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium mb-1 block">标题 (英文)</label>
              <Input
                value={missionContent.title_en}
                onChange={e => handleChange("title_en", e.target.value)}
                placeholder="Our Mission"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">标题 (中文)</label>
              <Input
                value={missionContent.title_zh}
                onChange={e => handleChange("title_zh", e.target.value)}
                placeholder="我们的使命"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium mb-1 block">内容 (英文)</label>
              <SimpleRichTextEditor
                content={missionContent.content_en}
                onChange={(html) => handleChange("content_en", html)}
                placeholder="Describe your company's mission in English"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">内容 (中文)</label>
              <SimpleRichTextEditor
                content={missionContent.content_zh}
                onChange={(html) => handleChange("content_zh", html)}
                placeholder="用中文描述公司的使命"
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">配图</label>
            <div className="flex flex-col md:flex-row items-start gap-4">
              <div className="w-full md:w-1/3 h-40 bg-gray-200 rounded-md overflow-hidden">
                {missionContent.image ? (
                  <img 
                    src={missionContent.image} 
                    alt="Mission illustration" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Image size={24} className="text-gray-500" />
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <Button variant="outline" onClick={handleImageUpload}>
                  <Upload size={16} className="mr-2" />
                  上传新配图
                </Button>
                <p className="text-xs text-muted-foreground">
                  建议使用高质量的图片，与使命宣言内容相关。建议尺寸至少为800x600像素。
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MissionManager;
