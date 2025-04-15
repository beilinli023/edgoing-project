
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImageUploader from "@/components/common/ImageUploader";
import { LearnHowHero } from "@/types/learnHowTypes";

interface LearnHowHeroManagerProps {
  heroContent: LearnHowHero;
  onUpdate: (hero: LearnHowHero) => void;
  isSaving: boolean;
}

const LearnHowHeroManager: React.FC<LearnHowHeroManagerProps> = ({
  heroContent,
  onUpdate,
  isSaving
}) => {
  const [formData, setFormData] = useState<LearnHowHero>(heroContent);

  const handleChange = (field: keyof LearnHowHero, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, background_image: imageUrl }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            <Tabs defaultValue="zh" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="zh">中文内容</TabsTrigger>
                <TabsTrigger value="en">英文内容</TabsTrigger>
              </TabsList>
              
              <TabsContent value="zh" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title_zh">标题</Label>
                  <Input
                    id="title_zh"
                    value={formData.title_zh}
                    onChange={(e) => handleChange("title_zh", e.target.value)}
                    placeholder="输入中文标题"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subtitle_zh">副标题</Label>
                  <Input
                    id="subtitle_zh"
                    value={formData.subtitle_zh}
                    onChange={(e) => handleChange("subtitle_zh", e.target.value)}
                    placeholder="输入中文副标题"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="en" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title_en">Title</Label>
                  <Input
                    id="title_en"
                    value={formData.title_en}
                    onChange={(e) => handleChange("title_en", e.target.value)}
                    placeholder="Enter English title"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subtitle_en">Subtitle</Label>
                  <Input
                    id="subtitle_en"
                    value={formData.subtitle_en}
                    onChange={(e) => handleChange("subtitle_en", e.target.value)}
                    placeholder="Enter English subtitle"
                  />
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="space-y-2">
              <Label>背景图片</Label>
              <div className="mt-2">
                <ImageUploader
                  currentImage={formData.background_image}
                  onImageUpload={handleImageUpload}
                />
              </div>
              <p className="text-xs text-gray-500">建议尺寸: 1920x600 像素</p>
            </div>
            
            <div className="flex justify-end">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "保存中..." : "保存更改"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default LearnHowHeroManager;
