
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface PageContent {
  titleZh: string;
  titleEn: string;
  descriptionZh: string;
  descriptionEn: string;
  responseTimeZh: string;
  responseTimeEn: string;
  backgroundImage: string;
}

// 模拟页面内容数据
const initialContent: PageContent = {
  titleZh: "开始你的留学计划",
  titleEn: "Start Planning Your Educational Journey",
  descriptionZh: "填写下面的表单，我们的顾问将为您提供专业的建议和定制化的项目推荐。",
  descriptionEn: "Fill out the form below and our advisors will provide you with professional advice and customized program recommendations.",
  responseTimeZh: "我们将在2个工作日内回复您",
  responseTimeEn: "We will respond within 2 business days",
  backgroundImage: "/placeholder.svg"
};

const FormPageSettings = () => {
  const [activeTab, setActiveTab] = useState("chinese");
  const [content, setContent] = useState<PageContent>(initialContent);

  const handleInputChange = (field: keyof PageContent, value: string) => {
    setContent(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // 这里应该调用API保存页面内容
    toast({
      title: "保存成功",
      description: "表单页面内容已更新"
    });
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-4">
        <TabsTrigger value="chinese">中文内容</TabsTrigger>
        <TabsTrigger value="english">英文内容</TabsTrigger>
      </TabsList>

      <TabsContent value="chinese" className="space-y-4">
        <div className="space-y-4">
          <div>
            <Label htmlFor="titleZh">页面标题</Label>
            <Input 
              id="titleZh" 
              value={content.titleZh} 
              onChange={(e) => handleInputChange("titleZh", e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="descriptionZh">页面描述</Label>
            <Textarea 
              id="descriptionZh" 
              value={content.descriptionZh} 
              onChange={(e) => handleInputChange("descriptionZh", e.target.value)}
              rows={4}
            />
          </div>
          
          <div>
            <Label htmlFor="responseTimeZh">响应时间承诺</Label>
            <Input 
              id="responseTimeZh" 
              value={content.responseTimeZh} 
              onChange={(e) => handleInputChange("responseTimeZh", e.target.value)}
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="english" className="space-y-4">
        <div className="space-y-4">
          <div>
            <Label htmlFor="titleEn">Page Title</Label>
            <Input 
              id="titleEn" 
              value={content.titleEn} 
              onChange={(e) => handleInputChange("titleEn", e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="descriptionEn">Page Description</Label>
            <Textarea 
              id="descriptionEn" 
              value={content.descriptionEn} 
              onChange={(e) => handleInputChange("descriptionEn", e.target.value)}
              rows={4}
            />
          </div>
          
          <div>
            <Label htmlFor="responseTimeEn">Response Time Promise</Label>
            <Input 
              id="responseTimeEn" 
              value={content.responseTimeEn} 
              onChange={(e) => handleInputChange("responseTimeEn", e.target.value)}
            />
          </div>
        </div>
      </TabsContent>

      <div className="mt-4">
        <Label>背景图片</Label>
        <div className="flex items-center gap-4 mt-2">
          <img 
            src={content.backgroundImage} 
            alt="背景图片" 
            className="object-cover w-32 h-20 rounded border"
          />
          <Button variant="outline">更换图片</Button>
        </div>
      </div>

      <Button onClick={handleSave} className="mt-6">
        <Save className="mr-2 h-4 w-4" />
        保存页面内容
      </Button>
    </Tabs>
  );
};

export default FormPageSettings;
