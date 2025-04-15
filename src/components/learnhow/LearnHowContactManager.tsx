
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { LearnHowContactSection } from "@/types/learnHowTypes";

interface LearnHowContactManagerProps {
  contactContent: LearnHowContactSection;
  onUpdate: (contact: LearnHowContactSection) => void;
  isSaving: boolean;
}

const LearnHowContactManager: React.FC<LearnHowContactManagerProps> = ({
  contactContent,
  onUpdate,
  isSaving
}) => {
  const [formData, setFormData] = useState<LearnHowContactSection>(contactContent);

  const handleChange = (field: keyof LearnHowContactSection, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
                  <Label htmlFor="description_zh">描述</Label>
                  <Textarea
                    id="description_zh"
                    value={formData.description_zh}
                    onChange={(e) => handleChange("description_zh", e.target.value)}
                    placeholder="输入中文描述"
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="button_text_zh">按钮文本</Label>
                  <Input
                    id="button_text_zh"
                    value={formData.button_text_zh}
                    onChange={(e) => handleChange("button_text_zh", e.target.value)}
                    placeholder="输入中文按钮文本"
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
                  <Label htmlFor="description_en">Description</Label>
                  <Textarea
                    id="description_en"
                    value={formData.description_en}
                    onChange={(e) => handleChange("description_en", e.target.value)}
                    placeholder="Enter English description"
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="button_text_en">Button Text</Label>
                  <Input
                    id="button_text_en"
                    value={formData.button_text_en}
                    onChange={(e) => handleChange("button_text_en", e.target.value)}
                    placeholder="Enter English button text"
                  />
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="space-y-2">
              <Label htmlFor="button_url">按钮链接</Label>
              <Input
                id="button_url"
                value={formData.button_url}
                onChange={(e) => handleChange("button_url", e.target.value)}
                placeholder="输入按钮链接 (例如: /contact)"
              />
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

export default LearnHowContactManager;
