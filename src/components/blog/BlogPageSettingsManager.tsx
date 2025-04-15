
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Image } from "lucide-react";

const BlogPageSettingsManager = () => {
  const [pageSettings, setPageSettings] = useState({
    title_en: "YouNiKco Blog",
    title_zh: "YouNiKco 博客",
    description_en: "Discover the latest insights, tips, and stories about international education experiences.",
    description_zh: "发现关于国际教育体验的最新见解、技巧和故事。",
    header_image: "/placeholder.svg",
    posts_per_page: 10
  });

  const handleSave = () => {
    console.log("保存博客页面设置:", pageSettings);
    // 在这里实现保存到API的逻辑
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle>博客页面设置</CardTitle>
        <CardDescription>编辑博客页面的基本设置和显示选项</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium mb-1 block">页面标题 (英文)</label>
              <Input
                value={pageSettings.title_en}
                onChange={e => setPageSettings({ ...pageSettings, title_en: e.target.value })}
                placeholder="YouNiKco Blog"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">页面标题 (中文)</label>
              <Input
                value={pageSettings.title_zh}
                onChange={e => setPageSettings({ ...pageSettings, title_zh: e.target.value })}
                placeholder="YouNiKco 博客"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium mb-1 block">页面描述 (英文)</label>
              <Textarea
                value={pageSettings.description_en}
                onChange={e => setPageSettings({ ...pageSettings, description_en: e.target.value })}
                placeholder="Discover the latest insights, tips, and stories about international education experiences."
                rows={3}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">页面描述 (中文)</label>
              <Textarea
                value={pageSettings.description_zh}
                onChange={e => setPageSettings({ ...pageSettings, description_zh: e.target.value })}
                placeholder="发现关于国际教育体验的最新见解、技巧和故事。"
                rows={3}
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">头部图片</label>
            <div className="flex items-start gap-4">
              <div className="w-40 h-24 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden">
                <Image size={24} className="text-gray-500" />
              </div>
              
              <Button variant="outline">
                <Upload size={16} className="mr-2" />
                上传新头图
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              建议使用分辨率至少为1920x400像素的图片，支持JPG、PNG或WebP格式。
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium mb-1 block">每页显示文章数量</label>
              <Input
                type="number"
                min="1"
                max="20"
                value={pageSettings.posts_per_page}
                onChange={e => setPageSettings({ 
                  ...pageSettings, 
                  posts_per_page: parseInt(e.target.value) || 10 
                })}
                placeholder="10"
              />
              <p className="text-xs text-muted-foreground mt-1">
                设置博客列表页面每页显示的文章数量，推荐值：6-12
              </p>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={handleSave}>保存更改</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogPageSettingsManager;
